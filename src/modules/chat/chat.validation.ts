import z from "zod";

export const createGroupSchema = {
  body: z.strictObject({
    membersIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1),
    groupName: z.string().min(1).max(50),
    chatId: z.string().min(1),
  }),
};

export const getChatSchema = {
  query: z.strictObject({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  }),
};
