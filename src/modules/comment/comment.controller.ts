import { Router, Request, Response } from "express";
import commentService from "./comment.service";
import { reactionRouter } from "@reaction";
import * as commentValidation from "./comment.validation";
import { validationMiddleware } from "@/middleware";

const commentRouter = Router();

commentRouter.use("/:post_Id/reactions", reactionRouter);

commentRouter.post(
  "/",
  validationMiddleware(commentValidation.createCommentSchema),
  async (req: Request, res: Response) => {
    const comments = await commentService.createComment(
      req.params["post_Id"] as string,
      req.body,
      req.userId,
    );
    res.json(comments);
  },
);

commentRouter.post(
  "/:reply_Id",
  validationMiddleware(commentValidation.createCommentSchema),
  async (req: Request, res: Response) => {
    const comments = await commentService.replyOnComment(
      req.params["comment_Id"] as string,
      req.params["post_Id"] as string,
      req.body,
      req.userId,
    );
    res.json(comments);
  },
);

commentRouter.get("/", async (req: Request, res: Response) => {
  const comments = await commentService.getAllComments(
    req.params["post_Id"] as string,
  );
  res.json(comments);
});

commentRouter.get("/:comment_Id", async (req: Request, res: Response) => {
  const comments = await commentService.getCommentById(
    req.params["comment_Id"] as string,
  );
  res.json(comments);
});

commentRouter.delete("/:comment_Id", async (req: Request, res: Response) => {
  const comments = await commentService.deleteCommentById(
    req.params["comment_Id"] as string,
  );
  res.json(comments);
});

export default commentRouter;
