-- Complete ShipStation Integration Schema
-- This migration adds comprehensive ShipStation order management support

-- First, let's check and fix the orders table structure
-- The orders table has id as UUID, we need to handle this properly
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS shipstation_status TEXT,
ADD COLUMN IF NOT EXISTS shipstation_hold_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS shipstation_warehouse_id INTEGER,
ADD COLUMN IF NOT EXISTS shipstation_tag_ids INTEGER[],
ADD COLUMN IF NOT EXISTS label_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS label_created_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS label_voided_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS return_label_url TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
ADD COLUMN IF NOT EXISTS weight_oz DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dimensions_length DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dimensions_width DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dimensions_height DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dimensions_units TEXT DEFAULT 'inches',
ADD COLUMN IF NOT EXISTS weight_units TEXT DEFAULT 'ounces',
ADD COLUMN IF NOT EXISTS insurance_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS confirmation TEXT,
ADD COLUMN IF NOT EXISTS customs_items JSONB,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS gift_message TEXT,
ADD COLUMN IF NOT EXISTS gift BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS customer_username TEXT,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Add shipping and billing address fields if not exists
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS ship_to JSONB,
ADD COLUMN IF NOT EXISTS bill_to JSONB;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_shipstation_status ON orders(shipstation_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_last_synced ON orders(last_synced_at);

-- Create ShipStation sync logs table
CREATE TABLE IF NOT EXISTS shipstation_sync_logs (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'create', 'update', 'cancel', 'hold', 'unhold', 'create_label', 'void_label'
  success BOOLEAN NOT NULL DEFAULT FALSE,
  error_message TEXT,
  error_code TEXT,
  request_data JSONB,
  response_data JSONB,
  rate_limit_remaining INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_order ON shipstation_sync_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created ON shipstation_sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_success ON shipstation_sync_logs(success);

-- Create warehouses table for managing multiple warehouses
CREATE TABLE IF NOT EXISTS shipstation_warehouses (
  id SERIAL PRIMARY KEY,
  shipstation_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  origin_address JSONB NOT NULL,
  return_address JSONB,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create carriers configuration table
CREATE TABLE IF NOT EXISTS shipstation_carriers (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  account_number TEXT,
  requires_funded_account BOOLEAN DEFAULT FALSE,
  primary_carrier BOOLEAN DEFAULT FALSE,
  has_label_messages BOOLEAN DEFAULT FALSE,
  services JSONB, -- Array of available services
  packages JSONB, -- Array of available package types
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tags table for order organization
CREATE TABLE IF NOT EXISTS shipstation_tags (
  id SERIAL PRIMARY KEY,
  shipstation_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order tags many-to-many relationship
CREATE TABLE IF NOT EXISTS order_tags (
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES shipstation_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (order_id, tag_id)
);

-- Create shipping rates cache table
CREATE TABLE IF NOT EXISTS shipping_rates_cache (
  id SERIAL PRIMARY KEY,
  cache_key TEXT UNIQUE NOT NULL,
  from_postal_code TEXT NOT NULL,
  to_postal_code TEXT NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  dimensions JSONB,
  rates JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rates_cache_key ON shipping_rates_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_rates_cache_expires ON shipping_rates_cache(expires_at);

-- Create label history table
CREATE TABLE IF NOT EXISTS shipstation_labels (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  shipment_id TEXT UNIQUE,
  label_id TEXT,
  carrier_code TEXT NOT NULL,
  service_code TEXT NOT NULL,
  package_code TEXT,
  confirmation TEXT,
  tracking_number TEXT,
  label_url TEXT,
  form_url TEXT,
  insurance_cost DECIMAL(10,2),
  shipping_cost DECIMAL(10,2) NOT NULL,
  voided BOOLEAN DEFAULT FALSE,
  voided_at TIMESTAMPTZ,
  void_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_labels_order ON shipstation_labels(order_id);
CREATE INDEX IF NOT EXISTS idx_labels_tracking ON shipstation_labels(tracking_number);
CREATE INDEX IF NOT EXISTS idx_labels_voided ON shipstation_labels(voided);

-- Create automation rules table
CREATE TABLE IF NOT EXISTS shipstation_automation_rules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  trigger_event TEXT NOT NULL, -- 'order_created', 'payment_received', 'order_tagged', etc.
  conditions JSONB NOT NULL, -- Conditions to match
  actions JSONB NOT NULL, -- Actions to perform
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create notifications preferences table
CREATE TABLE IF NOT EXISTS shipping_notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_on_shipped BOOLEAN DEFAULT TRUE,
  email_on_delivered BOOLEAN DEFAULT TRUE,
  email_on_exception BOOLEAN DEFAULT TRUE,
  sms_on_shipped BOOLEAN DEFAULT FALSE,
  sms_on_delivered BOOLEAN DEFAULT FALSE,
  sms_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add RLS policies for new tables
ALTER TABLE shipstation_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipstation_warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipstation_carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipstation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipstation_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipstation_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_notifications ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for ShipStation tables
CREATE POLICY "Admin full access to sync logs" ON shipstation_sync_logs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admin full access to warehouses" ON shipstation_warehouses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admin full access to carriers" ON shipstation_carriers
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admin full access to tags" ON shipstation_tags
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admin full access to order tags" ON order_tags
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admin full access to rates cache" ON shipping_rates_cache
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admin full access to labels" ON shipstation_labels
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admin full access to automation rules" ON shipstation_automation_rules
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- Users can view and update their own notification preferences
CREATE POLICY "Users manage own notifications" ON shipping_notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_month TEXT;
  sequence_num INTEGER;
BEGIN
  -- Format: YYYYMM-XXXX (e.g., 202501-0001)
  year_month := TO_CHAR(NOW(), 'YYYYMM');
  
  -- Get the next sequence number for this month
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM orders
  WHERE order_number LIKE year_month || '-%';
  
  -- Format with leading zeros
  new_number := year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Function to sync order status from ShipStation
CREATE OR REPLACE FUNCTION sync_shipstation_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Map ShipStation status to internal status
  CASE NEW.shipstation_status
    WHEN 'shipped' THEN
      NEW.status := 'shipped';
    WHEN 'cancelled' THEN
      NEW.status := 'cancelled';
    WHEN 'on_hold' THEN
      -- Keep current status but mark as on hold
      NULL;
    WHEN 'awaiting_payment' THEN
      NEW.status := 'pending';
    WHEN 'awaiting_shipment' THEN
      IF NEW.status = 'pending' THEN
        NEW.status := 'paid';
      END IF;
    ELSE
      -- Keep current status
      NULL;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_shipstation_status
  BEFORE UPDATE OF shipstation_status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION sync_shipstation_status();

-- Comments for documentation
COMMENT ON TABLE shipstation_sync_logs IS 'Audit log for all ShipStation API operations';
COMMENT ON TABLE shipstation_warehouses IS 'Configured warehouses from ShipStation';
COMMENT ON TABLE shipstation_carriers IS 'Available shipping carriers and their services';
COMMENT ON TABLE shipstation_tags IS 'Order tags for organization and automation';
COMMENT ON TABLE shipstation_labels IS 'History of all shipping labels created';
COMMENT ON TABLE shipstation_automation_rules IS 'Custom automation rules for order processing';
COMMENT ON TABLE shipping_notifications IS 'User preferences for shipping notifications';
COMMENT ON COLUMN orders.shipstation_status IS 'Order status in ShipStation (may differ from internal status)';
COMMENT ON COLUMN orders.last_synced_at IS 'Last time this order was synced with ShipStation';