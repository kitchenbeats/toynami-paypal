

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calculate_promotion_discount"("promo_id" "uuid", "order_subtotal_cents" integer, "items" "jsonb") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    promo RECORD;
    discount_cents INTEGER := 0;
BEGIN
    SELECT * INTO promo FROM promotions WHERE id = promo_id;
    
    IF NOT FOUND OR NOT is_promotion_valid(promo_id) THEN
        RETURN 0;
    END IF;
    
    -- Check minimum order amount
    IF promo.minimum_order_amount_cents IS NOT NULL 
       AND order_subtotal_cents < promo.minimum_order_amount_cents THEN
        RETURN 0;
    END IF;
    
    -- Calculate based on promotion type
    CASE promo.type
        WHEN 'percentage_off' THEN
            discount_cents := (order_subtotal_cents * promo.discount_value / 100)::INTEGER;
            -- Apply max discount cap if set
            IF promo.max_discount_amount_cents IS NOT NULL THEN
                discount_cents := LEAST(discount_cents, promo.max_discount_amount_cents);
            END IF;
            
        WHEN 'fixed_amount_off' THEN
            discount_cents := (promo.discount_value * 100)::INTEGER;
            -- Can't discount more than order total
            discount_cents := LEAST(discount_cents, order_subtotal_cents);
            
        WHEN 'tiered' THEN
            -- Parse tiers from rules JSON and apply appropriate discount
            -- This would need more complex logic based on the tiers
            -- For now, simplified implementation
            IF promo.rules->>'tiers' IS NOT NULL THEN
                -- TODO: Implement tiered discount calculation
                discount_cents := 0;
            END IF;
            
        WHEN 'bogo' THEN
            -- Calculate BOGO discount based on items
            -- This needs item-level calculation
            -- TODO: Implement BOGO calculation
            discount_cents := 0;
            
        WHEN 'bundle' THEN
            -- Check if required products are in cart
            -- TODO: Implement bundle calculation
            discount_cents := 0;
            
        WHEN 'free_shipping' THEN
            -- This would be handled separately in shipping calculation
            discount_cents := 0;
            
        ELSE
            discount_cents := 0;
    END CASE;
    
    RETURN discount_cents;
END;
$$;


