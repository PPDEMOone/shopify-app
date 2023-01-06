import { BeginParams } from "@shopify/shopify-api";
import { Service } from "typedi";
import shopifyConfig from '@src/config/shopify'

@Service()
export class ShopifyService {

  // auto redirect
  async beginAuth(beginParams:BeginParams) {
    const { shop } = beginParams;
    if( !shop ){
      throw new Error('No shop provided')
    }

    await shopifyConfig.auth.begin(beginParams)

  }

  //
  async authCallback() {
    
  }   
}
