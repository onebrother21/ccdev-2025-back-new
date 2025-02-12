import Redis from "ioredis";
import { logger, getRedisConnectionOpts } from "../utils";
import { BusinessVars } from "../models";

class RedisCache {
  redis: Redis;
  private getCache = async (k: string) => await this.redis.get(k);
  private saveCache = async (k: string, v:  string) => await this.redis.set(k, v);
  public getAppCache = async () => JSON.parse(await this.redis.get("app_data") || "null");
  public getAppCacheValue = async (k: string) => (await this.getAppCache())[k];
  public setAppCacheValue = async (v: Record<string, any>) => {
    const data = await this.getAppCache();
    const newData = JSON.stringify({...data,...v});
    await this.redis.set("app_data",newData);
  };
  public clearAppCache = async () => await this.redis.set("app_data","null");
  public connect = async (o?:{clear?:boolean}) => {
    try {
      this.redis = new Redis(getRedisConnectionOpts());
      if(o && o.clear) await this.clearAppCache();
      const vars = await this.getAppCache() || (await BusinessVars.findOne({})).json();
      if (vars) await this.setAppCacheValue(vars);
      logger.print("redis","Redis cache is running");
    }
    catch (e) {
      logger.error(`Redis connection error. ${e}`);
      process.exit(1);
    }
  };
  public test = async () => {
    try {
      const cache = await this.getAppCache();
      logger.print("redisCache","AppVars ->",cache.id);
    }
    catch (e) {
      console.error(e);
    }
  };
}
export default RedisCache;