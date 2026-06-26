import { ReactionEnum } from "@enums";
import { Types } from "mongoose";

export interface IReaction {
  ref: string;
  userId: Types.ObjectId;
  emoji: ReactionEnum;
  onModel:string
}
