import { Router } from "express";
import UserService from "./user.service";
import { authMiddleware, validationMiddleware } from "@/middleware";
import { uploadFile } from "@upload";
import { chatRouter } from "@chat";
import * as userValidation from "./user.validation";

const userRouter = Router();
userRouter.use("/:userId", chatRouter);

userRouter.get("/", async (_req, res) => {
  const users = await UserService.getAllUsers();
  res.json(users);
});

userRouter.use(authMiddleware);

userRouter.get("/getUser", async (req, res) => {
  const user = await UserService.getUserById(req.userId);
  res.json(user);
});

userRouter.patch(
  "/updateUser",
  uploadFile().fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPhotos", maxCount: 10 },
  ]),
  validationMiddleware(userValidation.updateUserSchema),
  async (req, res) => {
    const uploadedFiles = req.files as Record<string, Express.Multer.File[]>;

    const user = await UserService.updateUser(req.userId, {
      ...req.body,
      file: uploadedFiles?.["profilePicture"]?.[0],
      files: uploadedFiles?.["coverPhotos"] ?? [],
    });
    res.json(user);
  },
);

userRouter.put("/deleteProfilePicture", async (req, res) => {
  await UserService.deleteProfilePicture(req.userId);
  res.json({ message: "User deleted successfully" });
});

userRouter.put("/deleteAllCoverImages", async (req, res) => {
  await UserService.deleteAllCoverImages(req.userId);
  res.json({ message: "User deleted successfully" });
});

userRouter.delete("/deleteUser", async (req, res) => {
  await UserService.deleteUser(req.userId);
  res.json({ message: "User deleted successfully" });
});

export default userRouter;