ALTER FUNCTION "public"."calculate_promotion_discount"("promo_id" "uuid", "order_subtotal_cents" integer, "items" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_variant_price"("p_product_id" "uuid", "p_option_combination" "jsonb") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    base_price INTEGER;
    adjustment INTEGER := 0;
    option_value_id UUID;
    price_adj INTEGER;
BEGIN
    -- Get base product price (handle missing products gracefully)
    SELECT COALESCE(base_price_cents, 0) INTO base_price FROM products WHERE id = p_product_id;
    
    IF base_price IS NULL THEN
        RAISE EXCEPTION 'Product with id % not found', p_product_id;
    END IF;
    
    -- Calculate adjustments for each option in the combination
    FOR option_value_id IN 
        SELECT ov.id 
        FROM global_option_values ov
        JOIN global_option_types ot ON ov.option_type_id = ot.id
        WHERE ov.value = ANY(SELECT jsonb_array_elements_text(jsonb_each_text(p_option_combination)))
    LOOP
        -- Get price adjustment for this option value (with proper error handling)
        SELECT COALESCE(price_adjustment_cents, 0) INTO price_adj
        FROM product_option_pricing 
        WHERE product_id = p_product_id AND option_value_id = option_value_id
        AND is_available = TRUE;
        
        adjustment := adjustment + COALESCE(price_adj, 0);
    END LOOP;
    
    RETURN base_price + adjustment;
END;
$$;


ALTER FUNCTION "public"."calculate_variant_price"("p_product_id" "uuid", "p_option_combination" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrement_media_usage"("media_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE media_library 
  SET 
    usage_count = GREATEST(usage_count - 1, 0)
  WHERE id = media_id;
END;
$$;


ALTER FUNCTION "public"."decrement_media_usage"("media_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_user_tier_order"("p_user_id" "uuid") RETURNS integer
    LANGUAGE "sql" STABLE
    AS $$
  WITH lifetime AS (
    SELECT COALESCE(SUM(total_cents),0)::BIGINT AS spend
    FROM orders
    WHERE user_id = p_user_id AND status = 'paid'
  )
  SELECT COALESCE((
    SELECT order_no
    FROM loyalty_tiers lt, lifetime l
    WHERE lt.is_active
      AND lt.deleted_at IS NULL
      AND l.spend >= lt.min_spend_cents
      AND (lt.max_spend_cents IS NULL OR l.spend < lt.max_spend_cents)
    ORDER BY lt.order_no DESC
    LIMIT 1
  ), 0);
$$;


ALTER FUNCTION "public"."fn_user_tier_order"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_order_number"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."generate_order_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_variant_sku"("p_product_slug" "text", "p_option_combination" "jsonb") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    base_sku TEXT;
    suffix TEXT := '';
    option_key TEXT;
    option_value TEXT;
    temp_suffix TEXT;
BEGIN
    -- Validate inputs
    IF p_product_slug IS NULL OR LENGTH(p_product_slug) = 0 THEN
        RAISE EXCEPTION 'Product slug cannot be null or empty';
    END IF;
    
    IF p_option_combination IS NULL THEN
        RETURN UPPER(REPLACE(p_product_slug, '-', ''));
    END IF;
    
    base_sku := UPPER(REPLACE(p_product_slug, '-', ''));
    
    -- Build suffix from option combination
    FOR option_key, option_value IN SELECT * FROM jsonb_each_text(p_option_combination)
    LOOP
        -- Get SKU suffix for this option value
        SELECT COALESCE(ov.sku_suffix, '-' || UPPER(LEFT(ov.value, 2)))
        INTO temp_suffix
        FROM global_option_values ov
        JOIN global_option_types ot ON ov.option_type_id = ot.id
        WHERE ot.name = option_key AND ov.value = option_value
        AND ov.is_active = TRUE;
        
        base_sku := base_sku || COALESCE(temp_suffix, '');
    END LOOP;
    
    RETURN base_sku;
END;
$$;


ALTER FUNCTION "public"."generate_variant_sku"("p_product_slug" "text", "p_option_combination" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_featured_brands"("limit_count" integer DEFAULT 8) RETURNS TABLE("id" "uuid", "name" "text", "slug" "text", "display_order" integer, "featured" boolean)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        b.slug,
        b.display_order,
        b.featured
    FROM brands b
    WHERE 
        b.featured = TRUE 
        AND b.is_active = TRUE
    ORDER BY 
        b.display_order ASC,
        b.name ASC
    LIMIT limit_count;
END;
$$;


ALTER FUNCTION "public"."get_featured_brands"("limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_featured_categories"("limit_count" integer DEFAULT 6) RETURNS TABLE("id" "uuid", "name" "text", "slug" "text", "sort_order" integer, "is_featured" boolean)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.slug,
        c.sort_order,
        c.is_featured
    FROM categories c
    WHERE 
        c.is_featured = TRUE 
        AND c.is_active = TRUE
    ORDER BY 
        c.sort_order ASC,
        c.display_order ASC,
        c.name ASC
    LIMIT limit_count;
END;
$$;


ALTER FUNCTION "public"."get_featured_categories"("limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_featured_products"("limit_count" integer DEFAULT 8) RETURNS TABLE("id" "uuid", "name" "text", "slug" "text", "sort_order" integer, "is_featured" boolean)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.sort_order,
        p.is_featured
    FROM products p
    WHERE 
        p.is_featured = TRUE 
        AND p.deleted_at IS NULL
        AND p.is_visible = TRUE
        AND p.status = 'active'
    ORDER BY 
        p.sort_order ASC,
        p.created_at DESC
    LIMIT limit_count;
END;
$$;


ALTER FUNCTION "public"."get_featured_products"("limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_customer_groups"("user_id" "uuid") RETURNS TABLE("group_id" "uuid", "group_name" "text", "priority" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
    RETURN QUERY
    SELECT cg.id, cg.name, cg.priority
    FROM customer_groups cg
    JOIN user_customer_groups ucg ON cg.id = ucg.group_id
    WHERE ucg.user_id = $1
    AND ucg.approved_at IS NOT NULL
    AND (ucg.expires_at IS NULL OR ucg.expires_at > NOW())
    AND cg.is_active = TRUE
    ORDER BY cg.priority DESC;
END;
$_$;


ALTER FUNCTION "public"."get_user_customer_groups"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_media_usage"("media_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE media_library 
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = media_id;
END;
$$;


ALTER FUNCTION "public"."increment_media_usage"("media_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_promotion_valid"("promo_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    promo RECORD;
    current_time TIMESTAMPTZ := NOW();
BEGIN
    SELECT * INTO promo FROM promotions 
    WHERE id = promo_id 
        AND is_active = true 
        AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check date range
    IF promo.starts_at IS NOT NULL AND current_time < promo.starts_at THEN
        RETURN false;
    END IF;
    
    IF promo.expires_at IS NOT NULL AND current_time > promo.expires_at THEN
        RETURN false;
    END IF;
    
    -- Check usage limits
    IF promo.maximum_uses_total IS NOT NULL AND promo.usage_count >= promo.maximum_uses_total THEN
        RETURN false;
    END IF;
    
    -- Check schedule if exists
    IF promo.schedule IS NOT NULL THEN
        -- TODO: Implement schedule checking logic
        -- For now, return true if schedule exists
        RETURN true;
    END IF;
    
    RETURN true;
END;
$$;


ALTER FUNCTION "public"."is_promotion_valid"("promo_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_product_for_sync"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- If product data changed, mark for sync
    IF (OLD.name IS DISTINCT FROM NEW.name OR
        OLD.description IS DISTINCT FROM NEW.description OR
        OLD.is_digital IS DISTINCT FROM NEW.is_digital) THEN
        NEW.sync_status = 'pending';
        NEW.sync_error = NULL;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."mark_product_for_sync"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_user_change"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- We'll handle this in the app via Supabase client
    -- This is just a placeholder for potential webhook usage
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_user_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_email_queue"() RETURNS TABLE("processed" integer, "failed" integer)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_processed INTEGER := 0;
    v_failed INTEGER := 0;
    v_email RECORD;
BEGIN
    -- Get pending emails that are due
    FOR v_email IN
        SELECT * FROM email_queue
        WHERE status = 'pending'
        AND send_at <= NOW()
        AND attempts < max_attempts
        ORDER BY send_at
        LIMIT 100
    LOOP
        -- Update status to processing
        UPDATE email_queue
        SET status = 'processing', attempts = attempts + 1
        WHERE id = v_email.id;
        
        -- Here you would call your email service
        -- For now, we'll just mark as sent
        UPDATE email_queue
        SET status = 'sent', sent_at = NOW()
        WHERE id = v_email.id;
        
        v_processed := v_processed + 1;
    END LOOP;
    
    -- Mark failed emails that exceeded max attempts
    UPDATE email_queue
    SET status = 'failed'
    WHERE status IN ('pending', 'processing')
    AND attempts >= max_attempts;
    
    GET DIAGNOSTICS v_failed = ROW_COUNT;
    
    RETURN QUERY SELECT v_processed, v_failed;
END;
$$;


ALTER FUNCTION "public"."process_email_queue"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."queue_email"("p_template" "text", "p_recipient" "text", "p_subject" "text", "p_data" "jsonb", "p_send_at" timestamp with time zone DEFAULT "now"()) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_queue_id UUID;
BEGIN
    INSERT INTO email_queue (template, recipient, subject, data, send_at)
    VALUES (p_template, p_recipient, p_subject, p_data, p_send_at)
    RETURNING id INTO v_queue_id;
    
    RETURN v_queue_id;
END;
$$;


ALTER FUNCTION "public"."queue_email"("p_template" "text", "p_recipient" "text", "p_subject" "text", "p_data" "jsonb", "p_send_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_media"("search_term" "text" DEFAULT NULL::"text", "folder_filter" "text" DEFAULT NULL::"text", "mime_type_filter" "text" DEFAULT NULL::"text", "tag_filter" "text"[] DEFAULT NULL::"text"[]) RETURNS TABLE("id" "uuid", "filename" "text", "file_url" "text", "title" "text", "alt_text" "text", "mime_type" "text", "width" integer, "height" integer, "file_size" integer, "folder" "text", "tags" "text"[], "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.filename,
    m.file_url,
    m.title,
    m.alt_text,
    m.mime_type,
    m.width,
    m.height,
    m.file_size,
    m.folder,
    m.tags,
    m.created_at
  FROM media_library m
  WHERE 
    (search_term IS NULL OR m.search_vector @@ plainto_tsquery('english', search_term))
    AND (folder_filter IS NULL OR m.folder = folder_filter)
    AND (mime_type_filter IS NULL OR m.mime_type LIKE mime_type_filter || '%')
    AND (tag_filter IS NULL OR m.tags && tag_filter)
  ORDER BY m.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."search_media"("search_term" "text", "folder_filter" "text", "mime_type_filter" "text", "tag_filter" "text"[]) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."search_media"("search_term" "text", "folder_filter" "text", "mime_type_filter" "text", "tag_filter" "text"[]) IS 'Search media library with filters';



CREATE OR REPLACE FUNCTION "public"."set_order_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_order_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_shipstation_status"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."sync_shipstation_status"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_inventory_change"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update PayPal inventory sync status when variant stock changes
    IF OLD.stock IS DISTINCT FROM NEW.stock THEN
        UPDATE paypal_inventory
        SET sync_status = 'pending'
        WHERE product_variant_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."track_inventory_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO media_usage (media_id, entity_type, entity_id, field_name)
  VALUES (p_media_id, p_entity_type, p_entity_id, p_field_name)
  ON CONFLICT (media_id, entity_type, entity_id, field_name) DO NOTHING;
  
  -- Update usage count
  PERFORM increment_media_usage(p_media_id);
END;
$$;


ALTER FUNCTION "public"."track_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."untrack_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  DELETE FROM media_usage 
  WHERE 
    media_id = p_media_id AND 
    entity_type = p_entity_type AND 
    entity_id = p_entity_id AND 
    (field_name = p_field_name OR (field_name IS NULL AND p_field_name IS NULL));
  
  -- Update usage count
  PERFORM decrement_media_usage(p_media_id);
END;
$$;


ALTER FUNCTION "public"."untrack_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_media_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' || 
    COALESCE(NEW.alt_text, '') || ' ' || 
    COALESCE(NEW.caption, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.original_name, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_media_search_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_tax_settings_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_tax_settings_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_can_view_product"("user_id" "uuid", "product_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    product_visibility TEXT;
    has_group_access BOOLEAN;
BEGIN
    -- Get product visibility type
    SELECT visibility_type INTO product_visibility
    FROM products WHERE id = product_id;
    
    -- Public products are always visible
    IF product_visibility = 'public' OR product_visibility IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Private products need specific group access
    IF product_visibility = 'private' THEN
        RETURN FALSE;
    END IF;
    
    -- Check group-based visibility
    SELECT EXISTS (
        SELECT 1 
        FROM product_customer_groups pcg
        JOIN user_customer_groups ucg ON pcg.group_id = ucg.group_id
        WHERE pcg.product_id = product_id
        AND ucg.user_id = user_id
        AND ucg.approved_at IS NOT NULL
        AND (ucg.expires_at IS NULL OR ucg.expires_at > NOW())
        AND pcg.can_view = TRUE
    ) INTO has_group_access;
    
    RETURN has_group_access;
END;
$$;


ALTER FUNCTION "public"."user_can_view_product"("user_id" "uuid", "product_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_in_customer_group"("user_id" "uuid", "group_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_customer_groups ucg
        WHERE ucg.user_id = $1 
        AND ucg.group_id = $2
        AND ucg.approved_at IS NOT NULL
        AND (ucg.expires_at IS NULL OR ucg.expires_at > NOW())
    );
END;
$_$;


ALTER FUNCTION "public"."user_in_customer_group"("user_id" "uuid", "group_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "type" "text",
    "full_name" "text",
    "address_line1" "text",
    "address_line2" "text",
    "city" "text",
    "state" "text",
    "postal_code" "text",
    "country" "text",
    "phone" "text",
    "is_default" boolean DEFAULT false,
    CONSTRAINT "addresses_type_check" CHECK (("type" = ANY (ARRAY['shipping'::"text", 'billing'::"text"])))
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "session_id" "text",
    "event_type" "text" NOT NULL,
    "event_data" "jsonb",
    "page_url" "text",
    "referrer_url" "text",
    "utm_source" "text",
    "utm_medium" "text",
    "utm_campaign" "text",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."analytics_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."banners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "position" "text" NOT NULL,
    "slot_number" integer NOT NULL,
    "image_url" "text",
    "image_alt" "text",
    "title" "text",
    "subtitle" "text",
    "description" "text",
    "button_text" "text",
    "button_url" "text",
    "text_alignment" "text",
    "background_color" "text",
    "text_color" "text",
    "button_color" "text",
    "button_text_color" "text",
    "overlay_opacity" numeric,
    "column_span" integer DEFAULT 1,
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "target_categories" "uuid"[],
    "target_brands" "text"[],
    "min_tier_order" integer,
    "click_count" integer DEFAULT 0,
    "impression_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "target_pages" "jsonb" DEFAULT '["*"]'::"jsonb",
    "exclude_pages" "jsonb" DEFAULT '[]'::"jsonb",
    "media_id" "uuid",
    CONSTRAINT "banners_overlay_opacity_check" CHECK ((("overlay_opacity" >= (0)::numeric) AND ("overlay_opacity" <= (1)::numeric))),
    CONSTRAINT "banners_position_check" CHECK (("position" = ANY (ARRAY['upper'::"text", 'middle'::"text", 'lower'::"text"]))),
    CONSTRAINT "banners_slot_number_check" CHECK ((("slot_number" >= 1) AND ("slot_number" <= 6))),
    CONSTRAINT "banners_text_alignment_check" CHECK (("text_alignment" = ANY (ARRAY['left'::"text", 'center'::"text", 'right'::"text"])))
);


ALTER TABLE "public"."banners" OWNER TO "postgres";


COMMENT ON COLUMN "public"."banners"."target_pages" IS 'Array of page paths where banner should show. Use ["*"] for all pages, ["/", "/products"] for specific pages';



COMMENT ON COLUMN "public"."banners"."exclude_pages" IS 'Array of page paths where banner should NOT show';



COMMENT ON COLUMN "public"."banners"."media_id" IS 'Reference to media library for banner image';



CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "excerpt" "text",
    "content" "text",
    "featured_image" "text",
    "thumbnail_url" "text",
    "author_id" "uuid",
    "status" "text" DEFAULT 'draft'::"text",
    "published_at" timestamp with time zone,
    "featured" boolean DEFAULT false,
    "meta_title" "text",
    "meta_description" "text",
    "tags" "text"[],
    "view_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "featured_image_media_id" "uuid",
    CONSTRAINT "blog_posts_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


COMMENT ON COLUMN "public"."blog_posts"."featured_image_media_id" IS 'Reference to media library for blog post featured image';



CREATE TABLE IF NOT EXISTS "public"."brand_customer_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "brand_id" "uuid" NOT NULL,
    "group_id" "uuid" NOT NULL,
    "can_view" boolean DEFAULT true,
    "can_purchase" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."brand_customer_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."brands" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "logo_url" "text",
    "description" "text",
    "featured" boolean DEFAULT false,
    "display_order" integer DEFAULT 0,
    "search_keywords" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "banner_url" "text",
    "banner_url_2" "text",
    "logo_media_id" "uuid",
    "banner_media_id" "uuid",
    "banner_media_id_2" "uuid"
);


ALTER TABLE "public"."brands" OWNER TO "postgres";


COMMENT ON COLUMN "public"."brands"."logo_url" IS 'Small logo image for brand listings and cards';



COMMENT ON COLUMN "public"."brands"."featured" IS 'Flag to mark featured brands for homepage/special displays';



COMMENT ON COLUMN "public"."brands"."display_order" IS 'Manual sort order for display (lower numbers appear first)';



COMMENT ON COLUMN "public"."brands"."banner_url" IS 'Primary banner image (e.g., for home page features)';



COMMENT ON COLUMN "public"."brands"."banner_url_2" IS 'Secondary banner image (e.g., for brand detail pages)';



COMMENT ON COLUMN "public"."brands"."logo_media_id" IS 'Reference to media library for brand logo';



COMMENT ON COLUMN "public"."brands"."banner_media_id" IS 'Reference to media library for primary brand banner';



COMMENT ON COLUMN "public"."brands"."banner_media_id_2" IS 'Reference to media library for secondary brand banner';



CREATE TABLE IF NOT EXISTS "public"."carousel_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "swap_interval" integer DEFAULT 5000,
    "is_autoplay" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."carousel_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."carousel_slides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "heading" "text",
    "text" "text",
    "button_text" "text",
    "link" "text",
    "image_url" "text",
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "media_id" "uuid"
);


ALTER TABLE "public"."carousel_slides" OWNER TO "postgres";


COMMENT ON COLUMN "public"."carousel_slides"."media_id" IS 'Reference to media library for carousel slide image';



CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cart_id" "uuid" NOT NULL,
    "variant_id" "uuid" NOT NULL,
    "quantity" integer,
    "price_cents" integer,
    "discount_cents" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "cart_items_quantity_check" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."carts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "session_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '7 days'::interval),
    "abandoned_email_sent" boolean DEFAULT false,
    "recovered_at" timestamp with time zone,
    "discount_code" "text",
    "notes" "text"
);


ALTER TABLE "public"."carts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "parent_id" "uuid",
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "show_in_menu" boolean DEFAULT true,
    "deleted_at" timestamp with time zone,
    "image_url" "text",
    "banner_url" "text",
    "icon_url" "text",
    "meta_title" "text",
    "meta_description" "text",
    "meta_keywords" "text",
    "is_featured" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "visibility_type" "text" DEFAULT 'public'::"text",
    "purchasability_type" "text" DEFAULT 'public'::"text",
    "sort_order" integer DEFAULT 0,
    CONSTRAINT "categories_purchasability_type_check" CHECK (("purchasability_type" = ANY (ARRAY['public'::"text", 'groups'::"text", 'private'::"text"]))),
    CONSTRAINT "categories_visibility_type_check" CHECK (("visibility_type" = ANY (ARRAY['public'::"text", 'groups'::"text", 'private'::"text"])))
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


COMMENT ON COLUMN "public"."categories"."is_featured" IS 'Flag to mark featured categories for homepage/special displays';



COMMENT ON COLUMN "public"."categories"."sort_order" IS 'Manual sort order for display (lower numbers appear first)';



CREATE TABLE IF NOT EXISTS "public"."category_customer_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "group_id" "uuid" NOT NULL,
    "can_view" boolean DEFAULT true,
    "can_purchase" boolean DEFAULT true,
    "inherit_to_products" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."category_customer_groups" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."coupon_analytics" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "code",
    NULL::"text" AS "name",
    NULL::"text" AS "description",
    NULL::"text" AS "discount_type",
    NULL::numeric(10,2) AS "discount_value",
    NULL::integer AS "usage_limit",
    NULL::integer AS "usage_count",
    NULL::boolean AS "is_active",
    NULL::timestamp with time zone AS "starts_at",
    NULL::timestamp with time zone AS "expires_at",
    NULL::timestamp with time zone AS "created_at",
    NULL::timestamp with time zone AS "updated_at",
    NULL::bigint AS "actual_usage_count",
    NULL::bigint AS "total_discount_given_cents",
    NULL::numeric AS "avg_discount_per_use_cents",
    NULL::bigint AS "total_order_value_cents",
    NULL::numeric AS "usage_rate_percentage",
    NULL::timestamp with time zone AS "first_used_at",
    NULL::timestamp with time zone AS "last_used_at",
    NULL::bigint AS "unique_users_count";


ALTER VIEW "public"."coupon_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."coupon_usage" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "coupon_id" "uuid",
    "user_id" "uuid",
    "order_id" "uuid",
    "discount_amount_cents" integer NOT NULL,
    "order_total_cents" integer NOT NULL,
    "paypal_order_id" "text",
    "used_at" timestamp with time zone DEFAULT "now"(),
    "ip_address" "inet",
    "user_agent" "text"
);


ALTER TABLE "public"."coupon_usage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."coupons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "discount_type" "text" NOT NULL,
    "discount_value" numeric(10,2) NOT NULL,
    "usage_limit" integer,
    "usage_count" integer DEFAULT 0,
    "usage_limit_per_customer" integer,
    "starts_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "minimum_order_amount_cents" integer,
    "applicable_product_ids" integer[] DEFAULT '{}'::integer[],
    "applicable_category_ids" integer[] DEFAULT '{}'::integer[],
    "customer_group_ids" integer[] DEFAULT '{}'::integer[],
    "first_time_customers_only" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "paypal_discount_item_name" "text" DEFAULT 'Discount'::"text",
    CONSTRAINT "coupons_discount_type_check" CHECK (("discount_type" = ANY (ARRAY['percentage'::"text", 'fixed_amount'::"text"]))),
    CONSTRAINT "coupons_discount_value_check" CHECK (("discount_value" > (0)::numeric)),
    CONSTRAINT "valid_date_range" CHECK ((("starts_at" IS NULL) OR ("expires_at" IS NULL) OR ("starts_at" < "expires_at"))),
    CONSTRAINT "valid_per_customer_limit" CHECK ((("usage_limit_per_customer" IS NULL) OR ("usage_limit_per_customer" > 0))),
    CONSTRAINT "valid_usage_limits" CHECK ((("usage_limit" IS NULL) OR ("usage_limit" > 0)))
);


ALTER TABLE "public"."coupons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customer_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_default" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "priority" integer DEFAULT 0,
    "can_see_prices" boolean DEFAULT true,
    "can_purchase" boolean DEFAULT true,
    "discount_percentage" numeric(5,2) DEFAULT 0,
    "tax_exempt" boolean DEFAULT false,
    "requires_approval" boolean DEFAULT false,
    "auto_assign_rules" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."customer_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customer_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "session_token" "text" NOT NULL,
    "ip_address" "inet",
    "user_agent" "text",
    "last_activity" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."customer_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."discounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "description" "text",
    "type" "text",
    "amount_cents" integer,
    "min_purchase_cents" integer DEFAULT 0,
    "active" boolean DEFAULT true,
    "max_uses" integer,
    "used_count" integer DEFAULT 0,
    "starts_at" timestamp with time zone,
    "ends_at" timestamp with time zone,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "discounts_type_check" CHECK (("type" = ANY (ARRAY['percentage'::"text", 'fixed'::"text"])))
);


ALTER TABLE "public"."discounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."email_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "template" "text" NOT NULL,
    "recipient" "text" NOT NULL,
    "subject" "text",
    "status" "text",
    "message_id" "text",
    "error_message" "text",
    "bounce_type" "text",
    "provider" "text" DEFAULT 'mailchimp_transactional'::"text",
    "provider_response" "jsonb",
    "opened_at" timestamp with time zone,
    "clicked_at" timestamp with time zone,
    "bounced_at" timestamp with time zone,
    "sent_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid",
    "order_id" "uuid",
    CONSTRAINT "email_log_status_check" CHECK (("status" = ANY (ARRAY['sent'::"text", 'failed'::"text", 'bounced'::"text", 'opened'::"text", 'clicked'::"text", 'unsubscribed'::"text", 'spam'::"text"])))
);


ALTER TABLE "public"."email_log" OWNER TO "postgres";


COMMENT ON TABLE "public"."email_log" IS 'Log of all sent emails with tracking data';



CREATE TABLE IF NOT EXISTS "public"."email_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "template" "text" NOT NULL,
    "recipient" "text" NOT NULL,
    "subject" "text",
    "data" "jsonb" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "attempts" integer DEFAULT 0,
    "max_attempts" integer DEFAULT 3,
    "send_at" timestamp with time zone DEFAULT "now"(),
    "sent_at" timestamp with time zone,
    "last_error" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "email_queue_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'sent'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."email_queue" OWNER TO "postgres";


COMMENT ON TABLE "public"."email_queue" IS 'Queue for emails to be sent with retry logic';



CREATE TABLE IF NOT EXISTS "public"."email_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "provider" "text" NOT NULL,
    "api_key" "text",
    "from_email" "text" DEFAULT 'noreply@toynamishop.com'::"text" NOT NULL,
    "from_name" "text" DEFAULT 'Toynami'::"text" NOT NULL,
    "reply_to" "text",
    "is_active" boolean DEFAULT true,
    "track_opens" boolean DEFAULT true,
    "track_clicks" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "email_settings_provider_check" CHECK (("provider" = ANY (ARRAY['mailchimp_transactional'::"text", 'sendgrid'::"text", 'ses'::"text", 'postmark'::"text"])))
);


ALTER TABLE "public"."email_settings" OWNER TO "postgres";


COMMENT ON TABLE "public"."email_settings" IS 'Configuration for email service providers';



CREATE TABLE IF NOT EXISTS "public"."email_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "subject" "text" NOT NULL,
    "html_content" "text" NOT NULL,
    "text_content" "text",
    "variables" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true,
    "template_type" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    CONSTRAINT "email_templates_template_type_check" CHECK (("template_type" = ANY (ARRAY['transactional'::"text", 'marketing'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."email_templates" OWNER TO "postgres";


COMMENT ON TABLE "public"."email_templates" IS 'Email templates for transactional and marketing emails';



CREATE TABLE IF NOT EXISTS "public"."gift_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "balance_cents" integer NOT NULL,
    "initial_value_cents" integer NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text",
    "sender_email" "text",
    "sender_name" "text",
    "recipient_email" "text",
    "recipient_name" "text",
    "message" "text",
    "expires_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."gift_cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."global_option_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "input_type" "text" DEFAULT 'radio'::"text" NOT NULL,
    "is_required" boolean DEFAULT false,
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "global_option_types_display_name_check" CHECK (("length"("display_name") > 0)),
    CONSTRAINT "global_option_types_input_type_check" CHECK (("input_type" = ANY (ARRAY['radio'::"text", 'dropdown'::"text", 'checkbox'::"text", 'text'::"text", 'textarea'::"text", 'color'::"text", 'file'::"text"]))),
    CONSTRAINT "global_option_types_name_check" CHECK (("name" ~ '^[a-z][a-z0-9_]*$'::"text"))
);


ALTER TABLE "public"."global_option_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."global_option_values" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "option_type_id" "uuid",
    "value" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "hex_color" "text",
    "image_url" "text",
    "sku_suffix" "text",
    "display_order" integer DEFAULT 0,
    "is_default" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "global_option_values_display_name_check" CHECK (("length"("display_name") > 0)),
    CONSTRAINT "global_option_values_hex_color_check" CHECK (("hex_color" ~ '^#[0-9A-Fa-f]{6}$'::"text")),
    CONSTRAINT "global_option_values_value_check" CHECK (("length"("value") > 0))
);


ALTER TABLE "public"."global_option_values" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inventory_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "variant_id" "uuid",
    "change_type" "text",
    "quantity_change" integer,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "inventory_logs_change_type_check" CHECK (("change_type" = ANY (ARRAY['order'::"text", 'restock'::"text", 'manual_adjustment'::"text"])))
);


ALTER TABLE "public"."inventory_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loyalty_tiers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "min_spend_cents" bigint NOT NULL,
    "max_spend_cents" bigint,
    "percentage_back" numeric(5,4) DEFAULT 0,
    "order_no" integer NOT NULL,
    "is_active" boolean DEFAULT true,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."loyalty_tiers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mailchimp_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "api_key" "text",
    "server_prefix" "text",
    "list_id" "text",
    "store_id" "text",
    "sync_customers" boolean DEFAULT true,
    "sync_orders" boolean DEFAULT true,
    "sync_products" boolean DEFAULT true,
    "sync_carts" boolean DEFAULT true,
    "tag_mappings" "jsonb" DEFAULT '{}'::"jsonb",
    "store_name" "text",
    "store_domain" "text",
    "store_currency_code" "text" DEFAULT 'USD'::"text",
    "is_active" boolean DEFAULT false,
    "last_sync_at" timestamp with time zone,
    "last_sync_status" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid"
);


ALTER TABLE "public"."mailchimp_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mailchimp_sync_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" "text" NOT NULL,
    "entity_type" "text",
    "entity_id" "text",
    "request_data" "jsonb",
    "response_data" "jsonb",
    "success" boolean,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."mailchimp_sync_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mailchimp_sync_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "mailchimp_id" "text",
    "email_hash" "text",
    "sync_status" "text",
    "last_synced_at" timestamp with time zone,
    "sync_error" "text",
    "tags" "text"[],
    "merge_fields" "jsonb",
    "email_status" "text",
    "vip_status" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "mailchimp_sync_status_sync_status_check" CHECK (("sync_status" = ANY (ARRAY['synced'::"text", 'pending'::"text", 'failed'::"text", 'unsubscribed'::"text"])))
);


ALTER TABLE "public"."mailchimp_sync_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."media_library" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "filename" "text" NOT NULL,
    "original_name" "text" NOT NULL,
    "file_path" "text" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_size" integer,
    "mime_type" "text",
    "file_extension" "text",
    "title" "text",
    "alt_text" "text",
    "caption" "text",
    "description" "text",
    "width" integer,
    "height" integer,
    "folder" "text" DEFAULT 'uncategorized'::"text",
    "tags" "text"[],
    "sort_order" integer DEFAULT 0,
    "usage_count" integer DEFAULT 0,
    "last_used_at" timestamp with time zone,
    "uploaded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "search_vector" "tsvector"
);


ALTER TABLE "public"."media_library" OWNER TO "postgres";


COMMENT ON TABLE "public"."media_library" IS 'Central media library for all uploaded files and images';



CREATE TABLE IF NOT EXISTS "public"."media_usage" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "media_id" "uuid" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "text" NOT NULL,
    "field_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."media_usage" OWNER TO "postgres";


COMMENT ON TABLE "public"."media_usage" IS 'Tracks which entities are using which media files';



CREATE TABLE IF NOT EXISTS "public"."menu_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "menu_id" "uuid",
    "parent_id" "uuid",
    "title" "text" NOT NULL,
    "url" "text",
    "type" "text" NOT NULL,
    "target_id" "uuid",
    "target_slug" "text",
    "css_class" "text",
    "icon" "text",
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "opens_new_tab" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."menu_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."menus" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "location" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."menus" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "variant_id" "uuid",
    "product_name" "text",
    "variant_sku" "text",
    "price_cents" integer,
    "quantity" integer
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_tags" (
    "order_id" "uuid" NOT NULL,
    "tag_id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."order_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "paypal_order_id" "text",
    "total_cents" integer,
    "subtotal_cents" integer,
    "shipping_cents" integer,
    "discount_cents" integer,
    "tax_cents" integer,
    "currency" "text" DEFAULT 'USD'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "order_number" "text",
    "email" "text",
    "phone" "text",
    "shipping_address_id" "uuid",
    "billing_address_id" "uuid",
    "shipping_method" "text",
    "tracking_number" "text",
    "tracking_url" "text",
    "carrier" "text",
    "estimated_delivery" "date",
    "delivered_at" timestamp with time zone,
    "shipped_at" timestamp with time zone,
    "payment_method" "text",
    "payment_status" "text",
    "transaction_id" "text",
    "refund_amount_cents" integer DEFAULT 0,
    "refund_reason" "text",
    "refunded_at" timestamp with time zone,
    "notes" "text",
    "admin_notes" "text",
    "customer_notes" "text",
    "gift_message" "text",
    "source" "text",
    "ip_address" "inet",
    "user_agent" "text",
    "discount_code" "text",
    "loyalty_points_earned" integer DEFAULT 0,
    "loyalty_points_used" integer DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "paypal_capture_id" "text",
    "paypal_invoice_id" "text",
    "paypal_subscription_id" "text",
    "paypal_payer_id" "text",
    "paypal_facilitator_access_token" "text",
    "paypal_merchant_id" "text",
    "paypal_status" "text",
    "paypal_debug_id" "text",
    "shipstation_shipment_id" "text",
    "shipstation_order_id" "text",
    "shipping_carrier" "text",
    "shipping_service" "text",
    "shipping_service_code" "text",
    "label_created_at" timestamp with time zone,
    "shipstation_status" "text",
    "shipstation_hold_until" timestamp with time zone,
    "shipstation_warehouse_id" integer,
    "shipstation_tag_ids" integer[],
    "label_cost" numeric(10,2),
    "label_voided_at" timestamp with time zone,
    "return_label_url" "text",
    "estimated_delivery_date" "date",
    "weight_oz" numeric(10,2),
    "dimensions_length" numeric(10,2),
    "dimensions_width" numeric(10,2),
    "dimensions_height" numeric(10,2),
    "dimensions_units" "text" DEFAULT 'inches'::"text",
    "weight_units" "text" DEFAULT 'ounces'::"text",
    "insurance_cost" numeric(10,2),
    "confirmation" "text",
    "customs_items" "jsonb",
    "internal_notes" "text",
    "gift" boolean DEFAULT false,
    "customer_username" "text",
    "last_synced_at" timestamp with time zone,
    "ship_to" "jsonb",
    "bill_to" "jsonb",
    "coupon_id" "uuid",
    "coupon_code" "text",
    "discount_amount_cents" integer DEFAULT 0,
    CONSTRAINT "orders_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'shipped'::"text", 'cancelled'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


COMMENT ON COLUMN "public"."orders"."tracking_number" IS 'Tracking number once shipped';



COMMENT ON COLUMN "public"."orders"."delivered_at" IS 'When order was delivered to customer';



COMMENT ON COLUMN "public"."orders"."shipped_at" IS 'When order was actually shipped';



COMMENT ON COLUMN "public"."orders"."shipstation_shipment_id" IS 'ShipStation V2 shipment ID for label creation';



COMMENT ON COLUMN "public"."orders"."shipstation_order_id" IS 'ShipStation order ID if using order management';



COMMENT ON COLUMN "public"."orders"."shipping_carrier" IS 'Carrier name (e.g., USPS, FedEx)';



COMMENT ON COLUMN "public"."orders"."shipping_service" IS 'Service name (e.g., Priority Mail)';



COMMENT ON COLUMN "public"."orders"."shipping_service_code" IS 'Service code for API calls';



COMMENT ON COLUMN "public"."orders"."label_created_at" IS 'When shipping label was created';



COMMENT ON COLUMN "public"."orders"."shipstation_status" IS 'Order status in ShipStation (may differ from internal status)';



COMMENT ON COLUMN "public"."orders"."last_synced_at" IS 'Last time this order was synced with ShipStation';



CREATE TABLE IF NOT EXISTS "public"."pages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text",
    "meta_title" "text",
    "meta_description" "text",
    "meta_keywords" "text",
    "is_active" boolean DEFAULT true,
    "show_in_footer" boolean DEFAULT false,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."pages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "amount_cents" integer NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text",
    "status" "text",
    "gateway" "text",
    "gateway_transaction_id" "text",
    "gateway_response" "jsonb",
    "refunded_amount_cents" integer DEFAULT 0,
    "captured_at" timestamp with time zone,
    "failed_at" timestamp with time zone,
    "failure_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "payments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'completed'::"text", 'failed'::"text", 'refunded'::"text", 'partially_refunded'::"text"])))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."paypal_inventory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_variant_id" "uuid",
    "paypal_sku" "text",
    "quantity_available" integer DEFAULT 0,
    "quantity_reserved" integer DEFAULT 0,
    "last_synced_at" timestamp with time zone,
    "sync_status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."paypal_inventory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."paypal_pricing_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" integer,
    "paypal_plan_id" "text",
    "name" "text" NOT NULL,
    "description" "text",
    "status" "text",
    "billing_cycles" "jsonb",
    "payment_preferences" "jsonb",
    "taxes" "jsonb",
    "quantity_supported" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "paypal_pricing_plans_status_check" CHECK (("status" = ANY (ARRAY['ACTIVE'::"text", 'INACTIVE'::"text", 'CREATED'::"text"])))
);


