import {
  createClient,
  RedisArgument,
  RedisClientType,
  SetOptions,
} from "redis";
import env from "./env.service";
import { Types } from "mongoose";

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
  FCM_key(userId: Types.ObjectId | string) {
    return `user:FCM:${userId.toString()}`;
  }
  async addFCM(userId: Types.ObjectId | string, FCMToken: string) {
    return await this.client.sAdd(this.FCM_key(userId), FCMToken);
  }
  async removeFCM(userId: Types.ObjectId | string, FCMToken: string) {
    return await this.client.sRem(this.FCM_key(userId), FCMToken);
  }
  async getFCMs(userId: Types.ObjectId | string) {
    return await this.client.sMembers(this.FCM_key(userId));
  }
  async hasFCMs(userId: Types.ObjectId | string) {
    return await this.client.sCard(this.FCM_key(userId));
  }

  async removeFCMUser(userId: Types.ObjectId | string) {
    return await this.client.del(this.FCM_key(userId));
  }
  socketKey(userId: Types.ObjectId | string) {
    return `user:sockets:${userId}`;
  }
  async addSocket(userId: Types.ObjectId | string, socketId: string) {
    return await this.client.sAdd(this.socketKey(userId), socketId);
  }

  async removeSocket(userId: Types.ObjectId | string, socketId: string) {
    return await this.client.sRem(this.socketKey(userId), socketId);
  }

  async getSockets(userId: Types.ObjectId | string) {
    return await this.client.sMembers(this.socketKey(userId));
  }

  async hasSockets(userId: Types.ObjectId | string) {
    return await this.client.sCard(this.socketKey(userId));
  }

  async removeUser(userId: Types.ObjectId | string) {
    return await this.client.del(this.socketKey(userId));
  }
}

export default new CacheService();
