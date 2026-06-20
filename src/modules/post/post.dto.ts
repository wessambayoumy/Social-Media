import z from "zod";
import { createPostSchema, getPostsSchema } from "./post.validation";

// Data Transfer Objects for Post module
export type createPostDto = z.infer<typeof createPostSchema.body>;

export type getPostsDto = z.infer<typeof getPostsSchema.query>;