ALTER TABLE "public"."paypal_pricing_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."paypal_webhooks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "text",
    "event_type" "text" NOT NULL,
    "resource_type" "text",
    "resource_id" "text",
    "summary" "text",
    "payload" "jsonb",
    "processed" boolean DEFAULT false,
    "processed_at" timestamp with time zone,
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."paypal_webhooks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_categories" (
    "product_id" integer NOT NULL,
    "category_id" "uuid" NOT NULL
);


ALTER TABLE "public"."product_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_customer_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" integer NOT NULL,
    "group_id" "uuid" NOT NULL,
    "can_view" boolean DEFAULT true,
    "can_purchase" boolean DEFAULT true,
    "override_price_cents" integer,
    "override_min_quantity" integer,
    "override_max_quantity" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_customer_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_option_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" integer,
    "option_type_id" "uuid",
    "is_required" boolean DEFAULT false,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_option_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_option_pricing" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" integer,
    "option_value_id" "uuid",
    "price_adjustment_cents" integer DEFAULT 0,
    "override_sku" "text",
    "is_available" boolean DEFAULT true,
    "stock_override" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "product_option_pricing_override_sku_check" CHECK ((("override_sku" IS NULL) OR ("length"("override_sku") > 0))),
    CONSTRAINT "product_option_pricing_price_adjustment_cents_check" CHECK ((("price_adjustment_cents" >= '-999999'::integer) AND ("price_adjustment_cents" <= 999999))),
    CONSTRAINT "product_option_pricing_stock_override_check" CHECK ((("stock_override" IS NULL) OR ("stock_override" >= 0)))
);


ALTER TABLE "public"."product_option_pricing" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" integer,
    "user_id" "uuid",
    "order_id" "uuid",
    "rating" integer,
    "title" "text",
    "comment" "text",
    "pros" "text",
    "cons" "text",
    "is_verified_purchase" boolean DEFAULT false,
    "is_featured" boolean DEFAULT false,
    "helpful_count" integer DEFAULT 0,
    "not_helpful_count" integer DEFAULT 0,
    "status" "text" DEFAULT 'pending'::"text",
    "moderator_notes" "text",
    "images" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "product_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "product_reviews_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."product_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_variants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" integer NOT NULL,
    "sku" "text",
    "price_cents" integer NOT NULL,
    "compare_at_price_cents" integer,
    "stock" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "option_values" "jsonb",
    "deleted_at" timestamp with time zone,
    "barcode" "text",
    "weight" numeric,
    "width" numeric,
    "height" numeric,
    "depth" numeric,
    "cost_cents" integer,
    "min_stock_level" integer DEFAULT 0,
    "max_stock_level" integer,
    "reserved_stock" integer DEFAULT 0,
    "position" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "option_combination" "jsonb",
    "base_price_cents" integer,
    "calculated_price_cents" integer,
    "auto_generated_sku" "text"
);


ALTER TABLE "public"."product_variants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" integer NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "warranty" "text",
    "condition" "text",
    "allow_purchases" boolean DEFAULT true,
    "is_visible" boolean DEFAULT true,
    "status" "text" DEFAULT 'draft'::"text",
    "fixed_shipping_price_cents" integer,
    "free_shipping" boolean DEFAULT false,
    "weight" numeric,
    "width" numeric,
    "height" numeric,
    "depth" numeric,
    "custom_fields" "jsonb",
    "min_tier_order" integer,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "meta_title" "text",
    "meta_description" "text",
    "meta_keywords" "text",
    "tags" "text"[],
    "upc" "text",
    "ean" "text",
    "isbn" "text",
    "mpn" "text",
    "gtin" "text",
    "video_url" "text",
    "tax_class" "text",
    "requires_shipping" boolean DEFAULT true,
    "allow_backorders" boolean DEFAULT false,
    "min_purchase_quantity" integer DEFAULT 1,
    "max_purchase_quantity" integer,
    "sort_order" integer DEFAULT 0,
    "view_count" integer DEFAULT 0,
    "sales_count" integer DEFAULT 0,
    "rating_average" numeric(3,2),
    "rating_count" integer DEFAULT 0,
    "is_digital" boolean DEFAULT false,
    "download_url" "text",
    "download_limit" integer,
    "is_featured" boolean DEFAULT false,
    "is_new" boolean DEFAULT false,
    "is_bestseller" boolean DEFAULT false,
    "release_date" "date",
    "preorder_release_date" "date",
    "preorder_message" "text",
    "availability_message" "text",
    "cross_sells" "uuid"[],
    "upsells" "uuid"[],
    "related_products" "uuid"[],
    "visibility_type" "text" DEFAULT 'public'::"text",
    "purchasability_type" "text" DEFAULT 'public'::"text",
    "paypal_product_id" "text",
    "sync_status" "text" DEFAULT 'pending'::"text",
    "sync_error" "text",
    "last_synced_at" timestamp with time zone,
    "paypal_category" "text",
    "is_subscription" boolean DEFAULT false,
    "paypal_plan_id" "text",
    "billing_cycles" "jsonb",
    "brand_id" "uuid",
    "base_price_cents" integer,
    "compare_price_cents" integer,
    "cost_price_cents" integer,
    "sku" "text",
    "stock_level" integer DEFAULT 0,
    "low_stock_level" integer DEFAULT 0,
    "search_keywords" "text",
    "manufacturer_part_number" "text",
    "product_url" "text",
    "is_on_sale" boolean DEFAULT false,
    "rating" numeric(2,1),
    "review_count" integer DEFAULT 0,
    "track_inventory" "text" DEFAULT 'none'::"text",
    "retail_price_cents" integer,
    "sale_price_cents" integer,
    "calculated_price_cents" integer,
    "bin_picking_number" "text",
    "product_availability" "text",
    "brand_plus_name" "text",
    "show_product_condition" boolean DEFAULT false,
    "tax_provider_tax_code" "text",
    "redirect_old_url" boolean DEFAULT false,
    "option_set" "text",
    "option_set_align" "text",
    "stop_processing_rules" boolean DEFAULT false,
    "product_custom_fields" "jsonb",
    "product_files" "jsonb",
    "shipping_groups" "text"[],
    "origin_locations" "text"[],
    "dimensional_rules" "jsonb",
    "event_date_required" boolean DEFAULT false,
    "event_date_name" "text",
    "event_date_is_limited" boolean DEFAULT false,
    "event_date_start_date" timestamp with time zone,
    "event_date_end_date" timestamp with time zone,
    "myob_asset_acct" "text",
    "myob_income_acct" "text",
    "myob_expense_acct" "text",
    "date_added" timestamp with time zone,
    "date_modified" timestamp with time zone,
    "global_trade_item_number" "text",
    "is_raffle_only" boolean DEFAULT false,
    "raffle_id" integer,
    CONSTRAINT "products_condition_check" CHECK (("condition" = ANY (ARRAY['new'::"text", 'used'::"text", 'refurbished'::"text"]))),
    CONSTRAINT "products_purchasability_type_check" CHECK (("purchasability_type" = ANY (ARRAY['public'::"text", 'groups'::"text", 'private'::"text"]))),
    CONSTRAINT "products_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'draft'::"text", 'archived'::"text"]))),
    CONSTRAINT "products_sync_status_check" CHECK (("sync_status" = ANY (ARRAY['pending'::"text", 'synced'::"text", 'error'::"text", 'local_only'::"text"]))),
    CONSTRAINT "products_track_inventory_check" CHECK (("track_inventory" = ANY (ARRAY['none'::"text", 'by product'::"text", 'by variant'::"text"]))),
    CONSTRAINT "products_visibility_type_check" CHECK (("visibility_type" = ANY (ARRAY['public'::"text", 'groups'::"text", 'private'::"text"])))
);


