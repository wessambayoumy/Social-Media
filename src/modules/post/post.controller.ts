import { Router, Request, Response } from "express";
import { authMiddleware } from "@/middleware";
import postService from "./post.service";
import { Types } from "mongoose";
import * as PostDto from "./post.dto";

const postRouter = Router();

postRouter.use(authMiddleware);

postRouter.get("/", async (req: Request, res: Response) => {
  const posts = await postService.getAllPosts(
    req.userId,
    req.query as unknown as PostDto.getPostsDto,
  );
  res.json(posts);
});
postRouter.get("/:id", async (req: Request, res: Response) => {
  const posts = await postService.getPostById(
    req.params["id"] as unknown as Types.ObjectId,
  );
  res.json(posts);
});
postRouter.post("/", async (req: Request, res: Response) => {
  const posts = await postService.createPost(req.body, req.userId);
  res.json(posts);
});
postRouter.patch("/:id", async (req: Request, res: Response) => {
  const posts = await postService.updatePost(
    req.params["id"] as unknown as Types.ObjectId,
    req.body,
  );
  res.json(posts);
});
postRouter.delete("/:id", async (req: Request, res: Response) => {
  const posts = await postService.deletePostById(
    req.params["id"] as unknown as Types.ObjectId,
  );
  res.json(posts);
});

export default postRouter;
