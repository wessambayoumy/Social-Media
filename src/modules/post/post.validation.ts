import z from "zod";
import { PostVisibilityEnum } from "@enums";

export const createPostSchema = {
  body: z
    .strictObject({
      content: z.string().min(1).max(500).optional(),
      files: z.array(z.object()).optional(),
      visibility: z
        .enum(PostVisibilityEnum)
        .default(PostVisibilityEnum.public)
        .optional(),
      mentions: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.files && !data.content)
        ctx.addIssue({
          code: "custom",
          message: "No content or files provided",
        });
      if (data.mentions && data.mentions.length > 1) {
        const uniqueMentions = new Set(data.mentions);
        if (uniqueMentions.size !== data.mentions.length)
          ctx.addIssue({
            code: "custom",
            message: "Duplicate mentions are not allowed",
          });
      }
    }),
};

export const getPostsSchema = {
  query: z.strictObject({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    search: z.string().max(100).optional(),
  }),
};

export const updatePostSchema = {
  body: z.strictObject({
    content: z.string().min(1).max(500).optional(),
    files: z.array(z.object()).optional(),
    visibility: z.enum(PostVisibilityEnum).optional(),
    mentions: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  }),
};