ALTER TABLE "public"."products" OWNER TO "postgres";


COMMENT ON COLUMN "public"."products"."sort_order" IS 'Manual sort order for display (lower numbers appear first)';



COMMENT ON COLUMN "public"."products"."is_featured" IS 'Flag to mark featured products for homepage/special displays';



CREATE TABLE IF NOT EXISTS "public"."promotion_usage" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "promotion_id" "uuid" NOT NULL,
    "order_id" "uuid",
    "user_id" "uuid",
    "discount_amount_cents" integer NOT NULL,
    "affected_items" "jsonb",
    "used_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."promotion_usage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promotions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "type" "text" NOT NULL,
    "rules" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "discount_type" "text",
    "discount_value" numeric(10,2),
    "max_discount_amount_cents" integer,
    "auto_apply" boolean DEFAULT true,
    "priority" integer DEFAULT 0,
    "stackable" boolean DEFAULT false,
    "stackable_with_coupons" boolean DEFAULT true,
    "minimum_order_amount_cents" integer,
    "maximum_uses_total" integer,
    "maximum_uses_per_customer" integer,
    "applicable_product_ids" integer[] DEFAULT '{}'::integer[],
    "excluded_product_ids" integer[] DEFAULT '{}'::integer[],
    "applicable_category_ids" "uuid"[] DEFAULT '{}'::"uuid"[],
    "excluded_category_ids" "uuid"[] DEFAULT '{}'::"uuid"[],
    "applicable_brand_ids" "uuid"[] DEFAULT '{}'::"uuid"[],
    "customer_group_ids" "uuid"[] DEFAULT '{}'::"uuid"[],
    "new_customers_only" boolean DEFAULT false,
    "existing_customers_only" boolean DEFAULT false,
    "starts_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "schedule" "jsonb",
    "show_on_product_page" boolean DEFAULT true,
    "show_in_cart" boolean DEFAULT true,
    "badge_text" "text",
    "badge_color" "text",
    "is_active" boolean DEFAULT true,
    "usage_count" integer DEFAULT 0,
    "total_discount_given_cents" bigint DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "deleted_at" timestamp with time zone,
    CONSTRAINT "promotions_discount_type_check" CHECK (("discount_type" = ANY (ARRAY['percentage'::"text", 'fixed_amount'::"text", 'free_item'::"text"]))),
    CONSTRAINT "promotions_type_check" CHECK (("type" = ANY (ARRAY['percentage_off'::"text", 'fixed_amount_off'::"text", 'bogo'::"text", 'bundle'::"text", 'tiered'::"text", 'free_shipping'::"text"])))
);


ALTER TABLE "public"."promotions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "value" "text",
    "type" "text" DEFAULT 'text'::"text",
    "category" "text" DEFAULT 'general'::"text",
    "label" "text" NOT NULL,
    "description" "text",
    "sort_order" integer DEFAULT 0,
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shipping_notifications" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "email_on_shipped" boolean DEFAULT true,
    "email_on_delivered" boolean DEFAULT true,
    "email_on_exception" boolean DEFAULT true,
    "sms_on_shipped" boolean DEFAULT false,
    "sms_on_delivered" boolean DEFAULT false,
    "sms_phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shipping_notifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."shipping_notifications" IS 'User preferences for shipping notifications';



CREATE SEQUENCE IF NOT EXISTS "public"."shipping_notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shipping_notifications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shipping_notifications_id_seq" OWNED BY "public"."shipping_notifications"."id";



