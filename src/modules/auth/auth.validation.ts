import { z } from "zod";
import { genderEnum, providerEnum, roleEnum } from "@enums";

const passwordRegex =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:])([^\s]){8,}$/;

export const signUpSchema = {
  body: z
    .strictObject({
      fName: z
        .string()
        .min(3, "First name must be at least 3 characters")
        .max(20, "First name must be at most 20 characters"),
      lName: z
        .string()
        .min(3, "Last name must be at least 3 characters")
        .max(20, "Last name must be at most 20 characters"),
      email: z.email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          passwordRegex,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          passwordRegex,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
      phoneNumber: z.string().optional(),
      age: z.coerce.number().optional(),
      gender: z.enum(genderEnum).optional(),
      provider: z.enum(providerEnum).optional(),
      role: z.enum(roleEnum).optional(),
      profilePicture: z.object(z.string()).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
};

export const signInSchema = {
  body: z.strictObject({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
      FCM: z.string().optional(),
  }),
};

export const updatePasswordSchema = {
  body: z
    .strictObject({
      currentPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          passwordRegex,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          passwordRegex,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
      reNewPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          passwordRegex,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
    })
    .refine((data) => data.newPassword === data.reNewPassword, {
      message: "New passwords don't match",
      path: ["reNewPassword"],
    }),
};

export const verifyOtpSchema = {
  body: z.strictObject({
    code: z.string().length(6, "OTP must be 6 digits"),
    name: z.string(),
    email: z.email("Invalid email address"),
  }),
};

export const refreshTokenSchema = {
  body: z.strictObject({
    token: z.string().min(1, "Token is required"),
  }),
};

export const resetPasswordSchema = {
  body: z.strictObject({
    email: z.email("Invalid email address"),
  }),
};

export const googleSignUpSchema = {
  body: z.strictObject({
    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    email: z.email("Invalid email address"),
    provider: z.enum(providerEnum),
    confirmed: z.boolean(),
  }),
};
