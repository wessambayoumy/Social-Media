import { Types } from "mongoose";
import { IUser } from "../user.interface";
import { friendRequestStatusEnum } from "@enums";

export interface IFriendRequest {
  sender: Types.ObjectId | IUser;
  receiver: Types.ObjectId | IUser;
  createdAt: Date;
  status: friendRequestStatusEnum;
}
