import mongoose, {  Model, model, Schema } from "mongoose";
import { IReaction } from "@interfaces";

const reactionSchema = new Schema<IReaction>(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    emoji: { type: String, required: true },
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
