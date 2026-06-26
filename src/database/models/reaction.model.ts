import mongoose, { Model, model, Schema, Types } from "mongoose";
import { IReaction } from "@interfaces";
import { ReactionEnum } from "@enums";

const reactionSchema = new Schema<IReaction>(
  {
    ref: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true, ref: "users" },
    emoji: {
      type: Number,
      enum: Object.values(ReactionEnum).splice(
        Object.values(ReactionEnum).length / 2,
      ),
      default: ReactionEnum.like,
    },
    onModel: { type: String, required: true },
  },
  {
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const reactionModel: Model<IReaction> =
  mongoose.models["reactions"] || model("reactions", reactionSchema);

export default reactionModel;
