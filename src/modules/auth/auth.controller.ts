import { Router, Request, Response } from "express";
import * as authValidation from "./auth.validation";
import { authMiddleware, validationMiddleware } from "@/middleware";
import authService from "./auth.service";
import { uploadFile } from "@upload";

const authRouter = Router();

authRouter.post(
  "/refreshToken",
  validationMiddleware(authValidation.refreshTokenSchema),
  async (req: Request, res: Response) => {
    const token = await authService.refreshToken(req.body.token);
    res.json({ message: "New access token generated", token });
  },
);

authRouter.post(
  "/signUp",
  uploadFile().single("profilePicture"),
  validationMiddleware(authValidation.signUpSchema),
  async (req: Request, res: Response) => {
    const user = await authService.signUp(
      req.body,
      req.file as Express.Multer.File,
    );

    res.json({ message: "User registered successfully", user });
  },
);
authRouter.post(
  "/signUpWithGoogle",
  validationMiddleware(authValidation.googleSignUpSchema),
  async (req, res) => {
    const tokens = await authService.signUpWithGoogle(req.body.idToken);
    res.status(201).json({ message: "user created successfully", tokens });
  },
);
authRouter.post(
  "/signIn",
  validationMiddleware(authValidation.signInSchema),
  async (req: Request, res: Response) => {
    const data = await authService.signIn(req.body);
    res.json({ message: "User signed in successfully", data });
  },
);

authRouter.post(
  "/verifyOtp",
  validationMiddleware(authValidation.verifyOtpSchema),
  async (req: Request, res: Response) => {
    await authService.verifyOtp(req.body);
    res.status(200).json({ message: "2FA verified successfully" });
  },
);

authRouter.patch(
  "/resetPassword",
  validationMiddleware(authValidation.resetPasswordSchema),
  async (req: Request, res: Response) => {
    const user = await authService.resetPassword(req.body.email);
    res.json({ message: "Password reset successfully", user });
  },
);

authRouter.use(authMiddleware);

authRouter.post("/signOut", async (req: Request, res: Response) => {
  const signed = await authService.signOut(req.token);
  res.json({ message: "User signed out successfully", signed });
});

authRouter.post("/signOutFromAll", async (req: Request, res: Response) => {
  const signed = await authService.signOutFromAll(req.userId);
  res.json({
    message: "User signed out from all devices successfully",
    signed,
  });
});

authRouter.patch(
  "/updatePassword",
  validationMiddleware(authValidation.updatePasswordSchema),
  async (req: Request, res: Response) => {
    const user = await authService.updatePassword(req.body, req.userId);
    res.json({ message: "Password updated successfully", user });
  },
);

authRouter.post("/enable2FA", async (req: Request, res: Response) => {
  await authService.enable2FA(req.userId);
  res.json({ message: "please check your email for the otp" });
});

authRouter.post("/disable2FA", async (req: Request, res: Response) => {
  await authService.disable2FA(req.userId);
  res.json({ message: "please check your email for the otp" });
});

export default authRouter;
