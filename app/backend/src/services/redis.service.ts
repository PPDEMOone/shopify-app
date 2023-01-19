import { RedisClientType, createClient } from "redis";
import { isObject, isString } from "class-validator";

import { Service } from "typedi";
import { isJSON } from "@src/helper/utils";

export const client = createClient({
  url: `${process.env.REDIS_SER_URL}:${process.env.REDIS_SER_PORT}`,
});

export type RedisKey = string /* | Buffer */;
export type Expire = number | Date;

@Service()
export class RedisService {
  private cacheClient = client;

  public async set<K extends RedisKey, V extends any>(
    key: K,
    rawValue: V,
    expire?: Expire
  ) {
    let value: string;
    let rawExpire: number;
    if (isObject(value)) {
      value = JSON.stringify(rawValue);
    }

    if (expire instanceof Date) {
      const targetExpire = new Date(expire);
      const timestamp = targetExpire.getTime();
      if (timestamp <= Date.now()) {
        throw new Error("expire must be better than 0");
      }
      rawExpire = timestamp - Date.now();
    } else {
      rawExpire = expire;
    }

    this.cacheClient.set(key, value, {
      PX: rawExpire,
    });
  }

  public async get<V, K extends RedisKey = RedisKey>(key: K): Promise<V> {
    let rawValue: V;
    if (typeof key !== "string") {
      throw new TypeError("key must be a string");
    }
    const value = await this.cacheClient.get(key);

    rawValue = isJSON(value) ? JSON.parse(value) : value;

    return rawValue;
  }

  public async del<K extends RedisKey[]>(...args: K) {
    // @ts-ignore
    this.cacheClient.del(...args);
  }

  // static isConnect() {
  //   return client
  // }
  // public deleteAll() {
  //   this.cacheClient.flushDb()
  // }
}
