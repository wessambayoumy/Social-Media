import { RedisArgument, SetOptions } from "redis";
import { client } from "./cacheDB.connection";

class CacheService {
  async get(key: RedisArgument): Promise<string | null> {
    return await client.get(key);
  }

  async set(
    key: RedisArgument,
    value: RedisArgument | number,
    options?: SetOptions,
  ) {
    return await client.set(key, value, options);
  }

  async ttl(key: RedisArgument): Promise<number> {
    return await client.ttl(key);
  }

  async exists(keys: RedisArgument | Array<RedisArgument>): Promise<number> {
    return await client.exists(keys);
  }

  async del(keys: RedisArgument | Array<RedisArgument>) {
    return await client.del(keys);
  }

  async mget(keys: RedisArgument[]) {
    return await client.mGet(keys);
  }

  async mset(
    toSet:
      | Array<[RedisArgument, RedisArgument]>
      | Array<RedisArgument>
      | Record<string, RedisArgument>,
  ) {
    return await client.mSet(toSet);
  }

  async keys(pattern: RedisArgument) {
    return await client.keys(pattern);
  }

  async incrBy(key: RedisArgument, incrementation: number) {
    return await client.incrBy(key, incrementation);
  }
}

export default CacheService;
