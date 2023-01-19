import { Controller, Get, Ctx, Req, Res } from "routing-controllers";
import { Response, Request, Context } from 'koa';
import { AuthBeginServiceParams, ShopifyAuthService } from '@src/services/shopifyAuth.service'
import { Inject, Service } from "typedi";


@Controller()
export class ShopifyAuthController {
  @Inject()
  ShopifyAuthService: ShopifyAuthService

  @Get('/auth')
  begin(@Ctx() ctx: Context) {
    return this.ShopifyAuthService.authBegin(ctx);
  }

  @Get('/auth/callback')
  authCallback() {

  }
}