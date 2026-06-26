import z from "zod";
import { ReactionEnum } from "@enums";

export const reactSchema = {
  body: z.strictObject({
    reactType: z.nativeEnum(ReactionEnum),
  }),
};
