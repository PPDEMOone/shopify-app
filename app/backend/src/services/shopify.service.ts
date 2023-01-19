import { BeginParams, GraphqlQueryError, Session } from "@shopify/shopify-api";

import { Context } from "koa";
import { RedisService } from "./redis.service";
import { RequestReturn } from "@shopify/shopify-api/lib/clients/http_client/types";
import { Service } from "typedi";
import logger from "@src/helper/logger";
import shopifyConfig from "@src/config/shopify";

enum MethodsEnum {
  GET,
  POST,
  DELETE,
  PUT,
}
interface UseShopifyCLientFetchOptions {
  data: string | Record<string, unknown>;
  method: Lowercase<Methods> | Methods;
  query?: { [key: string]: string | number };
  extraHeaders?: { [key: string]: string | number };
  tries?: number;
  type?: string;
}

type Methods = keyof typeof MethodsEnum;
type ShopifyGraphqlParams = {
  query: string;
  variable?: Record<string, any>;
};
const PROXY = "proxy" as const;
type clientFetchKey = ShopifyGraphqlParams | String | typeof PROXY;
type ClientFetchOptions<T> = T extends ShopifyGraphqlParams
  ? Omit<UseShopifyCLientFetchOptions, "query" | "method">
  : T extends typeof PROXY
  ? undefined
  : UseShopifyCLientFetchOptions;

@Service()
export class ShopifyService {
  constructor(private redisServer: RedisService) { }
  // auto redirect
  public async beginAuth<T extends BeginParams>(beginParams: T) {
    const { shop } = beginParams;
    if (!shop) {
      throw new Error("No shop provided");
    }
    await shopifyConfig.auth.begin(beginParams);
  }
  //
  public async authCallback<T extends Context>(ctx: T) {
    const { request, response } = ctx;

    try {
      const { session } = await shopifyConfig.auth.callback<Session>({
        // isOnline has config variable
        isOnline: false,
        rawRequest: request,
        rawResponse: response,
      });
      const { id, isOnline } = session;
      // cache storage       
      this.redisServer.set(id, session);

      if (!isOnline) {
        // register webhook
      }
    } catch (error) {

    }
  }

  public async getRedirectAppUrl<T extends Context>(ctx: T) {
    const { response, request } = ctx;
    // when set headerSent
    if (response.headerSent) {
      return logger.warn(
        "Response headers have already been sent, skipping redirection to host"
      );
    }

    const redirectUrl = ShopifyService.isEmbeddedApp()
      ? shopifyConfig.auth.getEmbeddedAppUrl({
        rawRequest: request,
        rawResponse: response,
      })
      : "";

    logger.info(`redirectUrl is ${redirectUrl}`);

    return redirectUrl;
  }

  public createShopifyCLientFetch<T extends Context>(ctx: T) {
    const { state, request } = ctx;
    const { session } = state;

    // function useClientFetch<
    //   R = unknown,
    //   Key extends clientFetchKey = clientFetchKey,
    // >(key: Key)
    function useClientFetch<
      R = unknown,
      Key extends clientFetchKey = clientFetchKey,
      Options extends ClientFetchOptions<Key> = ClientFetchOptions<Key>
    >(key: Key, options?: Options): Promise<RequestReturn<R>> {
      let rawOptions = {};
      let fetcher;
      if (typeof key !== "string") throw new TypeError("key must be a string")
      // graphql proxy fetch from browser client
      if (typeof key === "string" && key === "proxy" && !options) {
        fetcher = shopifyConfig.clients.graphqlProxy;
        return fetcher({
          session,
          rawBody: request.rawBody,
        });
      }

      try {
        if (typeof key === "string") {
          const { method } = options as UseShopifyCLientFetchOptions;
          const restRul = new shopifyConfig.clients.Rest({
            session
          });

          fetcher = restRul[method.toLowerCase()]

          rawOptions = {
            ...rawOptions,
            path: key,
          };
        } else {
          const graphql = new shopifyConfig.clients.Graphql({
            session,
          });
          fetcher = graphql.query;
          // graphql
          rawOptions = {
            ...rawOptions,
            data: {
              key,
            },
          };
        }
        return fetcher(rawOptions);

      } catch (error) {
        if (error instanceof GraphqlQueryError) {

        } else {
          return ctx.throw(500, error)
        }
      }
    }

    return {
      useClientFetch,
      session,
    };
  }

  public async getCurrentSessionId<T extends Context>(ctx: T): Promise<string> {
    const { request, response } = ctx;
    try {
      const sessionId = await shopifyConfig.session.getCurrentId({
        // isOnline will be conf 
        isOnline: true,
        rawRequest: request,
        rawResponse: response
      })
      return sessionId
    } catch (error) {

    }
  }

  static isEmbeddedApp = () => shopifyConfig.config.isEmbeddedApp;
}
