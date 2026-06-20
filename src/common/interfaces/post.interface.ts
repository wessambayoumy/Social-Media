import { PostVisibilityEnum } from "@enums";
import { IUser } from './user.interface';
import { Types } from "mongoose";

export interface IPost {
  userId: Types.ObjectId | IUser;
  content: string;
  attachments: string[];
  visibility: PostVisibilityEnum;
  mentions?:  Types.ObjectId[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  restoredAt: Date;
}
