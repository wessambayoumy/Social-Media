import dotenv from "dotenv";
import { resolve } from "node:path";

const nodeEnv = process.env["NODE_ENV"] ?? "dev";
dotenv.config({ path: resolve(`config/.env.${nodeEnv}`) });

const env = {
  appName: process.env["APP_NAME"] as string,
  port: Number(process.env["PORT"]),
  mongoUri: process.env["MONGO_URI"] as string,
  saltRounds: Number(process.env["SALT_ROUNDS"]),
  jwtExpiryAccess: Number(process.env["JWT_EXPIRY_ACCESS"]),
  jwtExpiryRefresh: Number(process.env["JWT_EXPIRY_REFRESH"]),
  jwtAdminSecretAccess: process.env["JWT_SIGNATURE_ADMIN_ACCESS"] as string,
  jwtAdminSecretRefresh: process.env["JWT_SIGNATURE_ADMIN_REFRESH"] as string,
  jwtUserSecretAccess: process.env["JWT_SIGNATURE_USER_ACCESS"] as string,
  jwtUserSecretRefresh: process.env["JWT_SIGNATURE_USER_REFRESH"] as string,
  jwtIssuer: process.env["JWT_ISSUER"] as string,
  encryptionKey: process.env["ENCRYPTION_KEY"] as string,
  emailUser: process.env["EMAIL_USER"] as string,
  emailPass: process.env["EMAIL_PASS"] as string,
  emailSecret: process.env["EMAIL_SECRET"] as string,
  redisUri: process.env["REDIS_URI"] as string,
  rateLimitCount: Number(process.env["RATE_LIMIT_COUNT"]),
  rateLimitTime: Number(process.env["RATE_LIMIT_TIME"]),
  corsOrigins: process.env["CORS_ORIGINS"]?.split(",") as string[],
  awsRegion: process.env["AWS_REGION"] as string,
  awsAccessKeyId: process.env["AWS_ACCESS_KEY_ID"] as string,
  awsSecretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] as string,
  awsBucketName: process.env["AWS_BUCKET_NAME"] as string,
  awsPresignExpiry: Number(process.env["AWS_PRESIGN_EXPIRY"]),
};

export default env;
