-- Add ShipStation tracking fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipstation_shipment_id TEXT,
ADD COLUMN IF NOT EXISTS shipstation_order_id TEXT,
ADD COLUMN IF NOT EXISTS shipping_carrier TEXT,
ADD COLUMN IF NOT EXISTS shipping_service TEXT,
ADD COLUMN IF NOT EXISTS shipping_service_code TEXT,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS label_created_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;

-- Add index for ShipStation IDs
CREATE INDEX IF NOT EXISTS idx_orders_shipstation_shipment_id ON orders(shipstation_shipment_id);
CREATE INDEX IF NOT EXISTS idx_orders_shipstation_order_id ON orders(shipstation_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- Add comment
COMMENT ON COLUMN orders.shipstation_shipment_id IS 'ShipStation V2 shipment ID for label creation';
COMMENT ON COLUMN orders.shipstation_order_id IS 'ShipStation order ID if using order management';
COMMENT ON COLUMN orders.shipping_carrier IS 'Carrier name (e.g., USPS, FedEx)';
COMMENT ON COLUMN orders.shipping_service IS 'Service name (e.g., Priority Mail)';
COMMENT ON COLUMN orders.shipping_service_code IS 'Service code for API calls';
COMMENT ON COLUMN orders.tracking_number IS 'Tracking number once shipped';
COMMENT ON COLUMN orders.label_created_at IS 'When shipping label was created';
COMMENT ON COLUMN orders.shipped_at IS 'When order was actually shipped';