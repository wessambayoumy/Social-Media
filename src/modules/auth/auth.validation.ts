import { z } from "zod";
import { genderEnum, providerEnum, roleEnum } from "@enums";

const passwordRegex =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:])([^\s]){8,}$/;

export const signUpSchema = {
  body: z
    .object({
      userName: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters"),
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
      profilePicture: z.string().optional(),
      age: z.number().optional(),
      gender: z.enum(Object.values(genderEnum)).optional(),
      provider: z.enum(Object.values(providerEnum)).optional(),
      role: z.enum(Object.values(roleEnum)).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
};

export const signInSchema = {
  body: z.object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  }),
};
