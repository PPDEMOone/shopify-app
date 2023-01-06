import { Inject, Service } from "typedi";

import type { BeginParams } from "@shopify/shopify-api";
import { Context } from "koa";
import { ShopifyService } from './shopify.service'
import shopify from '@src/config/shopify'

export interface AuthBeginServiceParams extends BeginParams {}

@Service()
export class ShopifyAuthService {
  @Inject()
  private shopifyConfigService:ShopifyService

  async begin(ctx:Context) {
    const shopDomain = ctx.request.query.shop ?? "";

    const beginParams: AuthBeginServiceParams = {
      shop: shopify.utils.sanitizeShop(shopDomain as string, true),
      callbackPath:'/auth/callback',
      isOnline:false,
      rawRequest: ctx.request,
      rawResponse: ctx.response
    }

    try {
      await this.shopifyConfigService.beginAuth(beginParams); 
    } catch (error) {
      ctx.throw(500, error)      
    }
  }

  async authCallback() {
      
  }
}