CREATE TABLE IF NOT EXISTS "public"."shipping_rates_cache" (
    "id" integer NOT NULL,
    "cache_key" "text" NOT NULL,
    "from_postal_code" "text" NOT NULL,
    "to_postal_code" "text" NOT NULL,
    "weight" numeric(10,2) NOT NULL,
    "dimensions" "jsonb",
    "rates" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."shipping_rates_cache" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."shipping_rates_cache_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shipping_rates_cache_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shipping_rates_cache_id_seq" OWNED BY "public"."shipping_rates_cache"."id";



CREATE TABLE IF NOT EXISTS "public"."shipstation_automation_rules" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "enabled" boolean DEFAULT true,
    "trigger_event" "text" NOT NULL,
    "conditions" "jsonb" NOT NULL,
    "actions" "jsonb" NOT NULL,
    "priority" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."shipstation_automation_rules" OWNER TO "postgres";


COMMENT ON TABLE "public"."shipstation_automation_rules" IS 'Custom automation rules for order processing';



CREATE SEQUENCE IF NOT EXISTS "public"."shipstation_automation_rules_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shipstation_automation_rules_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shipstation_automation_rules_id_seq" OWNED BY "public"."shipstation_automation_rules"."id";



CREATE TABLE IF NOT EXISTS "public"."shipstation_carriers" (
    "id" integer NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "account_number" "text",
    "requires_funded_account" boolean DEFAULT false,
    "primary_carrier" boolean DEFAULT false,
    "has_label_messages" boolean DEFAULT false,
    "services" "jsonb",
    "packages" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shipstation_carriers" OWNER TO "postgres";


COMMENT ON TABLE "public"."shipstation_carriers" IS 'Available shipping carriers and their services';



CREATE SEQUENCE IF NOT EXISTS "public"."shipstation_carriers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shipstation_carriers_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shipstation_carriers_id_seq" OWNED BY "public"."shipstation_carriers"."id";



CREATE TABLE IF NOT EXISTS "public"."shipstation_labels" (
    "id" integer NOT NULL,
    "order_id" "uuid",
    "shipment_id" "text",
    "label_id" "text",
    "carrier_code" "text" NOT NULL,
    "service_code" "text" NOT NULL,
    "package_code" "text",
    "confirmation" "text",
    "tracking_number" "text",
    "label_url" "text",
    "form_url" "text",
    "insurance_cost" numeric(10,2),
    "shipping_cost" numeric(10,2) NOT NULL,
    "voided" boolean DEFAULT false,
    "voided_at" timestamp with time zone,
    "void_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."shipstation_labels" OWNER TO "postgres";


COMMENT ON TABLE "public"."shipstation_labels" IS 'History of all shipping labels created';



CREATE SEQUENCE IF NOT EXISTS "public"."shipstation_labels_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shipstation_labels_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shipstation_labels_id_seq" OWNED BY "public"."shipstation_labels"."id";



CREATE TABLE IF NOT EXISTS "public"."shipstation_sync_logs" (
    "id" integer NOT NULL,
    "order_id" "uuid",
    "action" "text" NOT NULL,
    "success" boolean DEFAULT false NOT NULL,
    "error_message" "text",
    "error_code" "text",
    "request_data" "jsonb",
    "response_data" "jsonb",
    "rate_limit_remaining" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."shipstation_sync_logs" OWNER TO "postgres";


COMMENT ON TABLE "public"."shipstation_sync_logs" IS 'Audit log for all ShipStation API operations';



CREATE SEQUENCE IF NOT EXISTS "public"."shipstation_sync_logs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shipstation_sync_logs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shipstation_sync_logs_id_seq" OWNED BY "public"."shipstation_sync_logs"."id";



CREATE TABLE IF NOT EXISTS "public"."shipstation_tags" (
    "id" integer NOT NULL,
    "shipstation_id" integer NOT NULL,
    "name" "text" NOT NULL,
    "color" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shipstation_tags" OWNER TO "postgres";


COMMENT ON TABLE "public"."shipstation_tags" IS 'Order tags for organization and automation';



CREATE SEQUENCE IF NOT EXISTS "public"."shipstation_tags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shipstation_tags_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shipstation_tags_id_seq" OWNED BY "public"."shipstation_tags"."id";



CREATE TABLE IF NOT EXISTS "public"."shipstation_warehouses" (
    "id" integer NOT NULL,
    "shipstation_id" integer NOT NULL,
    "name" "text" NOT NULL,
    "origin_address" "jsonb" NOT NULL,
    "return_address" "jsonb",
    "is_default" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shipstation_warehouses" OWNER TO "postgres";


COMMENT ON TABLE "public"."shipstation_warehouses" IS 'Configured warehouses from ShipStation';



CREATE SEQUENCE IF NOT EXISTS "public"."shipstation_warehouses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."shipstation_warehouses_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."shipstation_warehouses_id_seq" OWNED BY "public"."shipstation_warehouses"."id";



CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "value" "jsonb" NOT NULL,
    "category" "text" NOT NULL,
    "description" "text",
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."site_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sync_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sync_type" "text" NOT NULL,
    "status" "text" NOT NULL,
    "total_records" integer DEFAULT 0,
    "synced_records" integer DEFAULT 0,
    "failed_records" integer DEFAULT 0,
    "error_details" "jsonb",
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "created_by" "uuid",
    CONSTRAINT "sync_logs_status_check" CHECK (("status" = ANY (ARRAY['started'::"text", 'completed'::"text", 'failed'::"text"]))),
    CONSTRAINT "sync_logs_sync_type_check" CHECK (("sync_type" = ANY (ARRAY['products'::"text", 'inventory'::"text", 'orders'::"text", 'customers'::"text"])))
);


ALTER TABLE "public"."sync_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tax_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "enabled" boolean DEFAULT false,
    "provider" "text" DEFAULT 'taxcloud'::"text",
    "origin_address" "text",
    "origin_city" "text",
    "origin_state" "text",
    "origin_zip" "text",
    "origin_country" "text" DEFAULT 'US'::"text",
    "tax_shipping" boolean DEFAULT true,
    "tax_enabled_states" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    CONSTRAINT "tax_settings_provider_check" CHECK (("provider" = ANY (ARRAY['taxcloud'::"text", 'none'::"text"])))
);


ALTER TABLE "public"."tax_settings" OWNER TO "postgres";


COMMENT ON TABLE "public"."tax_settings" IS 'Configuration for tax calculation. API credentials are stored in environment variables for security.';



COMMENT ON COLUMN "public"."tax_settings"."enabled" IS 'Master switch for tax calculation. Set to false to disable all tax calculations.';



COMMENT ON COLUMN "public"."tax_settings"."tax_enabled_states" IS 'List of state codes where tax should be collected. Empty array means all states.';



CREATE TABLE IF NOT EXISTS "public"."user_customer_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "group_id" "uuid" NOT NULL,
    "approved_at" timestamp with time zone,
    "approved_by" "uuid",
    "expires_at" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_customer_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "full_name" "text",
    "is_admin" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "username" "text",
    "first_name" "text",
    "last_name" "text",
    "phone" "text",
    "date_of_birth" "date",
    "avatar_url" "text",
    "loyalty_points" integer DEFAULT 0,
    "lifetime_spent_cents" integer DEFAULT 0,
    "total_orders" integer DEFAULT 0,
    "tier_id" "uuid",
    "tier_progress_cents" integer DEFAULT 0,
    "referral_code" "text",
    "referred_by" "uuid",
    "email_verified" boolean DEFAULT false,
    "email_verified_at" timestamp with time zone,
    "phone_verified" boolean DEFAULT false,
    "phone_verified_at" timestamp with time zone,
    "accepts_marketing" boolean DEFAULT true,
    "last_login_at" timestamp with time zone,
    "notes" "text",
    "tags" "text"[],
    "vip_status" boolean DEFAULT false,
    "suspended_at" timestamp with time zone,
    "suspension_reason" "text",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_is_admin" AS
 SELECT "id" AS "user_id",
    "is_admin"
   FROM "public"."users" "u";


ALTER VIEW "public"."v_is_admin" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webhook_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" "text",
    "payload" "jsonb",
    "received_at" timestamp with time zone DEFAULT "now"(),
    "processed" boolean DEFAULT false,
    "error" "text"
);


ALTER TABLE "public"."webhook_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wishlist_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wishlist_id" "uuid",
    "product_id" integer,
    "added_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."wishlist_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wishlists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" "text" DEFAULT 'Default'::"text",
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."wishlists" OWNER TO "postgres";


ALTER TABLE ONLY "public"."shipping_notifications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shipping_notifications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."shipping_rates_cache" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shipping_rates_cache_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."shipstation_automation_rules" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shipstation_automation_rules_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."shipstation_carriers" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shipstation_carriers_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."shipstation_labels" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shipstation_labels_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."shipstation_sync_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shipstation_sync_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."shipstation_tags" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shipstation_tags_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."shipstation_warehouses" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."shipstation_warehouses_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."banners"
    ADD CONSTRAINT "banners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."brand_customer_groups"
    ADD CONSTRAINT "brand_customer_groups_brand_id_group_id_key" UNIQUE ("brand_id", "group_id");



ALTER TABLE ONLY "public"."brand_customer_groups"
    ADD CONSTRAINT "brand_customer_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."carousel_settings"
    ADD CONSTRAINT "carousel_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carousel_slides"
    ADD CONSTRAINT "carousel_slides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."category_customer_groups"
    ADD CONSTRAINT "category_customer_groups_category_id_group_id_key" UNIQUE ("category_id", "group_id");



ALTER TABLE ONLY "public"."category_customer_groups"
    ADD CONSTRAINT "category_customer_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coupon_usage"
    ADD CONSTRAINT "coupon_usage_order_id_key" UNIQUE ("order_id");



ALTER TABLE ONLY "public"."coupon_usage"
    ADD CONSTRAINT "coupon_usage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coupons"
    ADD CONSTRAINT "coupons_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."coupons"
    ADD CONSTRAINT "coupons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_groups"
    ADD CONSTRAINT "customer_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_groups"
    ADD CONSTRAINT "customer_groups_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."customer_sessions"
    ADD CONSTRAINT "customer_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_sessions"
    ADD CONSTRAINT "customer_sessions_session_token_key" UNIQUE ("session_token");



ALTER TABLE ONLY "public"."discounts"
    ADD CONSTRAINT "discounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_log"
    ADD CONSTRAINT "email_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_queue"
    ADD CONSTRAINT "email_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_settings"
    ADD CONSTRAINT "email_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_settings"
    ADD CONSTRAINT "email_settings_provider_is_active_key" UNIQUE ("provider", "is_active");



ALTER TABLE ONLY "public"."email_templates"
    ADD CONSTRAINT "email_templates_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."email_templates"
    ADD CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gift_cards"
    ADD CONSTRAINT "gift_cards_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."gift_cards"
    ADD CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."global_option_types"
    ADD CONSTRAINT "global_option_types_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."global_option_types"
    ADD CONSTRAINT "global_option_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."global_option_values"
    ADD CONSTRAINT "global_option_values_option_type_id_value_key" UNIQUE ("option_type_id", "value");



ALTER TABLE ONLY "public"."global_option_values"
    ADD CONSTRAINT "global_option_values_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_logs"
    ADD CONSTRAINT "inventory_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."loyalty_tiers"
    ADD CONSTRAINT "loyalty_tiers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."loyalty_tiers"
    ADD CONSTRAINT "loyalty_tiers_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."mailchimp_settings"
    ADD CONSTRAINT "mailchimp_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mailchimp_sync_log"
    ADD CONSTRAINT "mailchimp_sync_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mailchimp_sync_status"
    ADD CONSTRAINT "mailchimp_sync_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mailchimp_sync_status"
    ADD CONSTRAINT "mailchimp_sync_status_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."media_library"
    ADD CONSTRAINT "media_library_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."media_usage"
    ADD CONSTRAINT "media_usage_media_id_entity_type_entity_id_field_name_key" UNIQUE ("media_id", "entity_type", "entity_id", "field_name");



ALTER TABLE ONLY "public"."media_usage"
    ADD CONSTRAINT "media_usage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_location_key" UNIQUE ("location");



ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_tags"
    ADD CONSTRAINT "order_tags_pkey" PRIMARY KEY ("order_id", "tag_id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."paypal_inventory"
    ADD CONSTRAINT "paypal_inventory_paypal_sku_key" UNIQUE ("paypal_sku");



ALTER TABLE ONLY "public"."paypal_inventory"
    ADD CONSTRAINT "paypal_inventory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."paypal_inventory"
    ADD CONSTRAINT "paypal_inventory_product_variant_id_key" UNIQUE ("product_variant_id");



ALTER TABLE ONLY "public"."paypal_pricing_plans"
    ADD CONSTRAINT "paypal_pricing_plans_paypal_plan_id_key" UNIQUE ("paypal_plan_id");



ALTER TABLE ONLY "public"."paypal_pricing_plans"
    ADD CONSTRAINT "paypal_pricing_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."paypal_webhooks"
    ADD CONSTRAINT "paypal_webhooks_event_id_key" UNIQUE ("event_id");



ALTER TABLE ONLY "public"."paypal_webhooks"
    ADD CONSTRAINT "paypal_webhooks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id", "category_id");



ALTER TABLE ONLY "public"."product_customer_groups"
    ADD CONSTRAINT "product_customer_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_customer_groups"
    ADD CONSTRAINT "product_customer_groups_product_id_group_id_key" UNIQUE ("product_id", "group_id");



ALTER TABLE ONLY "public"."product_option_assignments"
    ADD CONSTRAINT "product_option_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_option_assignments"
    ADD CONSTRAINT "product_option_assignments_product_id_option_type_id_key" UNIQUE ("product_id", "option_type_id");



ALTER TABLE ONLY "public"."product_option_pricing"
    ADD CONSTRAINT "product_option_pricing_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_option_pricing"
    ADD CONSTRAINT "product_option_pricing_product_id_option_value_id_key" UNIQUE ("product_id", "option_value_id");



ALTER TABLE ONLY "public"."product_reviews"
    ADD CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_variants"
    ADD CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_paypal_product_id_key" UNIQUE ("paypal_product_id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotion_usage"
    ADD CONSTRAINT "promotion_usage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotion_usage"
    ADD CONSTRAINT "promotion_usage_promotion_id_order_id_key" UNIQUE ("promotion_id", "order_id");



ALTER TABLE ONLY "public"."promotions"
    ADD CONSTRAINT "promotions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipping_notifications"
    ADD CONSTRAINT "shipping_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipping_notifications"
    ADD CONSTRAINT "shipping_notifications_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."shipping_rates_cache"
    ADD CONSTRAINT "shipping_rates_cache_cache_key_key" UNIQUE ("cache_key");



ALTER TABLE ONLY "public"."shipping_rates_cache"
    ADD CONSTRAINT "shipping_rates_cache_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipstation_automation_rules"
    ADD CONSTRAINT "shipstation_automation_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipstation_carriers"
    ADD CONSTRAINT "shipstation_carriers_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."shipstation_carriers"
    ADD CONSTRAINT "shipstation_carriers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipstation_labels"
    ADD CONSTRAINT "shipstation_labels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipstation_labels"
    ADD CONSTRAINT "shipstation_labels_shipment_id_key" UNIQUE ("shipment_id");



ALTER TABLE ONLY "public"."shipstation_sync_logs"
    ADD CONSTRAINT "shipstation_sync_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipstation_tags"
    ADD CONSTRAINT "shipstation_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipstation_tags"
    ADD CONSTRAINT "shipstation_tags_shipstation_id_key" UNIQUE ("shipstation_id");



ALTER TABLE ONLY "public"."shipstation_warehouses"
    ADD CONSTRAINT "shipstation_warehouses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipstation_warehouses"
    ADD CONSTRAINT "shipstation_warehouses_shipstation_id_key" UNIQUE ("shipstation_id");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sync_logs"
    ADD CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tax_settings"
    ADD CONSTRAINT "tax_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."banners"
    ADD CONSTRAINT "unique_banner_position_slot" UNIQUE ("position", "slot_number");



ALTER TABLE ONLY "public"."user_customer_groups"
    ADD CONSTRAINT "user_customer_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_customer_groups"
    ADD CONSTRAINT "user_customer_groups_user_id_group_id_key" UNIQUE ("user_id", "group_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_referral_code_key" UNIQUE ("referral_code");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."webhook_events"
    ADD CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wishlist_items"
    ADD CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id");



CREATE INDEX "analytics_created_idx" ON "public"."analytics_events" USING "btree" ("created_at");



CREATE INDEX "analytics_type_idx" ON "public"."analytics_events" USING "btree" ("event_type");



CREATE INDEX "analytics_user_idx" ON "public"."analytics_events" USING "btree" ("user_id");



CREATE INDEX "banners_active_idx" ON "public"."banners" USING "btree" ("position", "display_order") WHERE ("is_active" = true);



CREATE INDEX "banners_page_targeting_idx" ON "public"."banners" USING "gin" ("target_pages");



CREATE INDEX "blog_posts_featured_idx" ON "public"."blog_posts" USING "btree" ("featured", "published_at" DESC) WHERE (("status" = 'published'::"text") AND ("featured" = true));



CREATE INDEX "blog_posts_published_idx" ON "public"."blog_posts" USING "btree" ("published_at" DESC) WHERE ("status" = 'published'::"text");



CREATE INDEX "brand_customer_groups_brand_idx" ON "public"."brand_customer_groups" USING "btree" ("brand_id");



CREATE INDEX "brand_customer_groups_group_idx" ON "public"."brand_customer_groups" USING "btree" ("group_id");



CREATE INDEX "brands_featured_idx" ON "public"."brands" USING "btree" ("display_order") WHERE (("is_active" = true) AND ("featured" = true));



CREATE INDEX "brands_featured_sort_idx" ON "public"."brands" USING "btree" ("featured" DESC, "display_order");



CREATE INDEX "categories_active_idx" ON "public"."categories" USING "btree" ("parent_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "categories_featured_sort_idx" ON "public"."categories" USING "btree" ("is_featured" DESC, "sort_order", "display_order");



CREATE UNIQUE INDEX "categories_slug_unique_active" ON "public"."categories" USING "btree" ("slug") WHERE ("deleted_at" IS NULL);



CREATE INDEX "category_customer_groups_category_idx" ON "public"."category_customer_groups" USING "btree" ("category_id");



CREATE INDEX "category_customer_groups_group_idx" ON "public"."category_customer_groups" USING "btree" ("group_id");



CREATE INDEX "coupon_usage_coupon_idx" ON "public"."coupon_usage" USING "btree" ("coupon_id");



CREATE INDEX "coupon_usage_paypal_order_idx" ON "public"."coupon_usage" USING "btree" ("paypal_order_id") WHERE ("paypal_order_id" IS NOT NULL);



CREATE INDEX "coupon_usage_user_idx" ON "public"."coupon_usage" USING "btree" ("user_id");



CREATE INDEX "coupons_active_idx" ON "public"."coupons" USING "btree" ("is_active", "starts_at", "expires_at");



CREATE INDEX "coupons_categories_idx" ON "public"."coupons" USING "gin" ("applicable_category_ids") WHERE ("array_length"("applicable_category_ids", 1) > 0);



CREATE INDEX "coupons_code_idx" ON "public"."coupons" USING "btree" ("code") WHERE ("is_active" = true);



CREATE INDEX "coupons_products_idx" ON "public"."coupons" USING "gin" ("applicable_product_ids") WHERE ("array_length"("applicable_product_ids", 1) > 0);



CREATE UNIQUE INDEX "customer_groups_default_idx" ON "public"."customer_groups" USING "btree" ("is_default") WHERE ("is_default" = true);



CREATE UNIQUE INDEX "discounts_code_unique_active" ON "public"."discounts" USING "btree" ("code") WHERE ("deleted_at" IS NULL);



CREATE INDEX "gift_cards_code_idx" ON "public"."gift_cards" USING "btree" ("code");



CREATE INDEX "global_option_types_active_idx" ON "public"."global_option_types" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "global_option_values_active_idx" ON "public"."global_option_values" USING "btree" ("option_type_id", "is_active") WHERE ("is_active" = true);



CREATE INDEX "global_option_values_type_idx" ON "public"."global_option_values" USING "btree" ("option_type_id");



CREATE INDEX "idx_banners_media_id" ON "public"."banners" USING "btree" ("media_id");



CREATE INDEX "idx_blog_posts_featured_image_media_id" ON "public"."blog_posts" USING "btree" ("featured_image_media_id");



CREATE INDEX "idx_brands_banner_media_id" ON "public"."brands" USING "btree" ("banner_media_id");



CREATE INDEX "idx_brands_banner_media_id_2" ON "public"."brands" USING "btree" ("banner_media_id_2");



CREATE INDEX "idx_brands_logo_media_id" ON "public"."brands" USING "btree" ("logo_media_id");



CREATE INDEX "idx_carousel_slides_media_id" ON "public"."carousel_slides" USING "btree" ("media_id");



CREATE INDEX "idx_email_log_message_id" ON "public"."email_log" USING "btree" ("message_id");



CREATE INDEX "idx_email_log_recipient" ON "public"."email_log" USING "btree" ("recipient");



CREATE INDEX "idx_email_log_sent_at" ON "public"."email_log" USING "btree" ("sent_at" DESC);



CREATE INDEX "idx_email_log_status" ON "public"."email_log" USING "btree" ("status");



CREATE INDEX "idx_email_queue_process" ON "public"."email_queue" USING "btree" ("status", "send_at") WHERE ("status" = 'pending'::"text");



CREATE INDEX "idx_email_queue_send_at" ON "public"."email_queue" USING "btree" ("send_at");



CREATE INDEX "idx_email_queue_status" ON "public"."email_queue" USING "btree" ("status");



CREATE INDEX "idx_labels_order" ON "public"."shipstation_labels" USING "btree" ("order_id");



CREATE INDEX "idx_labels_tracking" ON "public"."shipstation_labels" USING "btree" ("tracking_number");



CREATE INDEX "idx_labels_voided" ON "public"."shipstation_labels" USING "btree" ("voided");



CREATE INDEX "idx_mailchimp_log_created" ON "public"."mailchimp_sync_log" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_mailchimp_log_type" ON "public"."mailchimp_sync_log" USING "btree" ("event_type");



CREATE INDEX "idx_mailchimp_sync_status" ON "public"."mailchimp_sync_status" USING "btree" ("sync_status");



CREATE INDEX "idx_mailchimp_sync_user" ON "public"."mailchimp_sync_status" USING "btree" ("user_id");



CREATE INDEX "idx_media_library_created_at" ON "public"."media_library" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_media_library_folder" ON "public"."media_library" USING "btree" ("folder");



CREATE INDEX "idx_media_library_mime_type" ON "public"."media_library" USING "btree" ("mime_type");



CREATE INDEX "idx_media_library_search" ON "public"."media_library" USING "gin" ("search_vector");



CREATE INDEX "idx_media_library_tags" ON "public"."media_library" USING "gin" ("tags");



CREATE INDEX "idx_media_library_uploaded_by" ON "public"."media_library" USING "btree" ("uploaded_by");



CREATE INDEX "idx_media_usage_entity" ON "public"."media_usage" USING "btree" ("entity_type", "entity_id");



CREATE INDEX "idx_media_usage_media_id" ON "public"."media_usage" USING "btree" ("media_id");



CREATE INDEX "idx_menu_items_menu_id" ON "public"."menu_items" USING "btree" ("menu_id");



CREATE INDEX "idx_menu_items_parent_id" ON "public"."menu_items" USING "btree" ("parent_id");



CREATE INDEX "idx_menu_items_sort_order" ON "public"."menu_items" USING "btree" ("sort_order");



CREATE INDEX "idx_orders_created_at_desc" ON "public"."orders" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_orders_last_synced" ON "public"."orders" USING "btree" ("last_synced_at");



CREATE INDEX "idx_orders_order_number" ON "public"."orders" USING "btree" ("order_number");



CREATE INDEX "idx_orders_shipstation_order_id" ON "public"."orders" USING "btree" ("shipstation_order_id");



CREATE INDEX "idx_orders_shipstation_shipment_id" ON "public"."orders" USING "btree" ("shipstation_shipment_id");



CREATE INDEX "idx_orders_shipstation_status" ON "public"."orders" USING "btree" ("shipstation_status");



CREATE INDEX "idx_orders_status_created" ON "public"."orders" USING "btree" ("status", "created_at" DESC);



CREATE INDEX "idx_orders_tracking_number" ON "public"."orders" USING "btree" ("tracking_number");



CREATE INDEX "idx_pages_active" ON "public"."pages" USING "btree" ("is_active");



CREATE INDEX "idx_pages_slug" ON "public"."pages" USING "btree" ("slug");



CREATE INDEX "idx_promotion_usage_order" ON "public"."promotion_usage" USING "btree" ("order_id");



CREATE INDEX "idx_promotion_usage_promotion" ON "public"."promotion_usage" USING "btree" ("promotion_id");



CREATE INDEX "idx_promotion_usage_user" ON "public"."promotion_usage" USING "btree" ("user_id");



CREATE INDEX "idx_promotions_active" ON "public"."promotions" USING "btree" ("is_active") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_promotions_categories" ON "public"."promotions" USING "gin" ("applicable_category_ids");



CREATE INDEX "idx_promotions_dates" ON "public"."promotions" USING "btree" ("starts_at", "expires_at") WHERE (("is_active" = true) AND ("deleted_at" IS NULL));



CREATE INDEX "idx_promotions_groups" ON "public"."promotions" USING "gin" ("customer_group_ids");



CREATE INDEX "idx_promotions_priority" ON "public"."promotions" USING "btree" ("priority" DESC) WHERE (("is_active" = true) AND ("deleted_at" IS NULL));



CREATE INDEX "idx_promotions_products" ON "public"."promotions" USING "gin" ("applicable_product_ids");



CREATE INDEX "idx_promotions_type" ON "public"."promotions" USING "btree" ("type") WHERE (("is_active" = true) AND ("deleted_at" IS NULL));



CREATE INDEX "idx_rates_cache_expires" ON "public"."shipping_rates_cache" USING "btree" ("expires_at");



CREATE INDEX "idx_rates_cache_key" ON "public"."shipping_rates_cache" USING "btree" ("cache_key");



CREATE INDEX "idx_settings_category" ON "public"."settings" USING "btree" ("category");



CREATE INDEX "idx_settings_key" ON "public"."settings" USING "btree" ("key");



CREATE INDEX "idx_settings_sort_order" ON "public"."settings" USING "btree" ("sort_order");



CREATE INDEX "idx_sync_logs_created" ON "public"."shipstation_sync_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_sync_logs_order" ON "public"."shipstation_sync_logs" USING "btree" ("order_id");



CREATE INDEX "idx_sync_logs_success" ON "public"."shipstation_sync_logs" USING "btree" ("success");



CREATE UNIQUE INDEX "idx_tax_settings_singleton" ON "public"."tax_settings" USING "btree" ((true));



CREATE UNIQUE INDEX "loyalty_tiers_orderno_unique_active" ON "public"."loyalty_tiers" USING "btree" ("order_no") WHERE ("deleted_at" IS NULL);



CREATE INDEX "orders_coupon_idx" ON "public"."orders" USING "btree" ("coupon_id") WHERE ("coupon_id" IS NOT NULL);



CREATE INDEX "orders_paypal_capture_idx" ON "public"."orders" USING "btree" ("paypal_capture_id") WHERE ("paypal_capture_id" IS NOT NULL);



CREATE INDEX "orders_paypal_order_idx" ON "public"."orders" USING "btree" ("paypal_order_id") WHERE ("paypal_order_id" IS NOT NULL);



CREATE INDEX "orders_user_status_idx" ON "public"."orders" USING "btree" ("user_id", "status");



CREATE INDEX "payments_order_idx" ON "public"."payments" USING "btree" ("order_id");



CREATE INDEX "payments_status_idx" ON "public"."payments" USING "btree" ("status");



CREATE INDEX "paypal_webhooks_event_idx" ON "public"."paypal_webhooks" USING "btree" ("event_id");



CREATE INDEX "paypal_webhooks_unprocessed_idx" ON "public"."paypal_webhooks" USING "btree" ("processed") WHERE ("processed" = false);



CREATE INDEX "product_customer_groups_group_idx" ON "public"."product_customer_groups" USING "btree" ("group_id");



CREATE INDEX "product_customer_groups_product_idx" ON "public"."product_customer_groups" USING "btree" ("product_id");



CREATE INDEX "product_option_assignments_product_idx" ON "public"."product_option_assignments" USING "btree" ("product_id");



CREATE INDEX "product_option_pricing_product_idx" ON "public"."product_option_pricing" USING "btree" ("product_id");



CREATE INDEX "product_variants_active_idx" ON "public"."product_variants" USING "btree" ("product_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "product_variants_combination_idx" ON "public"."product_variants" USING "gin" ("option_combination");



CREATE UNIQUE INDEX "product_variants_sku_unique_active" ON "public"."product_variants" USING "btree" ("sku") WHERE ("deleted_at" IS NULL);



CREATE INDEX "products_active_idx" ON "public"."products" USING "btree" ("is_visible", "status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "products_brand_id_idx" ON "public"."products" USING "btree" ("brand_id");



CREATE INDEX "products_date_added_idx" ON "public"."products" USING "btree" ("date_added");



CREATE INDEX "products_date_modified_idx" ON "public"."products" USING "btree" ("date_modified");



CREATE INDEX "products_featured_sort_idx" ON "public"."products" USING "btree" ("is_featured" DESC, "sort_order") WHERE ("deleted_at" IS NULL);



CREATE INDEX "products_low_stock_idx" ON "public"."products" USING "btree" ("low_stock_level");



CREATE INDEX "products_meta_keywords_idx" ON "public"."products" USING "gin" ("to_tsvector"('"english"'::"regconfig", COALESCE("meta_keywords", ''::"text")));



CREATE INDEX "products_paypal_id_idx" ON "public"."products" USING "btree" ("paypal_product_id") WHERE ("paypal_product_id" IS NOT NULL);



CREATE INDEX "products_retail_price_idx" ON "public"."products" USING "btree" ("retail_price_cents");



CREATE INDEX "products_sale_price_idx" ON "public"."products" USING "btree" ("sale_price_cents");



CREATE INDEX "products_search_keywords_idx" ON "public"."products" USING "gin" ("to_tsvector"('"english"'::"regconfig", COALESCE("search_keywords", ''::"text")));



CREATE INDEX "products_sku_idx" ON "public"."products" USING "btree" ("sku") WHERE ("deleted_at" IS NULL);



CREATE UNIQUE INDEX "products_slug_unique_active" ON "public"."products" USING "btree" ("slug") WHERE ("deleted_at" IS NULL);



CREATE INDEX "products_sort_order_idx" ON "public"."products" USING "btree" ("sort_order");



CREATE INDEX "products_stock_level_idx" ON "public"."products" USING "btree" ("stock_level") WHERE ("deleted_at" IS NULL);



CREATE INDEX "products_sync_status_idx" ON "public"."products" USING "btree" ("sync_status") WHERE ("sync_status" <> 'synced'::"text");



CREATE INDEX "reviews_product_idx" ON "public"."product_reviews" USING "btree" ("product_id", "status");



CREATE INDEX "reviews_user_idx" ON "public"."product_reviews" USING "btree" ("user_id");



CREATE INDEX "sessions_token_idx" ON "public"."customer_sessions" USING "btree" ("session_token");



CREATE INDEX "sessions_user_idx" ON "public"."customer_sessions" USING "btree" ("user_id");



CREATE INDEX "user_customer_groups_group_idx" ON "public"."user_customer_groups" USING "btree" ("group_id");



CREATE INDEX "user_customer_groups_user_idx" ON "public"."user_customer_groups" USING "btree" ("user_id");



CREATE OR REPLACE VIEW "public"."coupon_analytics" AS
 SELECT "c"."id",
    "c"."code",
    "c"."name",
    "c"."description",
    "c"."discount_type",
    "c"."discount_value",
    "c"."usage_limit",
    "c"."usage_count",
    "c"."is_active",
    "c"."starts_at",
    "c"."expires_at",
    "c"."created_at",
    "c"."updated_at",
    "count"("cu"."id") AS "actual_usage_count",
    COALESCE("sum"("cu"."discount_amount_cents"), (0)::bigint) AS "total_discount_given_cents",
    COALESCE("avg"("cu"."discount_amount_cents"), (0)::numeric) AS "avg_discount_per_use_cents",
    COALESCE("sum"("cu"."order_total_cents"), (0)::bigint) AS "total_order_value_cents",
        CASE
            WHEN ("c"."usage_limit" IS NOT NULL) THEN "round"(((("count"("cu"."id"))::numeric / ("c"."usage_limit")::numeric) * (100)::numeric), 2)
            ELSE NULL::numeric
        END AS "usage_rate_percentage",
    "min"("cu"."used_at") AS "first_used_at",
    "max"("cu"."used_at") AS "last_used_at",
    "count"(DISTINCT "cu"."user_id") AS "unique_users_count"
   FROM ("public"."coupons" "c"
     LEFT JOIN "public"."coupon_usage" "cu" ON (("c"."id" = "cu"."coupon_id")))
  GROUP BY "c"."id";



CREATE OR REPLACE TRIGGER "product_paypal_sync_trigger" BEFORE UPDATE ON "public"."products" FOR EACH ROW WHEN (("old"."paypal_product_id" IS NOT NULL)) EXECUTE FUNCTION "public"."mark_product_for_sync"();



CREATE OR REPLACE TRIGGER "trigger_set_order_number" BEFORE INSERT ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."set_order_number"();



CREATE OR REPLACE TRIGGER "trigger_sync_shipstation_status" BEFORE UPDATE OF "shipstation_status" ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."sync_shipstation_status"();



CREATE OR REPLACE TRIGGER "update_banners_updated_at" BEFORE UPDATE ON "public"."banners" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_blog_posts_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_brands_updated_at" BEFORE UPDATE ON "public"."brands" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_carousel_settings_updated_at" BEFORE UPDATE ON "public"."carousel_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_carousel_slides_updated_at" BEFORE UPDATE ON "public"."carousel_slides" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_cart_items_updated_at" BEFORE UPDATE ON "public"."cart_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_carts_updated_at" BEFORE UPDATE ON "public"."carts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_categories_updated_at" BEFORE UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_coupons_updated_at" BEFORE UPDATE ON "public"."coupons" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_customer_groups_updated_at" BEFORE UPDATE ON "public"."customer_groups" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_gift_cards_updated_at" BEFORE UPDATE ON "public"."gift_cards" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_global_option_types_updated_at" BEFORE UPDATE ON "public"."global_option_types" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_global_option_values_updated_at" BEFORE UPDATE ON "public"."global_option_values" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_media_library_updated_at" BEFORE UPDATE ON "public"."media_library" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_media_search_vector_trigger" BEFORE INSERT OR UPDATE ON "public"."media_library" FOR EACH ROW EXECUTE FUNCTION "public"."update_media_search_vector"();



CREATE OR REPLACE TRIGGER "update_menu_items_updated_at" BEFORE UPDATE ON "public"."menu_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_menus_updated_at" BEFORE UPDATE ON "public"."menus" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_orders_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_pages_updated_at" BEFORE UPDATE ON "public"."pages" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payments_updated_at" BEFORE UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_paypal_inventory_updated_at" BEFORE UPDATE ON "public"."paypal_inventory" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_paypal_pricing_plans_updated_at" BEFORE UPDATE ON "public"."paypal_pricing_plans" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_product_option_pricing_updated_at" BEFORE UPDATE ON "public"."product_option_pricing" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_product_reviews_updated_at" BEFORE UPDATE ON "public"."product_reviews" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_product_variants_updated_at" BEFORE UPDATE ON "public"."product_variants" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_products_updated_at" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_settings_updated_at" BEFORE UPDATE ON "public"."settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_site_settings_updated_at" BEFORE UPDATE ON "public"."site_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_tax_settings_timestamp" BEFORE UPDATE ON "public"."tax_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_tax_settings_updated_at"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "variant_inventory_sync_trigger" AFTER UPDATE ON "public"."product_variants" FOR EACH ROW WHEN (("old"."stock" IS DISTINCT FROM "new"."stock")) EXECUTE FUNCTION "public"."track_inventory_change"();



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."banners"
    ADD CONSTRAINT "banners_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media_library"("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_featured_image_media_id_fkey" FOREIGN KEY ("featured_image_media_id") REFERENCES "public"."media_library"("id");



ALTER TABLE ONLY "public"."brand_customer_groups"
    ADD CONSTRAINT "brand_customer_groups_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."brand_customer_groups"
    ADD CONSTRAINT "brand_customer_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."customer_groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_banner_media_id_2_fkey" FOREIGN KEY ("banner_media_id_2") REFERENCES "public"."media_library"("id");



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_banner_media_id_fkey" FOREIGN KEY ("banner_media_id") REFERENCES "public"."media_library"("id");



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_logo_media_id_fkey" FOREIGN KEY ("logo_media_id") REFERENCES "public"."media_library"("id");



ALTER TABLE ONLY "public"."carousel_slides"
    ADD CONSTRAINT "carousel_slides_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media_library"("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."category_customer_groups"
    ADD CONSTRAINT "category_customer_groups_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."category_customer_groups"
    ADD CONSTRAINT "category_customer_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."customer_groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."coupon_usage"
    ADD CONSTRAINT "coupon_usage_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."coupon_usage"
    ADD CONSTRAINT "coupon_usage_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."coupon_usage"
    ADD CONSTRAINT "coupon_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."coupons"
    ADD CONSTRAINT "coupons_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."customer_sessions"
    ADD CONSTRAINT "customer_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."email_log"
    ADD CONSTRAINT "email_log_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."email_log"
    ADD CONSTRAINT "email_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."email_templates"
    ADD CONSTRAINT "email_templates_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."global_option_values"
    ADD CONSTRAINT "global_option_values_option_type_id_fkey" FOREIGN KEY ("option_type_id") REFERENCES "public"."global_option_types"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inventory_logs"
    ADD CONSTRAINT "inventory_logs_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id");



ALTER TABLE ONLY "public"."mailchimp_settings"
    ADD CONSTRAINT "mailchimp_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."mailchimp_sync_status"
    ADD CONSTRAINT "mailchimp_sync_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."media_library"
    ADD CONSTRAINT "media_library_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."media_usage"
    ADD CONSTRAINT "media_usage_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media_library"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id");



ALTER TABLE ONLY "public"."order_tags"
    ADD CONSTRAINT "order_tags_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_tags"
    ADD CONSTRAINT "order_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."shipstation_tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "public"."addresses"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."paypal_inventory"
    ADD CONSTRAINT "paypal_inventory_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."paypal_pricing_plans"
    ADD CONSTRAINT "paypal_pricing_plans_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_customer_groups"
    ADD CONSTRAINT "product_customer_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."customer_groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_customer_groups"
    ADD CONSTRAINT "product_customer_groups_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_option_assignments"
    ADD CONSTRAINT "product_option_assignments_option_type_id_fkey" FOREIGN KEY ("option_type_id") REFERENCES "public"."global_option_types"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_option_assignments"
    ADD CONSTRAINT "product_option_assignments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_option_pricing"
    ADD CONSTRAINT "product_option_pricing_option_value_id_fkey" FOREIGN KEY ("option_value_id") REFERENCES "public"."global_option_values"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_option_pricing"
    ADD CONSTRAINT "product_option_pricing_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_reviews"
    ADD CONSTRAINT "product_reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."product_reviews"
    ADD CONSTRAINT "product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_reviews"
    ADD CONSTRAINT "product_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."product_variants"
    ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id");



ALTER TABLE ONLY "public"."promotion_usage"
    ADD CONSTRAINT "promotion_usage_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."promotion_usage"
    ADD CONSTRAINT "promotion_usage_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."promotion_usage"
    ADD CONSTRAINT "promotion_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."promotions"
    ADD CONSTRAINT "promotions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."promotions"
    ADD CONSTRAINT "promotions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."shipping_notifications"
    ADD CONSTRAINT "shipping_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shipstation_automation_rules"
    ADD CONSTRAINT "shipstation_automation_rules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."shipstation_labels"
    ADD CONSTRAINT "shipstation_labels_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."shipstation_labels"
    ADD CONSTRAINT "shipstation_labels_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shipstation_sync_logs"
    ADD CONSTRAINT "shipstation_sync_logs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."shipstation_sync_logs"
    ADD CONSTRAINT "shipstation_sync_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sync_logs"
    ADD CONSTRAINT "sync_logs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."tax_settings"
    ADD CONSTRAINT "tax_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_customer_groups"
    ADD CONSTRAINT "user_customer_groups_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."user_customer_groups"
    ADD CONSTRAINT "user_customer_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."customer_groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_customer_groups"
    ADD CONSTRAINT "user_customer_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_referred_by_fkey" FOREIGN KEY ("referred_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "public"."loyalty_tiers"("id");



ALTER TABLE ONLY "public"."wishlist_items"
    ADD CONSTRAINT "wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."wishlist_items"
    ADD CONSTRAINT "wishlist_items_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "public"."wishlists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



CREATE POLICY "Active banners are viewable by everyone" ON "public"."banners" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Active brands are viewable by everyone" ON "public"."brands" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Admin can insert tax settings" ON "public"."tax_settings" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin can update tax settings" ON "public"."tax_settings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin can view all promotion usage" ON "public"."promotion_usage" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin can view tax settings" ON "public"."tax_settings" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin full access to automation rules" ON "public"."shipstation_automation_rules" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin full access to carriers" ON "public"."shipstation_carriers" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin full access to labels" ON "public"."shipstation_labels" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin full access to order tags" ON "public"."order_tags" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin full access to rates cache" ON "public"."shipping_rates_cache" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin full access to sync logs" ON "public"."shipstation_sync_logs" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin full access to tags" ON "public"."shipstation_tags" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin full access to warehouses" ON "public"."shipstation_warehouses" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin manage categories" ON "public"."categories" USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND "u"."is_admin"))));



CREATE POLICY "Admin manage discounts" ON "public"."discounts" USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND "u"."is_admin"))));



CREATE POLICY "Admin manage email log" ON "public"."email_log" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin manage email queue" ON "public"."email_queue" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin manage email settings" ON "public"."email_settings" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin manage product_categories" ON "public"."product_categories" USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND "u"."is_admin"))));



CREATE POLICY "Admin manage products" ON "public"."products" USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND "u"."is_admin"))));



CREATE POLICY "Admin manage templates" ON "public"."email_templates" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admin manage tiers" ON "public"."loyalty_tiers" USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND "u"."is_admin"))));



CREATE POLICY "Admin manage variants" ON "public"."product_variants" USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND "u"."is_admin"))));



