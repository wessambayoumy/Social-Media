import { Types } from "mongoose";
import { IPost } from "./post.interface";
import { IUser } from "./user.interface";

export interface IComment {
  postId: Types.ObjectId | IPost;
  userId: Types.ObjectId | IUser;
  commentId: Types.ObjectId | IComment;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  restoredAt: Date;
}
