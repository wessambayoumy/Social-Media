import mongoose, { HydratedDocument, Model, model, Schema } from "mongoose";
import { BadRequestError } from "@response";
import { IReply } from "@interfaces";

const replySchema = new Schema<IReply>(
  {
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    attachments: [String],
    deletedAt: Date,
    restoredAt: Date,
  },
  {
    strict: true,
    strictQuery: true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

replySchema.pre(["findOne", "find"], function () {
  const query = this.getQuery();
  if (query["paranoid"])
    this.setQuery({ deletedAt: { $exists: false }, ...query });
  else this.setQuery({ ...query });
});

replySchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function () {
  const query = this.getQuery();
  const update = this.getUpdate() as HydratedDocument<IReply>;

  if (update.$set.length <= 1) throw new BadRequestError("No fields to update");

  if (update.deletedAt) {
    this.setUpdate({ $unset: { restoredAt: 1 }, ...update });
  }
  if (update.restoredAt) {
    this.setUpdate({ $unset: { deletedAt: 1 }, ...update });
    this.setQuery({ deletedAt: { $exists: true }, ...this.getQuery() });
  }
  if (query["paranoid"])
    this.setQuery({ deletedAt: { $exists: false }, ...query });
  else this.setQuery({ ...query });
});

replySchema.pre(["deleteOne", "findOneAndDelete"], function () {
  const query = this.getQuery();
  if (query["force"]) this.setQuery({ ...query });
  else this.setQuery({ deletedAt: { $exists: true }, ...query });
});

const replyModel: Model<IReply> =
  mongoose.models["replies"] || model("replies", replySchema);

export default replyModel;
