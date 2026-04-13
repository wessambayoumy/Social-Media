import { Router } from "express";
import AuthService from "./auth.service";
import * as authValidation from "./auth.validation";
import { authMiddleware, validationMiddleware } from "@/middleware";

const authRouter = Router();

const authService = new AuthService();
authRouter.post(
  "/signUp",
  validationMiddleware(authValidation.signUpSchema),
  async (req, res) => {
    const user = await authService.signUp(req.body);

    res.json({ message: "User registered successfully", user });
  },
);
authRouter.post(
  "/signIn",
  validationMiddleware(authValidation.signInSchema),
  async (req, res) => {
    const { user, token } = await authService.signIn(req.body);

    res.json({ message: "User signed in successfully", user, token });
  },
);

authRouter.post("/signOut", authMiddleware, async (_req, res) => {
  res.json({ message: "User signed out successfully" });
});

export default authRouter;
