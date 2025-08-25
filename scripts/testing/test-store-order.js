#!/usr/bin/env node

/**
 * Test ShipStation Order Creation with Store ID
 * Run: node test-store-order.js
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.SHIPSTATION_API_KEY_V1;
const API_SECRET = process.env.SHIPSTATION_API_SECRET_V1;
const STORE_ID = process.env.SHIPSTATION_STORE_ID;

if (!API_KEY || !API_SECRET) {
  console.error('❌ Missing ShipStation V1 credentials');
  process.exit(1);
}

console.log('🔑 Using ShipStation V1 credentials');
console.log(`🏪 Store ID: ${STORE_ID || 'Not configured (will use default)'}`);

const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

// Test order with store ID
const testOrder = {
  orderNumber: `STORE-TEST-${Date.now()}`,
  orderKey: `store_test_${Date.now()}`,
  orderDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
  orderStatus: 'awaiting_shipment',
  customerEmail: 'test@toynami.com',
  billTo: {
    name: 'Store Test Customer',
    street1: '123 Test Street',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'US',
    phone: '555-555-5555'
  },
  shipTo: {
    name: 'Store Test Customer',
    street1: '123 Test Street',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'US',
    phone: '555-555-5555'
  },
  items: [{
    lineItemKey: 'test_item_1',
    sku: 'STORE-TEST-001',
    name: 'Store Config Test Product',
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
  paymentMethod: 'PayPal',
  internalNotes: `⚠️ TEST ORDER - Testing Store ID: ${STORE_ID || 'default'}`,
  advancedOptions: {
    storeId: STORE_ID ? parseInt(STORE_ID) : undefined,
    customField1: 'Toynami PayPal Shop',
    customField2: `STORE-TEST-${Date.now()}`
  }
};

console.log('\n📦 Creating test order with store configuration...');
console.log(`   Order Number: ${testOrder.orderNumber}`);
if (testOrder.advancedOptions.storeId) {
  console.log(`   Target Store ID: ${testOrder.advancedOptions.storeId}`);
}

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
  
  const rateLimit = response.headers.get('X-Rate-Limit-Remaining');
  if (rateLimit) {
    console.log(`   Rate Limit Remaining: ${rateLimit}`);
  }
  
  return response.json();
})
.then(data => {
  if (data.orderId) {
    console.log('\n✅ SUCCESS! Order created in ShipStation');
    console.log(`   Order ID: ${data.orderId}`);
    console.log(`   Order Number: ${data.orderNumber}`);
    
    // Now verify which store it was created in
    console.log('\n🔍 Verifying store assignment...');
    
    return fetch(`https://ssapi.shipstation.com/orders/${data.orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    })
    .then(r => r.json())
    .then(order => {
      if (order.advancedOptions && order.advancedOptions.storeId) {
        console.log(`   ✅ Order created in Store ID: ${order.advancedOptions.storeId}`);
        if (STORE_ID && order.advancedOptions.storeId == STORE_ID) {
          console.log('   ✅ Correct store! Configuration working properly.');
        } else {
          console.log(`   ⚠️ Expected Store ID ${STORE_ID}, got ${order.advancedOptions.storeId}`);
        }
      } else {
        console.log('   ℹ️ Store ID not visible in order details');
        console.log('   (Order may still be in correct store)');
      }
      
      console.log('\n📝 IMPORTANT: Check ShipStation dashboard to verify:');
      console.log(`   1. Login to ShipStation`);
      console.log(`   2. Check "Manual Orders" store (ID: 168382)`);
      console.log(`   3. Look for order: ${testOrder.orderNumber}`);
      console.log(`   4. Delete the test order when done`);
    });
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
});