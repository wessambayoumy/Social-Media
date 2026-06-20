import { ReactionEnum } from "@enums";

export interface IReaction {
  postId: string;
  userId: string;
  emoji: ReactionEnum;
}
