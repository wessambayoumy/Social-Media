import z from "zod";
import { createPostSchema, getPostsSchema, updatePostSchema } from "./post.validation";

export type createPostDto = z.infer<typeof createPostSchema.body>;
export type getPostsDto = z.infer<typeof getPostsSchema.query>;
export type updatePostDto = z.infer<typeof updatePostSchema.body>;
