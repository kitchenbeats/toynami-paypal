-- ============================================
-- Flexible Customer Group System with Optional Spending Thresholds
-- ============================================

-- Add flexible assignment columns to customer_groups
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS assignment_method TEXT DEFAULT 'manual' CHECK (assignment_method IN ('manual', 'automatic', 'hybrid'));
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS spend_min_cents INTEGER DEFAULT NULL CHECK (spend_min_cents IS NULL OR spend_min_cents >= 0);
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS spend_max_cents INTEGER DEFAULT NULL CHECK (spend_max_cents IS NULL OR spend_max_cents >= 0);
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS spend_period TEXT DEFAULT 'lifetime' CHECK (spend_period IN ('lifetime', 'annual', 'quarterly', 'monthly'));
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS auto_assign_on_first_purchase BOOLEAN DEFAULT false;
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS auto_assign BOOLEAN DEFAULT false;
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS auto_remove BOOLEAN DEFAULT false;
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS allow_manual_override BOOLEAN DEFAULT true;
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '{}'::jsonb;
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS free_shipping_threshold_cents INTEGER DEFAULT NULL CHECK (free_shipping_threshold_cents IS NULL OR free_shipping_threshold_cents >= 0);
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN DEFAULT false;
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS badge_color TEXT DEFAULT NULL;
ALTER TABLE customer_groups 
  ADD COLUMN IF NOT EXISTS badge_icon TEXT DEFAULT NULL;

-- Add spending tracking to users
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS lifetime_spend_cents INTEGER DEFAULT 0;
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS current_year_spend_cents INTEGER DEFAULT 0;
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS current_quarter_spend_cents INTEGER DEFAULT 0;
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS current_month_spend_cents INTEGER DEFAULT 0;
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS first_purchase_date TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS last_purchase_date TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS total_orders_count INTEGER DEFAULT 0;
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS last_spend_calculation_at TIMESTAMPTZ DEFAULT NOW();

-- Create spend history tracking table
CREATE TABLE IF NOT EXISTS customer_spend_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  spend_type TEXT NOT NULL DEFAULT 'purchase' CHECK (spend_type IN ('purchase', 'refund', 'adjustment')),
  previous_lifetime_cents INTEGER NOT NULL,
  new_lifetime_cents INTEGER NOT NULL,
  previous_year_cents INTEGER NOT NULL,
  new_year_cents INTEGER NOT NULL,
  previous_quarter_cents INTEGER NOT NULL,
  new_quarter_cents INTEGER NOT NULL,
  previous_month_cents INTEGER NOT NULL,
  new_month_cents INTEGER NOT NULL,
  triggered_group_changes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create group assignment history
CREATE TABLE IF NOT EXISTS customer_group_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES customer_groups(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('added', 'removed', 'upgraded', 'downgraded')),
  reason TEXT NOT NULL CHECK (reason IN ('manual', 'automatic_spend', 'first_purchase', 'period_expired', 'admin_override')),
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraint to ensure spending thresholds make sense
ALTER TABLE customer_groups ADD CONSTRAINT check_spend_range 
  CHECK (spend_min_cents IS NULL OR spend_max_cents IS NULL OR spend_min_cents <= spend_max_cents);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_lifetime_spend ON users(lifetime_spend_cents);
CREATE INDEX IF NOT EXISTS idx_users_first_purchase ON users(first_purchase_date);
CREATE INDEX IF NOT EXISTS idx_spend_history_user ON customer_spend_history(user_id);
CREATE INDEX IF NOT EXISTS idx_spend_history_order ON customer_spend_history(order_id);
CREATE INDEX IF NOT EXISTS idx_group_history_user ON customer_group_history(user_id);
CREATE INDEX IF NOT EXISTS idx_group_history_group ON customer_group_history(group_id);
CREATE INDEX IF NOT EXISTS idx_customer_groups_auto_assign ON customer_groups(auto_assign) WHERE auto_assign = true;

-- ============================================
-- Functions for automatic group assignment
-- ============================================

-- Function to calculate user spending for different periods
CREATE OR REPLACE FUNCTION calculate_user_spending(
  p_user_id UUID,
  p_period TEXT DEFAULT 'lifetime'
) RETURNS INTEGER AS $$
DECLARE
  v_total_cents INTEGER;
  v_start_date TIMESTAMPTZ;
