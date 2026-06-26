import z from "zod";
import { friendRequestStatusEnum } from "@enums";

export const sendRequestSchema = {
  body: z.strictObject({
    receiver: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid receiver ID"),
  }),
};

export const processRequestSchema = {
  body: z.strictObject({
    status: z.union([
      z.literal(friendRequestStatusEnum.accepted),
      z.literal(friendRequestStatusEnum.rejected),
    ]),
  }),
};
