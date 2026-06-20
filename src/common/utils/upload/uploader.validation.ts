import { FileFilterCallback } from "multer";
import { Request } from "express";

export const fileFieldValidation = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  video: ["video/mp4", "video/mkv", "video/avi"],
};
export const fileFilter = (validation: string[]) => {
  return function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (!validation.includes(file.mimetype)) {
      (req as any).fileValidationError = `Invalid file format: ${file.mimetype}`;
      return cb(null, false);
    }
    return cb(null, true);
  };
};