BEGIN
  -- Determine the start date based on period
  CASE p_period
    WHEN 'monthly' THEN
      v_start_date := date_trunc('month', NOW());
    WHEN 'quarterly' THEN
      v_start_date := date_trunc('quarter', NOW());
    WHEN 'annual' THEN
      v_start_date := date_trunc('year', NOW());
    ELSE -- lifetime
      v_start_date := '1900-01-01'::TIMESTAMPTZ;
  END CASE;

  -- Calculate total spending
  SELECT COALESCE(SUM(total_cents), 0) INTO v_total_cents
  FROM orders
  WHERE user_id = p_user_id
    AND status IN ('completed', 'shipped', 'delivered')
    AND created_at >= v_start_date;

  RETURN v_total_cents;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user qualifies for a group
CREATE OR REPLACE FUNCTION user_qualifies_for_group(
  p_user_id UUID,
  p_group_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_group customer_groups%ROWTYPE;
  v_user_spend INTEGER;
  v_user users%ROWTYPE;
BEGIN
  -- Get group details
  SELECT * INTO v_group FROM customer_groups WHERE id = p_group_id;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- If manual only, return false (can't auto-qualify)
  IF v_group.assignment_method = 'manual' THEN
    RETURN FALSE;
  END IF;

  -- Get user details
  SELECT * INTO v_user FROM users WHERE id = p_user_id;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Check first purchase trigger
  IF v_group.auto_assign_on_first_purchase 
    AND v_user.first_purchase_date IS NOT NULL THEN
    RETURN TRUE;
  END IF;

  -- Calculate spending for the appropriate period
  v_user_spend := calculate_user_spending(p_user_id, v_group.spend_period);

  -- Check spending thresholds
  IF v_group.spend_min_cents IS NOT NULL 
    AND v_user_spend < v_group.spend_min_cents THEN
    RETURN FALSE;
  END IF;

  IF v_group.spend_max_cents IS NOT NULL 
    AND v_user_spend > v_group.spend_max_cents THEN
    RETURN FALSE;
  END IF;

  -- If we got here and there are spending requirements, user qualifies
  IF v_group.spend_min_cents IS NOT NULL OR v_group.spend_max_cents IS NOT NULL THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user group assignments based on spending
CREATE OR REPLACE FUNCTION update_user_group_assignments(
  p_user_id UUID,
  p_order_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_group customer_groups%ROWTYPE;
  v_changes JSONB = '[]'::jsonb;
  v_already_in_group BOOLEAN;
  v_qualifies BOOLEAN;
  v_change JSONB;
BEGIN
  -- Update user spending totals
  UPDATE users SET
    lifetime_spend_cents = calculate_user_spending(id, 'lifetime'),
    current_year_spend_cents = calculate_user_spending(id, 'annual'),
    current_quarter_spend_cents = calculate_user_spending(id, 'quarterly'),
    current_month_spend_cents = calculate_user_spending(id, 'monthly'),
    last_spend_calculation_at = NOW()
  WHERE id = p_user_id;

  -- Check each automatic group
  FOR v_group IN 
    SELECT * FROM customer_groups 
    WHERE auto_assign = true 
      AND assignment_method IN ('automatic', 'hybrid')
    ORDER BY priority DESC
  LOOP
    -- Check if user is already in this group
    SELECT EXISTS(
      SELECT 1 FROM user_customer_groups 
      WHERE user_id = p_user_id AND group_id = v_group.id
    ) INTO v_already_in_group;

    -- Check if user qualifies
    v_qualifies := user_qualifies_for_group(p_user_id, v_group.id);

    -- Add to group if qualifies and not already in
    IF v_qualifies AND NOT v_already_in_group THEN
      INSERT INTO user_customer_groups (user_id, group_id, approved_at)
      VALUES (p_user_id, v_group.id, 
        CASE WHEN v_group.requires_approval THEN NULL ELSE NOW() END);

      -- Log the change
      INSERT INTO customer_group_history (
        user_id, group_id, action, reason, metadata
      ) VALUES (
        p_user_id, v_group.id, 'added', 
        CASE 
          WHEN v_group.auto_assign_on_first_purchase THEN 'first_purchase'
          ELSE 'automatic_spend'
        END,
        jsonb_build_object('order_id', p_order_id)
      );

      v_change := jsonb_build_object(
        'group_id', v_group.id,
        'group_name', v_group.name,
        'action', 'added'
      );
      v_changes := v_changes || v_change;

    -- Remove from group if no longer qualifies and auto_remove is true
    ELSIF NOT v_qualifies AND v_already_in_group AND v_group.auto_remove THEN
      -- Only remove if it wasn't manually overridden
      DELETE FROM user_customer_groups 
      WHERE user_id = p_user_id 
        AND group_id = v_group.id
        AND NOT EXISTS (
          SELECT 1 FROM customer_group_history
          WHERE user_id = p_user_id 
            AND group_id = v_group.id
            AND reason = 'admin_override'
            AND action = 'added'
          ORDER BY created_at DESC
          LIMIT 1
        );

      -- Log the change if deletion happened
      IF FOUND THEN
        INSERT INTO customer_group_history (
          user_id, group_id, action, reason
        ) VALUES (
          p_user_id, v_group.id, 'removed', 'automatic_spend'
        );

        v_change := jsonb_build_object(
          'group_id', v_group.id,
          'group_name', v_group.name,
          'action', 'removed'
        );
        v_changes := v_changes || v_change;
      END IF;
    END IF;
  END LOOP;

  RETURN v_changes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update groups after order completion
CREATE OR REPLACE FUNCTION trigger_update_groups_on_order() 
RETURNS TRIGGER AS $$
DECLARE
  v_changes JSONB;
BEGIN
  -- Only process completed orders
  IF NEW.status IN ('completed', 'shipped', 'delivered') AND 
     (OLD.status IS NULL OR OLD.status NOT IN ('completed', 'shipped', 'delivered')) THEN
    
    -- Update first purchase date if needed
    UPDATE users 
    SET first_purchase_date = COALESCE(first_purchase_date, NOW()),
        last_purchase_date = NOW(),
        total_orders_count = total_orders_count + 1
    WHERE id = NEW.user_id;

    -- Record spending history
    INSERT INTO customer_spend_history (
      user_id, order_id, amount_cents, spend_type,
      previous_lifetime_cents, new_lifetime_cents,
      previous_year_cents, new_year_cents,
      previous_quarter_cents, new_quarter_cents,
      previous_month_cents, new_month_cents
    ) 
    SELECT 
      NEW.user_id, NEW.id, NEW.total_cents, 'purchase',
      lifetime_spend_cents, lifetime_spend_cents + NEW.total_cents,
      current_year_spend_cents, current_year_spend_cents + NEW.total_cents,
      current_quarter_spend_cents, current_quarter_spend_cents + NEW.total_cents,
      current_month_spend_cents, current_month_spend_cents + NEW.total_cents
    FROM users WHERE id = NEW.user_id;

    -- Update group assignments
    v_changes := update_user_group_assignments(NEW.user_id, NEW.id);
    
    -- Store changes in spend history
    IF jsonb_array_length(v_changes) > 0 THEN
      UPDATE customer_spend_history 
      SET triggered_group_changes = v_changes
      WHERE order_id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on orders table
DROP TRIGGER IF EXISTS update_customer_groups_on_order ON orders;
CREATE TRIGGER update_customer_groups_on_order
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_groups_on_order();

-- ============================================
-- RLS Policies
-- ============================================

-- Allow users to see group assignment history
CREATE POLICY "Users can view own group history" ON customer_group_history
  FOR SELECT USING (user_id = auth.uid());

-- Allow admins to view all group history
CREATE POLICY "Admins can view all group history" ON customer_group_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Allow system to insert spend history
CREATE POLICY "System can insert spend history" ON customer_spend_history
  FOR INSERT WITH CHECK (true);

-- Allow users to view own spend history
CREATE POLICY "Users can view own spend history" ON customer_spend_history
  FOR SELECT USING (user_id = auth.uid());

-- Enable RLS
ALTER TABLE customer_spend_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_group_history ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON customer_spend_history TO authenticated;
GRANT SELECT ON customer_group_history TO authenticated;
GRANT ALL ON customer_spend_history TO service_role;
GRANT ALL ON customer_group_history TO service_role;