CREATE POLICY "Admin users can manage promotions" ON "public"."promotions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can delete media" ON "public"."media_library" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage Mailchimp settings" ON "public"."mailchimp_settings" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage all banners" ON "public"."banners" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage all blog posts" ON "public"."blog_posts" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage all brands" ON "public"."brands" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage all settings" ON "public"."site_settings" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage category groups" ON "public"."category_customer_groups" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage customer groups" ON "public"."customer_groups" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage media usage" ON "public"."media_usage" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage product groups" ON "public"."product_customer_groups" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage sync status" ON "public"."mailchimp_sync_status" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can manage user groups" ON "public"."user_customer_groups" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Admins can view sync logs" ON "public"."mailchimp_sync_log" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Allow admin to manage carousel_settings" ON "public"."carousel_settings" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Allow admin to manage carousel_slides" ON "public"."carousel_slides" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Allow public read access to carousel_settings" ON "public"."carousel_settings" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to carousel_slides" ON "public"."carousel_slides" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can create analytics events" ON "public"."analytics_events" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can view active coupons" ON "public"."coupons" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view approved reviews" ON "public"."product_reviews" FOR SELECT USING (("status" = 'approved'::"text"));



CREATE POLICY "Anyone can view global option types" ON "public"."global_option_types" FOR SELECT USING (true);



