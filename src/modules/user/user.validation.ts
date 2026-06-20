import { genderEnum } from "@enums";
import z from "zod";

export const updateUserSchema = {
  body: z.strictObject({
    fName: z.string().optional(),
    lName: z.string().optional(),
    phoneNumber: z.string().optional(),
    age: z.number().optional(),
    gender: z.enum(genderEnum).optional(),
    file: z.string().optional(),
    files: z.array(z.string()).optional(),
  }),
};
