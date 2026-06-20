import { PostVisibilityEnum } from "@enums";
import { HydratedDocument } from "mongoose";
import { IUser } from "@interfaces";
export const getVisibiltyFilter = (user: HydratedDocument<IUser>) => [
  { visibility: PostVisibilityEnum.public },
  { visibility: PostVisibilityEnum.private, userId: user.id },
  {
    visibility: PostVisibilityEnum.friendsOnly,
    userId: { $in: [user.id], ...(user.friends || []) },
  },
  { mentions: { $in: [user.id] } },
];
