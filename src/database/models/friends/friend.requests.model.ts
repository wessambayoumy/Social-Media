import mongoose, { Types } from "mongoose";
import { IFriendRequest } from "@interfaces";
import { friendRequestStatusEnum } from "@enums";

const friendRequestschema = new mongoose.Schema<IFriendRequest>(
  {
    sender: {
      type: Types.ObjectId,
      required: true,
      ref: "users",
    },
    receiver: {
      type: Types.ObjectId,
      required: true,
      ref: "users",
    },
    status: {
      type: Number,
      enum: Object.values(friendRequestStatusEnum).splice(
        Object.values(friendRequestStatusEnum).length / 2,
        Object.values(friendRequestStatusEnum).length,
      ),
      default: friendRequestStatusEnum.pending,
    },
  },
  {
    timestamps: { createdAt: true },
    toObject: {
      virtuals: true,
    },
  },
);
friendRequestschema.index({ sender: 1, receiver: 1 }, { unique: true });

const friendRequestModel = mongoose.model<IFriendRequest>(
  "friendRequest",
  friendRequestschema,
);
export default friendRequestModel;
