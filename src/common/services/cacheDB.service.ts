import {
  createClient,
  RedisArgument,
  RedisClientType,
  SetOptions,
} from "redis";
import env from "./env.service";

type RedisSet = {
  key: RedisArgument;
  value: RedisArgument | number;
  options?: SetOptions;
};

class CacheService {
  private readonly client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: env.redisUri,
    });
  }
  async get(key: RedisArgument): Promise<string | null> {
    return await this.client.get(key);
  }
  async connectCacheDB() {
    await this.client
      .connect()
      .then(() => console.log("Connected to Redis "))
      .catch(() => console.error("Failed to connect to Redis "));
  }

  async set({ key, value, options }: RedisSet) {
    return await this.client.set(key, value, options);
  }

  async ttl(key: RedisArgument): Promise<number> {
    return await this.client.ttl(key);
  }

  async exists(keys: RedisArgument | Array<RedisArgument>): Promise<number> {
    return await this.client.exists(keys);
  }

  async del(keys: RedisArgument | Array<RedisArgument>) {
    return await this.client.del(keys);
  }

  async mget(keys: RedisArgument[]) {
    return await this.client.mGet(keys);
  }

  async mset(
    toSet:
      | Array<[RedisArgument, RedisArgument]>
      | Array<RedisArgument>
      | Record<string, RedisArgument>,
  ) {
    return await this.client.mSet(toSet);
  }

  async keys(pattern: RedisArgument) {
    return await this.client.keys(pattern);
  }

  async incrBy(key: RedisArgument, incrementation: number) {
    return await this.client.incrBy(key, incrementation);
  }
}

export default new CacheService();
