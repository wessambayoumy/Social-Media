import z from "zod";
import { authValidation } from "@auth";

export type SignUpDTO = z.infer<typeof authValidation.signUpSchema.body>;
export type SignInDTO = z.infer<typeof authValidation.signInSchema.body>;
