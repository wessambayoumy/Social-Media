import z from "zod";

export const createCommentSchema = {
  body: z
    .strictObject({
      content: z.string().min(1).max(500).optional(),
      files: z.array(z.object()).optional(),
      mentions: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.files && !data.content)
        ctx.addIssue({
          code: "custom",
          message: "No content or files provided",
        });
    }),
};
