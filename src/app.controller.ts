import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env, CacheService } from "@services";
import { globalErrorHandler, successResponseInterceptor } from "@response";
import { connectDB } from "@/database";
import { rateLimit } from "express-rate-limit";
import { authRouter } from "@auth";
import { userRouter } from "@user";
import { postRouter } from "@post";
import { commentRouter } from "@comment";

export const bootstrap = async () => {
  const app = express();
  app.use(successResponseInterceptor);
  app.use(
    express.json(),
    cors({ origin: env.corsOrigins }),
    helmet(),
    rateLimit({ windowMs: env.rateLimitTime, limit: env.rateLimitCount }),
  );
  await connectDB();
  await CacheService.connectCacheDB();
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/posts", postRouter);
  app.use("/comments", commentRouter);

  app.get("/", (_req, res) => {
    res.send("Welcome to the Social Media API!");
  });

  app.use(globalErrorHandler);
  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};