CREATE POLICY "Anyone can view global option values" ON "public"."global_option_values" FOR SELECT USING (true);



CREATE POLICY "Anyone can view inventory" ON "public"."paypal_inventory" FOR SELECT USING (true);



CREATE POLICY "Anyone can view product option assignments" ON "public"."product_option_assignments" FOR SELECT USING (true);



CREATE POLICY "Anyone can view product option pricing" ON "public"."product_option_pricing" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can upload media" ON "public"."media_library" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "uploaded_by"));



CREATE POLICY "Menu items are editable by admins" ON "public"."menu_items" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Menu items are viewable by everyone" ON "public"."menu_items" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Menus are editable by admins" ON "public"."menus" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Menus are viewable by everyone" ON "public"."menus" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Only admins can manage coupons" ON "public"."coupons" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can manage global option types" ON "public"."global_option_types" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can manage global option values" ON "public"."global_option_values" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can manage inventory" ON "public"."paypal_inventory" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can manage product option assignments" ON "public"."product_option_assignments" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can manage product option pricing" ON "public"."product_option_pricing" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can manage sync logs" ON "public"."sync_logs" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can view PayPal webhooks" ON "public"."paypal_webhooks" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can view all coupon usage" ON "public"."coupon_usage" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only admins can view analytics" ON "public"."analytics_events" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Only system can insert coupon usage" ON "public"."coupon_usage" FOR INSERT WITH CHECK (true);



CREATE POLICY "Pages are editable by admins" ON "public"."pages" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Pages are viewable by everyone" ON "public"."pages" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can check if tax is enabled" ON "public"."tax_settings" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Public can view active promotions" ON "public"."promotions" FOR SELECT TO "authenticated" USING ((("is_active" = true) AND ("deleted_at" IS NULL) AND "public"."is_promotion_valid"("id")));



CREATE POLICY "Public can view media" ON "public"."media_library" FOR SELECT USING (true);



CREATE POLICY "Public can view media usage" ON "public"."media_usage" FOR SELECT USING (true);



CREATE POLICY "Public read active discounts" ON "public"."discounts" FOR SELECT USING ((("deleted_at" IS NULL) AND ("active" = true)));



CREATE POLICY "Public read active templates" ON "public"."email_templates" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public read active tiers" ON "public"."loyalty_tiers" FOR SELECT USING ((("deleted_at" IS NULL) AND ("is_active" = true)));



CREATE POLICY "Public read categories" ON "public"."categories" FOR SELECT USING (("deleted_at" IS NULL));



CREATE POLICY "Public read product_categories" ON "public"."product_categories" FOR SELECT USING (true);



CREATE POLICY "Public read products" ON "public"."products" FOR SELECT USING ((("deleted_at" IS NULL) AND ("is_visible" = true) AND ("status" = 'active'::"text")));



CREATE POLICY "Public read variants" ON "public"."product_variants" FOR SELECT USING ((("deleted_at" IS NULL) AND ("is_active" = true) AND (EXISTS ( SELECT 1
   FROM "public"."products" "p"
  WHERE (("p"."id" = "product_variants"."product_id") AND ("p"."deleted_at" IS NULL) AND ("p"."is_visible" = true) AND ("p"."status" = 'active'::"text"))))));



CREATE POLICY "Public settings are viewable by everyone" ON "public"."settings" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Public settings are viewable by everyone" ON "public"."site_settings" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Published blog posts are viewable by everyone" ON "public"."blog_posts" FOR SELECT USING ((("status" = 'published'::"text") AND ("published_at" <= "now"())));



CREATE POLICY "Settings are editable by admins" ON "public"."settings" USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))));



CREATE POLICY "Settings are viewable by authenticated users" ON "public"."settings" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Users can access their cart" ON "public"."carts" USING (((("user_id" IS NOT NULL) AND ("user_id" = "auth"."uid"())) OR (("session_id" IS NOT NULL) AND ("session_id" = "current_setting"('request.jwt.claim.session_id'::"text", true)))));



CREATE POLICY "Users can access their orders" ON "public"."orders" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can create orders" ON "public"."orders" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can create reviews" ON "public"."product_reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage self" ON "public"."users" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can manage their addresses" ON "public"."addresses" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their wishlists" ON "public"."wishlists" USING ((("user_id" = "auth"."uid"()) AND ("deleted_at" IS NULL)));



CREATE POLICY "Users can manage wishlist items" ON "public"."wishlist_items" USING ((EXISTS ( SELECT 1
   FROM "public"."wishlists" "w"
  WHERE (("w"."id" = "wishlist_items"."wishlist_id") AND ("w"."user_id" = "auth"."uid"()) AND ("w"."deleted_at" IS NULL)))));



CREATE POLICY "Users can modify their cart items" ON "public"."cart_items" USING ((EXISTS ( SELECT 1
   FROM "public"."carts" "c"
  WHERE (("c"."id" = "cart_items"."cart_id") AND (("c"."user_id" = "auth"."uid"()) OR ("c"."session_id" = "current_setting"('request.jwt.claim.session_id'::"text", true)))))));



CREATE POLICY "Users can update their own media" ON "public"."media_library" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "uploaded_by") OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true))))));



CREATE POLICY "Users can update their own reviews" ON "public"."product_reviews" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view gift cards sent to them" ON "public"."gift_cards" FOR SELECT USING ((("recipient_email" IN ( SELECT "users"."email"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) OR ("sender_email" IN ( SELECT "users"."email"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true))))));



CREATE POLICY "Users can view own promotion usage" ON "public"."promotion_usage" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view own sync status" ON "public"."mailchimp_sync_status" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their order items" ON "public"."order_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."orders" "o"
  WHERE (("o"."id" = "order_items"."order_id") AND ("o"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own coupon usage" ON "public"."coupon_usage" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own groups" ON "public"."user_customer_groups" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true))))));



CREATE POLICY "Users can view their own payments" ON "public"."payments" FOR SELECT USING ((("order_id" IN ( SELECT "orders"."id"
   FROM "public"."orders"
  WHERE ("orders"."user_id" = "auth"."uid"()))) OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true))))));



CREATE POLICY "Users manage own notifications" ON "public"."shipping_notifications" TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users view own email log" ON "public"."email_log" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true))))));



CREATE POLICY "View category group settings" ON "public"."category_customer_groups" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))) OR (EXISTS ( SELECT 1
   FROM "public"."user_customer_groups" "ucg"
  WHERE (("ucg"."group_id" = "category_customer_groups"."group_id") AND ("ucg"."user_id" = "auth"."uid"()) AND ("ucg"."approved_at" IS NOT NULL))))));



CREATE POLICY "View product group settings" ON "public"."product_customer_groups" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."is_admin" = true)))) OR (EXISTS ( SELECT 1
   FROM "public"."user_customer_groups" "ucg"
  WHERE (("ucg"."group_id" = "product_customer_groups"."group_id") AND ("ucg"."user_id" = "auth"."uid"()) AND ("ucg"."approved_at" IS NOT NULL))))));



ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."analytics_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."banners" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."brands" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."carousel_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."carousel_slides" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."carts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."category_customer_groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."coupon_usage" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."coupons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customer_groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."discounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."email_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."email_queue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."email_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."email_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gift_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."global_option_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."global_option_values" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."loyalty_tiers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mailchimp_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mailchimp_sync_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mailchimp_sync_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media_library" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media_usage" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."menu_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."menus" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."paypal_inventory" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."paypal_webhooks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_customer_groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_option_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_option_pricing" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_variants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."promotion_usage" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."promotions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipping_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipping_rates_cache" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipstation_automation_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipstation_carriers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipstation_labels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipstation_sync_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipstation_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipstation_warehouses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sync_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tax_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_customer_groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wishlist_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wishlists" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";































































































































































