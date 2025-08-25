#!/usr/bin/env node

/**
 * Test ShipStation V1 API Order Creation
 * Run: node test-shipstation.js
 * 
 * This will create a test order in ShipStation using your V1 credentials.
 * The order will have a TEST- prefix so you can easily identify and delete it.
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.SHIPSTATION_API_KEY_V1;
const API_SECRET = process.env.SHIPSTATION_API_SECRET_V1;

if (!API_KEY || !API_SECRET) {
  console.error('❌ Missing ShipStation V1 credentials in .env.local');
  console.error('   Required: SHIPSTATION_API_KEY_V1 and SHIPSTATION_API_SECRET_V1');
  process.exit(1);
}

console.log('🔑 Using ShipStation V1 credentials from .env.local');
console.log(`   API Key: ${API_KEY.substring(0, 8)}...`);

// Create auth header
const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

// Test order data
const testOrder = {
  orderNumber: `TEST-${Date.now()}`,
  orderKey: `test_${Date.now()}`,
  orderDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
  orderStatus: 'awaiting_shipment',
  customerEmail: 'test@example.com',
  billTo: {
    name: 'Test Customer',
    street1: '123 Test Street',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'US',
    phone: '555-555-5555'
  },
  shipTo: {
    name: 'Test Customer',
    street1: '123 Test Street',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'US',
    phone: '555-555-5555'
  },
  items: [{
    lineItemKey: 'test_item_1',
    sku: 'TEST-SKU-001',
    name: 'Test Product (DELETE ME)',
    quantity: 1,
    unitPrice: 10.00,
    weight: {
      value: 1.0,
      units: 'pounds'
    }
  }],
  amountPaid: 15.50,
  taxAmount: 0.50,
  shippingAmount: 5.00,
  paymentMethod: 'Test Payment',
  internalNotes: '⚠️ TEST ORDER - SAFE TO DELETE ⚠️'
};

console.log('\n📦 Creating test order:', testOrder.orderNumber);

// Make API request
fetch('https://ssapi.shipstation.com/orders/createorder', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testOrder)
})
.then(response => {
  console.log(`\n📊 Response Status: ${response.status} ${response.statusText}`);
  
  // Check rate limit headers
  const rateLimit = response.headers.get('X-Rate-Limit-Limit');
  const rateLimitRemaining = response.headers.get('X-Rate-Limit-Remaining');
  const rateLimitReset = response.headers.get('X-Rate-Limit-Reset');
  
  if (rateLimit) {
    console.log(`   Rate Limit: ${rateLimitRemaining}/${rateLimit}`);
    if (rateLimitReset) {
      const resetDate = new Date(parseInt(rateLimitReset) * 1000);
      console.log(`   Reset Time: ${resetDate.toLocaleTimeString()}`);
    }
  }
  
  return response.json();
})
.then(data => {
  if (data.orderId) {
    console.log('\n✅ SUCCESS! Test order created in ShipStation');
    console.log(`   Order ID: ${data.orderId}`);
    console.log(`   Order Number: ${data.orderNumber}`);
    console.log(`   Order Key: ${data.orderKey}`);
    console.log('\n📌 IMPORTANT: This is a TEST order. You should:');
    console.log('   1. Login to ShipStation to verify the order appears');
    console.log('   2. Cancel/delete this test order when done testing');
    console.log(`   3. Look for order number: ${testOrder.orderNumber}`);
  } else if (data.ExceptionMessage) {
    console.error('\n❌ API Error:', data.ExceptionMessage);
    if (data.ValidationErrors) {
      console.error('   Validation Errors:', data.ValidationErrors);
    }
  } else {
    console.log('\n⚠️ Unexpected response:', JSON.stringify(data, null, 2));
  }
})
.catch(error => {
  console.error('\n❌ Request failed:', error.message);
  console.error('   This could mean:');
  console.error('   - Invalid API credentials');
  console.error('   - Network/connection issues');
  console.error('   - ShipStation API is down');
});