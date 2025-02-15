import Redis from "ioredis";
import Models from "../models";
import Types from "../types";
import Utils from '../utils';

class RedisCache {
  redis: Redis;
  private getCache = async (k: string) => await this.redis.get(k);
  private saveCache = async (k: string, v:string) => await this.redis.set(k,v);


  public getAppData = async () => JSON.parse(await this.redis.get("app_data") || "null");
  public getAppDataValue = async (k: string) => (await this.getAppData())[k];
  public setAppDataValue = async (v: Record<string, any>) => {
    const data = await this.getAppData();
    const newData = JSON.stringify({...data,...v});
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
  
  static connect = async (o?:{clear?:boolean}) => {
    try {
      const cache = new this();
      cache.redis = new Redis(Utils.getRedisConnectionOpts());
      if(o && o.clear) await cache.clearAppData();
      const vars = await cache.getAppData() || (await Models.BusinessVars.findOne({})).json();
      if(vars) await cache.setAppDataValue(vars);
      Utils.logger.print("redis","Redis cache is running");
      return cache;
    }
    catch (e) {
      Utils.logger.error(`Redis connection error. ${e}`);
      process.exit(1);
    }
  };
  public test = async () => {
    try {
      const cache = await this.getAppData();
      Utils.logger.print("redisCache","AppVars ->",cache.id);
    }
    catch (e) {
      console.error(e);
    }
  };
}
export default RedisCache;