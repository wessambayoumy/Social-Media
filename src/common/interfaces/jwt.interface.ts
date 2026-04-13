import { Types } from "mongoose";
import { roleEnum } from "@enums";
import {  JwtPayload } from "jsonwebtoken";

export interface JwtDetails extends JwtPayload {
  userId: Types.ObjectId;
  email?: string;
  role?: roleEnum;
}