import '@shopify/shopify-api/adapters/node';

import {
  ConfigInterface,
  LATEST_API_VERSION,
  LogSeverity,
  Shopify,
  shopifyApi,
} from '@shopify/shopify-api';

const shopifyConfig = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: [""],
  hostName: process.env.HOST,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true
})

export default shopifyConfig