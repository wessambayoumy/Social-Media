import { Types } from "mongoose";
import { IUser } from "../user.interface";

export interface IFriendship {
  userA: Types.ObjectId | IUser;
  userB: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
