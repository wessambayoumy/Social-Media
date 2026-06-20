import { Types } from "mongoose";
import { IUser } from "./user.interface.js";
import { ChatTypeEnum } from "@enums";
import { IMessage } from "./message.interface.js";

export interface IChat {
  members: Types.ObjectId[] | IUser[];
  createdBy: Types.ObjectId | IUser;
  messages: IMessage[];
  type: ChatTypeEnum;
  groupName: string;
  groupImage: string;
  chatId: string;
  createdAt: Date;
  deletedAt?: Date;
  restoredAt?: Date;
  updatedAt?: Date;
}
