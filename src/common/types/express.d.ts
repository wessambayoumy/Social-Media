import { Types } from "mongoose";
import { roleEnum } from "@enums";

declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
      role: roleEnum;
      token: string;
    }
  }
}
export {};
