import Redis from "ioredis";
import { logger } from "./console-logger";
import { getRedisConnectionOpts } from "./create-redis-conn-opts";

export class RedisCache {
  redis: Redis;
  private getCache = async (k: string) => await this.redis.get(k);
  private saveCache = async (k: string, v:string) => await this.redis.set(k,v);

  public getAppData = async () => JSON.parse(await this.redis.get("app_data") || "null");
  public setAppData = async (updates: Record<string,any>) => {
    const data = await this.getAppData();
    const newData = JSON.stringify({...data,...updates});
    await this.redis.set("app_data",newData);
  };
  public clearAppData = async () => await this.redis.set("app_data","null");

  /*
  public getAppData = async () => JSON.parse(await this.redis.get("app_data") || "null");
  public getAppDataValue = async (k: string) => (await this.getAppData())[k];
  public setAppDataValue = async (v: Record<string, any>) => {
    const data = await this.getAppData();
    const newData = JSON.stringify({...data,...v});
    await this.redis.set("app_data",newData);
  };
  public clearAppData = async () => await this.redis.set("app_data","null");
  */
  
  public connect = async (o?:{clear?:boolean}) => {
    try {
      this.redis = new Redis(getRedisConnectionOpts());
      // if(o && o.clear) await this.clearAppData();
      //this.refreshAppData();
      logger.print("debug","redis","Redis cache is running");
    }
    catch (e) {
      logger.error(`Redis connection error. ${e}`);
      process.exit(1);
    }
  };
  public test = async () => {
    try {
      const cache = await this.getAppData();
      logger.print("debug","redisCache","AppVars ->",cache.id);
    }
    catch (e) {
      console.error(e);
    }
  };
}
export const getRedisCache = async () => {
  const cache = new RedisCache();
  await cache.connect();
  return cache;
}
export default getRedisCache;