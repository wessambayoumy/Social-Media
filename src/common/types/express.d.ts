import { Types } from "mongoose";
import { roleEnum } from "../enums/user.enum.js";

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
