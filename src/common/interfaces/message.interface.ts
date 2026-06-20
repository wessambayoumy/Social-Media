import { Types } from "mongoose";
import { IUser } from "./user.interface.js";
import { IReaction } from "./reaction.interface.js";

export interface IMessage {
  sender: Types.ObjectId | IUser;
  content: string;
  attachments: string[];
  reactions: Types.ObjectId[] | IReaction[];
  mentions: Types.ObjectId[] | IUser[];
  createdAt: Date;
  deletedAt?: Date;
  restoredAt?: Date;
  updatedAt?: Date;
}