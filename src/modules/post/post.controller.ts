import { Router, Request, Response } from "express";
import { authMiddleware, validationMiddleware } from "@/middleware";
import postService from "./post.service";
import { Types } from "mongoose";
import * as PostDto from "./post.dto";
import * as postValidation from "./post.validation";
import reactionRouter from "../reaction/reaction.controller.js";

const postRouter = Router();

postRouter.use("/:id/reactions", reactionRouter);
postRouter.use(authMiddleware);

postRouter.get(
  "/",
  validationMiddleware(postValidation.getPostsSchema),
  async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts(
      req.userId,
      req.query as unknown as PostDto.getPostsDto,
    );
    res.json(posts);
  },
);
postRouter.get("/:id", async (req: Request, res: Response) => {
  const posts = await postService.getPostById(
    req.params["id"] as unknown as Types.ObjectId,
  );
  res.json(posts);
});
postRouter.post(
  "/",
  validationMiddleware(postValidation.createPostSchema),
  async (req: Request, res: Response) => {
    const posts = await postService.createPost(req.body, req.userId);
    res.json(posts);
  },
);
postRouter.patch(
  "/:id",
  validationMiddleware(postValidation.updatePostSchema),
  async (req: Request, res: Response) => {
    const posts = await postService.updatePost(
      req.params["id"] as unknown as Types.ObjectId,
      req.body,
    );
    res.json(posts);
  },
);
postRouter.delete("/:id", async (req: Request, res: Response) => {
  const posts = await postService.deletePostById(
    req.params["id"] as unknown as Types.ObjectId,
  );
  res.json(posts);
});

export default postRouter;
