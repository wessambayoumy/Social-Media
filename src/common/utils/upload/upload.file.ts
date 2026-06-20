import multer from "multer";
import { tmpdir } from "node:os";
import { v4 } from "uuid";
import { UploadStorageEnum } from "@enums";
import { fileFieldValidation, fileFilter } from "./uploader.validation";

const uploadFile = ({
  storageType = UploadStorageEnum.memory,
  validation = fileFieldValidation.image,
  maxSize = 5,
} = {}) => {
  const storage =
    storageType === UploadStorageEnum.memory
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: (_req, _file, cb) => {
            cb(null, tmpdir());
          },
          filename: (_req, file, cb) => {
            cb(null, `${v4()}__${file.originalname}`);
          },
        });

  return multer({
    storage,
    fileFilter: fileFilter(validation),
    limits: { fileSize: maxSize * 1024 * 1024 },
  });
};

export default uploadFile;
