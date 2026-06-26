import z from "zod";
import { authValidation } from "@auth";

export type SignUpDTO = z.infer<typeof authValidation.signUpSchema.body>;
export type SignInDTO = z.infer<typeof authValidation.signInSchema.body>;
export type UpdatePasswordDTO = z.infer<typeof authValidation.updatePasswordSchema.body>;
export type VerifyOtpDTO = z.infer<typeof authValidation.verifyOtpSchema.body>;
export type RefreshTokenDTO = z.infer<typeof authValidation.refreshTokenSchema.body>;
export type ResetPasswordDTO = z.infer<typeof authValidation.resetPasswordSchema.body>;