GRANT ALL ON FUNCTION "public"."calculate_promotion_discount"("promo_id" "uuid", "order_subtotal_cents" integer, "items" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_promotion_discount"("promo_id" "uuid", "order_subtotal_cents" integer, "items" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_promotion_discount"("promo_id" "uuid", "order_subtotal_cents" integer, "items" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_variant_price"("p_product_id" "uuid", "p_option_combination" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_variant_price"("p_product_id" "uuid", "p_option_combination" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_variant_price"("p_product_id" "uuid", "p_option_combination" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."decrement_media_usage"("media_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_media_usage"("media_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_media_usage"("media_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_user_tier_order"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_user_tier_order"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_user_tier_order"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_variant_sku"("p_product_slug" "text", "p_option_combination" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_variant_sku"("p_product_slug" "text", "p_option_combination" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_variant_sku"("p_product_slug" "text", "p_option_combination" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_featured_brands"("limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_featured_brands"("limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_featured_brands"("limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_featured_categories"("limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_featured_categories"("limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_featured_categories"("limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_featured_products"("limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_featured_products"("limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_featured_products"("limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_customer_groups"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_customer_groups"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_customer_groups"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_media_usage"("media_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_media_usage"("media_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_media_usage"("media_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_promotion_valid"("promo_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_promotion_valid"("promo_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_promotion_valid"("promo_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_product_for_sync"() TO "anon";
GRANT ALL ON FUNCTION "public"."mark_product_for_sync"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_product_for_sync"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_user_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_user_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_user_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."process_email_queue"() TO "anon";
GRANT ALL ON FUNCTION "public"."process_email_queue"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_email_queue"() TO "service_role";



GRANT ALL ON FUNCTION "public"."queue_email"("p_template" "text", "p_recipient" "text", "p_subject" "text", "p_data" "jsonb", "p_send_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."queue_email"("p_template" "text", "p_recipient" "text", "p_subject" "text", "p_data" "jsonb", "p_send_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."queue_email"("p_template" "text", "p_recipient" "text", "p_subject" "text", "p_data" "jsonb", "p_send_at" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_media"("search_term" "text", "folder_filter" "text", "mime_type_filter" "text", "tag_filter" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."search_media"("search_term" "text", "folder_filter" "text", "mime_type_filter" "text", "tag_filter" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_media"("search_term" "text", "folder_filter" "text", "mime_type_filter" "text", "tag_filter" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_order_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_order_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_order_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_shipstation_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_shipstation_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_shipstation_status"() TO "service_role";



GRANT ALL ON FUNCTION "public"."track_inventory_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."track_inventory_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."track_inventory_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."track_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."track_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."track_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."untrack_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."untrack_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."untrack_media_usage"("p_media_id" "uuid", "p_entity_type" "text", "p_entity_id" "text", "p_field_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_media_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_media_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_media_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_tax_settings_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_tax_settings_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_tax_settings_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."user_can_view_product"("user_id" "uuid", "product_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_can_view_product"("user_id" "uuid", "product_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_can_view_product"("user_id" "uuid", "product_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_in_customer_group"("user_id" "uuid", "group_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_in_customer_group"("user_id" "uuid", "group_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_in_customer_group"("user_id" "uuid", "group_id" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_events" TO "anon";
GRANT ALL ON TABLE "public"."analytics_events" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_events" TO "service_role";



GRANT ALL ON TABLE "public"."banners" TO "anon";
GRANT ALL ON TABLE "public"."banners" TO "authenticated";
GRANT ALL ON TABLE "public"."banners" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."brand_customer_groups" TO "anon";
GRANT ALL ON TABLE "public"."brand_customer_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."brand_customer_groups" TO "service_role";



GRANT ALL ON TABLE "public"."brands" TO "anon";
GRANT ALL ON TABLE "public"."brands" TO "authenticated";
GRANT ALL ON TABLE "public"."brands" TO "service_role";



GRANT ALL ON TABLE "public"."carousel_settings" TO "anon";
GRANT ALL ON TABLE "public"."carousel_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."carousel_settings" TO "service_role";



GRANT ALL ON TABLE "public"."carousel_slides" TO "anon";
GRANT ALL ON TABLE "public"."carousel_slides" TO "authenticated";
GRANT ALL ON TABLE "public"."carousel_slides" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."carts" TO "anon";
GRANT ALL ON TABLE "public"."carts" TO "authenticated";
GRANT ALL ON TABLE "public"."carts" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."category_customer_groups" TO "anon";
GRANT ALL ON TABLE "public"."category_customer_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."category_customer_groups" TO "service_role";



GRANT ALL ON TABLE "public"."coupon_analytics" TO "anon";
GRANT ALL ON TABLE "public"."coupon_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."coupon_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."coupon_usage" TO "anon";
GRANT ALL ON TABLE "public"."coupon_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."coupon_usage" TO "service_role";



GRANT ALL ON TABLE "public"."coupons" TO "anon";
GRANT ALL ON TABLE "public"."coupons" TO "authenticated";
GRANT ALL ON TABLE "public"."coupons" TO "service_role";



GRANT ALL ON TABLE "public"."customer_groups" TO "anon";
GRANT ALL ON TABLE "public"."customer_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_groups" TO "service_role";



GRANT ALL ON TABLE "public"."customer_sessions" TO "anon";
GRANT ALL ON TABLE "public"."customer_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."discounts" TO "anon";
GRANT ALL ON TABLE "public"."discounts" TO "authenticated";
GRANT ALL ON TABLE "public"."discounts" TO "service_role";



GRANT ALL ON TABLE "public"."email_log" TO "anon";
GRANT ALL ON TABLE "public"."email_log" TO "authenticated";
GRANT ALL ON TABLE "public"."email_log" TO "service_role";



GRANT ALL ON TABLE "public"."email_queue" TO "anon";
GRANT ALL ON TABLE "public"."email_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."email_queue" TO "service_role";



GRANT ALL ON TABLE "public"."email_settings" TO "anon";
GRANT ALL ON TABLE "public"."email_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."email_settings" TO "service_role";



GRANT ALL ON TABLE "public"."email_templates" TO "anon";
GRANT ALL ON TABLE "public"."email_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."email_templates" TO "service_role";



GRANT ALL ON TABLE "public"."gift_cards" TO "anon";
GRANT ALL ON TABLE "public"."gift_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."gift_cards" TO "service_role";



GRANT ALL ON TABLE "public"."global_option_types" TO "anon";
GRANT ALL ON TABLE "public"."global_option_types" TO "authenticated";
GRANT ALL ON TABLE "public"."global_option_types" TO "service_role";



GRANT ALL ON TABLE "public"."global_option_values" TO "anon";
GRANT ALL ON TABLE "public"."global_option_values" TO "authenticated";
GRANT ALL ON TABLE "public"."global_option_values" TO "service_role";



GRANT ALL ON TABLE "public"."inventory_logs" TO "anon";
GRANT ALL ON TABLE "public"."inventory_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_logs" TO "service_role";



GRANT ALL ON TABLE "public"."loyalty_tiers" TO "anon";
GRANT ALL ON TABLE "public"."loyalty_tiers" TO "authenticated";
GRANT ALL ON TABLE "public"."loyalty_tiers" TO "service_role";



GRANT ALL ON TABLE "public"."mailchimp_settings" TO "anon";
GRANT ALL ON TABLE "public"."mailchimp_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."mailchimp_settings" TO "service_role";



GRANT ALL ON TABLE "public"."mailchimp_sync_log" TO "anon";
GRANT ALL ON TABLE "public"."mailchimp_sync_log" TO "authenticated";
GRANT ALL ON TABLE "public"."mailchimp_sync_log" TO "service_role";



GRANT ALL ON TABLE "public"."mailchimp_sync_status" TO "anon";
GRANT ALL ON TABLE "public"."mailchimp_sync_status" TO "authenticated";
GRANT ALL ON TABLE "public"."mailchimp_sync_status" TO "service_role";



GRANT ALL ON TABLE "public"."media_library" TO "anon";
GRANT ALL ON TABLE "public"."media_library" TO "authenticated";
GRANT ALL ON TABLE "public"."media_library" TO "service_role";



GRANT ALL ON TABLE "public"."media_usage" TO "anon";
GRANT ALL ON TABLE "public"."media_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."media_usage" TO "service_role";



GRANT ALL ON TABLE "public"."menu_items" TO "anon";
GRANT ALL ON TABLE "public"."menu_items" TO "authenticated";
GRANT ALL ON TABLE "public"."menu_items" TO "service_role";



GRANT ALL ON TABLE "public"."menus" TO "anon";
GRANT ALL ON TABLE "public"."menus" TO "authenticated";
GRANT ALL ON TABLE "public"."menus" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."order_tags" TO "anon";
GRANT ALL ON TABLE "public"."order_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."order_tags" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."pages" TO "anon";
GRANT ALL ON TABLE "public"."pages" TO "authenticated";
GRANT ALL ON TABLE "public"."pages" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."paypal_inventory" TO "anon";
GRANT ALL ON TABLE "public"."paypal_inventory" TO "authenticated";
GRANT ALL ON TABLE "public"."paypal_inventory" TO "service_role";



GRANT ALL ON TABLE "public"."paypal_pricing_plans" TO "anon";
GRANT ALL ON TABLE "public"."paypal_pricing_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."paypal_pricing_plans" TO "service_role";



GRANT ALL ON TABLE "public"."paypal_webhooks" TO "anon";
GRANT ALL ON TABLE "public"."paypal_webhooks" TO "authenticated";
GRANT ALL ON TABLE "public"."paypal_webhooks" TO "service_role";



GRANT ALL ON TABLE "public"."product_categories" TO "anon";
GRANT ALL ON TABLE "public"."product_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."product_categories" TO "service_role";



GRANT ALL ON TABLE "public"."product_customer_groups" TO "anon";
GRANT ALL ON TABLE "public"."product_customer_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."product_customer_groups" TO "service_role";



GRANT ALL ON TABLE "public"."product_option_assignments" TO "anon";
GRANT ALL ON TABLE "public"."product_option_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."product_option_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."product_option_pricing" TO "anon";
GRANT ALL ON TABLE "public"."product_option_pricing" TO "authenticated";
GRANT ALL ON TABLE "public"."product_option_pricing" TO "service_role";



GRANT ALL ON TABLE "public"."product_reviews" TO "anon";
GRANT ALL ON TABLE "public"."product_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."product_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."product_variants" TO "anon";
GRANT ALL ON TABLE "public"."product_variants" TO "authenticated";
GRANT ALL ON TABLE "public"."product_variants" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."promotion_usage" TO "anon";
GRANT ALL ON TABLE "public"."promotion_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."promotion_usage" TO "service_role";



GRANT ALL ON TABLE "public"."promotions" TO "anon";
GRANT ALL ON TABLE "public"."promotions" TO "authenticated";
GRANT ALL ON TABLE "public"."promotions" TO "service_role";





GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";



GRANT ALL ON TABLE "public"."shipping_notifications" TO "anon";
GRANT ALL ON TABLE "public"."shipping_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."shipping_notifications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shipping_notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shipping_notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shipping_notifications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shipping_rates_cache" TO "anon";
GRANT ALL ON TABLE "public"."shipping_rates_cache" TO "authenticated";
GRANT ALL ON TABLE "public"."shipping_rates_cache" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shipping_rates_cache_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shipping_rates_cache_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shipping_rates_cache_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shipstation_automation_rules" TO "anon";
GRANT ALL ON TABLE "public"."shipstation_automation_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."shipstation_automation_rules" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shipstation_automation_rules_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shipstation_automation_rules_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shipstation_automation_rules_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shipstation_carriers" TO "anon";
GRANT ALL ON TABLE "public"."shipstation_carriers" TO "authenticated";
GRANT ALL ON TABLE "public"."shipstation_carriers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shipstation_carriers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shipstation_carriers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shipstation_carriers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shipstation_labels" TO "anon";
GRANT ALL ON TABLE "public"."shipstation_labels" TO "authenticated";
GRANT ALL ON TABLE "public"."shipstation_labels" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shipstation_labels_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shipstation_labels_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shipstation_labels_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shipstation_sync_logs" TO "anon";
GRANT ALL ON TABLE "public"."shipstation_sync_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."shipstation_sync_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shipstation_sync_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shipstation_sync_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shipstation_sync_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shipstation_tags" TO "anon";
GRANT ALL ON TABLE "public"."shipstation_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."shipstation_tags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shipstation_tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shipstation_tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shipstation_tags_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shipstation_warehouses" TO "anon";
GRANT ALL ON TABLE "public"."shipstation_warehouses" TO "authenticated";
GRANT ALL ON TABLE "public"."shipstation_warehouses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shipstation_warehouses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shipstation_warehouses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shipstation_warehouses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."site_settings" TO "anon";
GRANT ALL ON TABLE "public"."site_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."site_settings" TO "service_role";



GRANT ALL ON TABLE "public"."sync_logs" TO "anon";
GRANT ALL ON TABLE "public"."sync_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."sync_logs" TO "service_role";



GRANT ALL ON TABLE "public"."tax_settings" TO "anon";
GRANT ALL ON TABLE "public"."tax_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."tax_settings" TO "service_role";



GRANT ALL ON TABLE "public"."user_customer_groups" TO "anon";
GRANT ALL ON TABLE "public"."user_customer_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."user_customer_groups" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."v_is_admin" TO "anon";
GRANT ALL ON TABLE "public"."v_is_admin" TO "authenticated";
GRANT ALL ON TABLE "public"."v_is_admin" TO "service_role";



GRANT ALL ON TABLE "public"."webhook_events" TO "anon";
GRANT ALL ON TABLE "public"."webhook_events" TO "authenticated";
GRANT ALL ON TABLE "public"."webhook_events" TO "service_role";



GRANT ALL ON TABLE "public"."wishlist_items" TO "anon";
GRANT ALL ON TABLE "public"."wishlist_items" TO "authenticated";
GRANT ALL ON TABLE "public"."wishlist_items" TO "service_role";



GRANT ALL ON TABLE "public"."wishlists" TO "anon";
GRANT ALL ON TABLE "public"."wishlists" TO "authenticated";
GRANT ALL ON TABLE "public"."wishlists" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



























-- Main raffles table
CREATE TABLE IF NOT EXISTS "public"."raffles" (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    rules_text TEXT,
    
    -- Linked product
    product_id INTEGER REFERENCES "public"."products"(id) ON DELETE SET NULL,
    
    -- Raffle configuration
    max_entries_per_user INTEGER DEFAULT 1,
    total_winners INTEGER NOT NULL DEFAULT 1,
    
    -- Timing
    registration_starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    registration_ends_at TIMESTAMPTZ NOT NULL,
    draw_date TIMESTAMPTZ,
    
    -- Winner purchase window
    purchase_window_hours INTEGER DEFAULT 48,
    purchase_deadline TIMESTAMPTZ,
    
    -- Status
    status TEXT CHECK (status IN ('draft', 'upcoming', 'open', 'closed', 'drawing', 'drawn', 'completed', 'cancelled')) DEFAULT 'draft',
    
    -- Drawing state
    drawing_started_at TIMESTAMPTZ,
    drawing_completed_at TIMESTAMPTZ,
    drawing_started_by UUID REFERENCES "public"."users"(id),
    
    -- Display
    hero_image_url TEXT,
    thumbnail_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    
    -- Anti-fraud
    require_email_verification BOOLEAN DEFAULT true,
    require_previous_purchase BOOLEAN DEFAULT false,
    min_account_age_days INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES "public"."users"(id)
);

-- Create indexes for raffles table
CREATE INDEX IF NOT EXISTS idx_raffles_status ON "public"."raffles"(status);
CREATE INDEX IF NOT EXISTS idx_raffles_slug ON "public"."raffles"(slug);
CREATE INDEX IF NOT EXISTS idx_raffles_product ON "public"."raffles"(product_id);
CREATE INDEX IF NOT EXISTS idx_raffles_dates ON "public"."raffles"(registration_starts_at, registration_ends_at);

-- Raffle entries
CREATE TABLE IF NOT EXISTS "public"."raffle_entries" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raffle_id INTEGER NOT NULL REFERENCES "public"."raffles"(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES "public"."users"(id) ON DELETE CASCADE,
    
    -- Entry details
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    
    -- Anti-fraud tracking
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    
    -- Status
    status TEXT CHECK (status IN ('pending', 'confirmed', 'winner', 'purchased', 'expired', 'disqualified')) DEFAULT 'pending',
    
    -- Winner info
    selected_at TIMESTAMPTZ,
    selection_order INTEGER,
    purchase_deadline TIMESTAMPTZ,
    
    -- Purchase tracking
    purchased_at TIMESTAMPTZ,
    order_id UUID REFERENCES "public"."orders"(id),
    
    -- Email tracking
    confirmation_sent_at TIMESTAMPTZ,
    winner_notification_sent_at TIMESTAMPTZ,
    reminder_sent_at TIMESTAMPTZ,
    
    -- Metadata
    entered_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    
    -- Prevent duplicate entries
    UNIQUE(raffle_id, user_id),
    UNIQUE(raffle_id, email)
);

-- Create indexes for raffle_entries table
CREATE INDEX IF NOT EXISTS idx_raffle_entries_raffle ON "public"."raffle_entries"(raffle_id);
CREATE INDEX IF NOT EXISTS idx_raffle_entries_user ON "public"."raffle_entries"(user_id);
CREATE INDEX IF NOT EXISTS idx_raffle_entries_status ON "public"."raffle_entries"(status);
CREATE INDEX IF NOT EXISTS idx_raffle_entries_winner ON "public"."raffle_entries"(raffle_id, status) WHERE status = 'winner';

-- Raffle winners (denormalized for performance)
CREATE TABLE IF NOT EXISTS "public"."raffle_winners" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raffle_id INTEGER NOT NULL REFERENCES "public"."raffles"(id) ON DELETE CASCADE,
    entry_id UUID NOT NULL REFERENCES "public"."raffle_entries"(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES "public"."users"(id),
    
    -- Winner info
    email TEXT NOT NULL,
    full_name TEXT,
    selection_order INTEGER NOT NULL,
    
    -- Purchase tracking
    purchase_status TEXT CHECK (purchase_status IN ('pending', 'purchased', 'expired', 'forfeited')) DEFAULT 'pending',
    purchase_deadline TIMESTAMPTZ NOT NULL,
    purchased_at TIMESTAMPTZ,
    order_id UUID REFERENCES "public"."orders"(id),
    
    -- Streaming/display
    revealed_at TIMESTAMPTZ,
    
    -- Metadata
    selected_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraints
    UNIQUE(raffle_id, entry_id),
    UNIQUE(raffle_id, selection_order)
);

-- Create indexes for raffle_winners table
CREATE INDEX IF NOT EXISTS idx_raffle_winners_raffle ON "public"."raffle_winners"(raffle_id);
CREATE INDEX IF NOT EXISTS idx_raffle_winners_status ON "public"."raffle_winners"(purchase_status);
CREATE INDEX IF NOT EXISTS idx_raffle_winners_deadline ON "public"."raffle_winners"(purchase_deadline);

-- Real-time streaming of winner selection
CREATE TABLE IF NOT EXISTS "public"."raffle_drawing_stream" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raffle_id INTEGER NOT NULL REFERENCES "public"."raffles"(id) ON DELETE CASCADE,
    
    -- Stream event
    event_type TEXT CHECK (event_type IN ('started', 'winner_selected', 'paused', 'resumed', 'completed', 'error')),
    event_data JSONB,
    
    -- For winner_selected events
    winner_email TEXT,
    winner_name TEXT,
    selection_order INTEGER,
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for raffle_drawing_stream table
CREATE INDEX IF NOT EXISTS idx_drawing_stream_raffle ON "public"."raffle_drawing_stream"(raffle_id, created_at DESC);

-- ======================================
-- 🔒 RLS Policies for Raffles
-- ======================================

ALTER TABLE "public"."raffles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."raffle_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."raffle_winners" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."raffle_drawing_stream" ENABLE ROW LEVEL SECURITY;

-- Raffles: Public read active, admin manage
CREATE POLICY "Public read active raffles" ON "public"."raffles"
    FOR SELECT USING (status NOT IN ('draft', 'cancelled'));

CREATE POLICY "Admin manage raffles" ON "public"."raffles"
    FOR ALL USING (
        EXISTS (SELECT 1 FROM "public"."users" WHERE id = auth.uid() AND is_admin = true)
    );

-- Entries: Users see own, admin see all
CREATE POLICY "Users see own entries" ON "public"."raffle_entries"
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM "public"."users" WHERE id = auth.uid() AND is_admin = true)
    );

CREATE POLICY "Users can enter raffles" ON "public"."raffle_entries"
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM "public"."raffles" 
            WHERE id = "public"."raffle_entries".raffle_id 
            AND status = 'open'
            AND NOW() BETWEEN registration_starts_at AND registration_ends_at
        )
    );

CREATE POLICY "Admin manage entries" ON "public"."raffle_entries"
    FOR ALL USING (
        EXISTS (SELECT 1 FROM "public"."users" WHERE id = auth.uid() AND is_admin = true)
    );

-- Winners: Public read, admin manage
CREATE POLICY "Public read winners" ON "public"."raffle_winners"
    FOR SELECT USING (true);

CREATE POLICY "Admin manage winners" ON "public"."raffle_winners"
    FOR ALL USING (
        EXISTS (SELECT 1 FROM "public"."users" WHERE id = auth.uid() AND is_admin = true)
    );

-- Stream: Public read, admin write
CREATE POLICY "Public read stream" ON "public"."raffle_drawing_stream"
    FOR SELECT USING (true);

CREATE POLICY "Admin write stream" ON "public"."raffle_drawing_stream"
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM "public"."users" WHERE id = auth.uid() AND is_admin = true)
    );

-- ======================================
-- 📝 Comments
-- ======================================

COMMENT ON TABLE "public"."raffles" IS 'Product purchase raffles for limited releases';
COMMENT ON TABLE "public"."raffle_entries" IS 'User entries for raffles';
COMMENT ON TABLE "public"."raffle_winners" IS 'Selected raffle winners with purchase tracking';
COMMENT ON TABLE "public"."raffle_drawing_stream" IS 'Real-time events for live winner selection';

RESET ALL;

--
-- Dumped schema changes for auth and storage
--

