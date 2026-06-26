import { PostVisibilityEnum } from "@enums";
import { HydratedDocument, Types } from "mongoose";
import { IUser } from "@interfaces";

export const getVisibiltyFilter = (
  user: HydratedDocument<IUser>,
  friendIds: Types.ObjectId[] = [],
) => [
  { visibility: PostVisibilityEnum.public },
  { visibility: PostVisibilityEnum.private, userId: user.id },
  {
    visibility: PostVisibilityEnum.friendsOnly,
    userId: { $in: [user._id, ...friendIds] },
  },
  { mentions: { $in: [user._id] } },
];
