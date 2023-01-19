import { Inject, Service } from "typedi";
import { KoaMiddlewareInterface, Middleware } from "routing-controllers";

import { Context } from "koa";
import { RedisService } from "@src/services/redis.service";
import { Session } from "@shopify/shopify-api";
import { ShopifyAuthService } from "@src/services";
import logger from "@src/helper/logger";
import shopifyConfig from "@src/config/shopify";

@Middleware({ type: "before" })
@Service()
class validatorAuthenticatedSession implements KoaMiddlewareInterface {
  @Inject()
  private redisServer: RedisService

  @Inject()
  private shopifyAuth: ShopifyAuthService

  async use(ctx: Context, next: (err?: any) => Promise<any>): Promise<void> {
    const { state, request, response } = ctx;
    try {
      const sessionId = await shopifyConfig.session.getCurrentId({
        isOnline: true,
        rawRequest: request,
        rawResponse: response,
      });
      if (sessionId) {
        // get session in the session storage;
        let session: Session | undefined;
        const shop = request.query.shop ?? session.shop!;
        if (session) {
        } else {

        }
      } else {
        logger.error("get sessionId fail");
        return ctx.throw(500, "AuthenticatedSession fail");
      }
    } catch (error) {
      logger.error(`Error when loading session from storage: ${error}`);
    }

    // return next();
    return;
  }
}

export { validatorAuthenticatedSession };
