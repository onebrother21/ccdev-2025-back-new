import { QueueOptions } from 'bullmq';
import { URL } from "url";

export const getRedisConnectionOpts = () => {
  let connection:QueueOptions["connection"];
  if (process.env.REDIS_URL) {
    // Parse Redis URL for production environments
    const redisUrl = new URL(process.env.REDIS_URL);
    connection = {
      host: redisUrl.hostname,
      port: Number(redisUrl.port),
      password: redisUrl.password,
      tls: process.env.REDIS_TLS === "true" ? {} : undefined, // TLS for secure connections
    };
  }
  else {
    // Local Redis configuration
    connection = {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      //password: process.env.REDIS_PASSWORD || undefined,
      //tls: process.env.REDIS_TLS === "true" ? {} : { rejectUnauthorized: false },
    };
  }
  return connection;
}