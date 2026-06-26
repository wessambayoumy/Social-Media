import z from "zod";
import { createCommentSchema } from "./comment.validation";

export type createCommentDto = z.infer<typeof createCommentSchema.body>;
