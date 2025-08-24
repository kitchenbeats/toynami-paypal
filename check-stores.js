#!/usr/bin/env node

/**
 * Check ShipStation Stores
 * Run: node check-stores.js
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.SHIPSTATION_API_KEY_V1;
const API_SECRET = process.env.SHIPSTATION_API_SECRET_V1;

if (!API_KEY || !API_SECRET) {
  console.error('❌ Missing ShipStation V1 credentials');
  process.exit(1);
}

const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

console.log('🔍 Fetching ShipStation stores...\n');

// Fetch stores
fetch('https://ssapi.shipstation.com/stores', {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log(`Status: ${response.status}`);
  const rateLimit = response.headers.get('X-Rate-Limit-Remaining');
  if (rateLimit) {
    console.log(`Rate Limit Remaining: ${rateLimit}\n`);
  }
  return response.json();
})
.then(stores => {
  if (Array.isArray(stores)) {
    console.log(`Found ${stores.length} store(s):\n`);
    
    stores.forEach((store, index) => {
      console.log(`Store ${index + 1}:`);
      console.log(`  ID: ${store.storeId}`);
      console.log(`  Name: ${store.storeName}`);
      console.log(`  Marketplace: ${store.marketplaceName}`);
      console.log(`  Account: ${store.accountName || 'N/A'}`);
      console.log(`  Active: ${store.active ? '✅' : '❌'}`);
      console.log(`  Company: ${store.companyName || 'N/A'}`);
      console.log(`  Website: ${store.website || 'N/A'}`);
      console.log(`  Created: ${store.createDate}`);
      console.log('');
    });
    
    // Check if store ID is configured
    const configuredStoreId = process.env.SHIPSTATION_STORE_ID;
    if (configuredStoreId) {
      console.log(`✅ Configured Store ID: ${configuredStoreId}`);
      const configuredStore = stores.find(s => s.storeId == configuredStoreId);
      if (configuredStore) {
        console.log(`   Using: ${configuredStore.storeName}`);
      } else {
        console.log(`   ⚠️ WARNING: Store ID ${configuredStoreId} not found in your stores!`);
      }
    } else {
      console.log('⚠️ No SHIPSTATION_STORE_ID configured in .env.local');
      console.log('   Orders will be created in your default store');
      console.log('\n📝 To specify a store, add to .env.local:');
      console.log(`   SHIPSTATION_STORE_ID=${stores[0]?.storeId || 'YOUR_STORE_ID'}`);
    }
  } else if (stores.ExceptionMessage) {
    console.error('❌ API Error:', stores.ExceptionMessage);
  } else {
    console.log('Response:', JSON.stringify(stores, null, 2));
  }
})
.catch(error => {
  console.error('❌ Request failed:', error.message);
});