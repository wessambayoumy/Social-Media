import mongoose, { Types } from "mongoose";
import { IFriendship } from "@interfaces";

const friendshipschema = new mongoose.Schema<IFriendship>(
  {
    userA: {
      type: Types.ObjectId,
      required: true,
    },
    userB: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
  },
);

friendshipschema.index({ userA: 1, userB: 1 }, { unique: true });

const friendshipModel = mongoose.model<IFriendship>(
  "friendship",
  friendshipschema,
);
export default friendshipModel;
