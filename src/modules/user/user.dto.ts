import z from "zod";
import { updateUserSchema } from "./user.validation";

export type UpdateUserDTO = z.infer<typeof updateUserSchema.body>;