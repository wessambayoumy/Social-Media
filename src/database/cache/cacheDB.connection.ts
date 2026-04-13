import { createClient } from "redis";
import { env } from "@config";

export const client = createClient({
  url: env.redisUri,
}).on("error", (err) => console.error("Redis Client Error", err));

export const connectCacheDB = async () => {
  await client
    .connect()
    .then(() => console.log("Connected to Redis "))
    .catch((err) => console.error("Failed to connect to Redis ", err));
};
