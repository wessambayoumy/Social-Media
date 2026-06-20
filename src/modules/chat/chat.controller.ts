import { Router, Request, Response } from "express";
import { authMiddleware } from "@/middleware";
import chatService from "./chat.service";
import { uploadFile, fileFieldValidation } from "@upload";

const chatRouter = Router({ mergeParams: true });

chatRouter.use(authMiddleware);

chatRouter.get("/getChat", (req, res) => {
  const { memberId } = req.params as { memberId: string };
  const { page = 1, limit = 10 } = req.query as {
    page: string | number;
    limit: string | number;
  };
  const chat = chatService.getChat(
    memberId,
    req.userId,
    page as number,
    limit as number,
  );
  return res.json(chat);
});

chatRouter.post(
  "/createGroup",
  uploadFile({ validation: fileFieldValidation.image }).single("attachment"),
  async (req: Request, res: Response) => {
    const chat = await chatService.createGroup(
      req.body,
      req.file as Express.Multer.File,
      req.userId,
    );
    return res.json(chat);
  },
);

chatRouter.get("/getGroup", (req, res) => {
  const { memberId } = req.params as { memberId: string };
  const { page = 1, limit = 10 } = req.query as {
    page: string | number;
    limit: string | number;
  };
  const chat = chatService.getGroupChat(
    memberId,
    req.userId,
    page as number,
    limit as number,
  );
  return res.json(chat);
});

export default chatRouter;
