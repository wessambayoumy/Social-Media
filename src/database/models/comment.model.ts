import mongoose, { HydratedDocument, Model, model, Schema } from "mongoose";
import { BadRequestError } from "@response";
import { IComment } from "@interfaces";

const commentSchema = new Schema<IComment>(
  {
    postId: { type: String, required: true },
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

commentSchema.pre(["findOne", "find"], function () {
  const query = this.getQuery();
  if (query["paranoid"])
    this.setQuery({ deletedAt: { $exists: false }, ...query });
  else this.setQuery({ ...query });
});

commentSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function () {
  const query = this.getQuery();
  const update = this.getUpdate() as HydratedDocument<IComment>;

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

commentSchema.pre(["deleteOne", "findOneAndDelete"], function () {
  const query = this.getQuery();
  if (query["force"]) this.setQuery({ ...query });
  else this.setQuery({ deletedAt: { $exists: true }, ...query });
});

const commentModel: Model<IComment> =
  mongoose.models["comments"] || model("comments", commentSchema);

export default commentModel;
