import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env, cacheService, notificationService } from "@services";
import { globalErrorHandler, successResponseInterceptor } from "@response";
import { connectDB } from "@/database";
import { rateLimit } from "express-rate-limit";
import { authRouter } from "@auth";
import { userRouter } from "@user";
import { postRouter } from "@post";
import { chatRouter } from '@chat';
import { commentRouter } from "@comment";
import { fetchAndDownloadFile, fetchAndDownloadPreSigned } from "@upload";
import { SocketGateway } from "@socket";

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
  await cacheService.connectCacheDB();

  app.get("/", (_req, res) => {
    res.json("Welcome to the Social Media APP!");
  });

  app.get("/uploads/*path", fetchAndDownloadFile);
  app.get("/preSignedLink/*path", fetchAndDownloadPreSigned);
  app.post(
    "/send-notification",
    async (req: express.Request, res: express.Response) => {
      console.log({ token: req.body.token });
      await notificationService.sendOneNotification({
        token: req.body.token,
        data: {
          title: "Social Media App",
          body: "Welcome to the Social Media App!",
        },
      });
      return res.status(200).json({ message: "notification sent" });
    },
  );
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/posts", postRouter);
  app.use("/comments", commentRouter);
  app.use("/chats", chatRouter);

  

  app.use(globalErrorHandler);

  const httpServer = app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
   SocketGateway.initIO(httpServer);
};
