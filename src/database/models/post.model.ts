import mongoose, {
  HydratedDocument,
  Model,
  model,
  Schema,
  Types,
} from "mongoose";
import { BadRequestError } from "@response";
import { IPost } from "@interfaces";
import { PostVisibilityEnum } from "@enums";

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: function (this: IPost) {
        return this.attachments.length === 0;
      },
    },

    attachments: [String],

    visibility: {
      type: Number,
      enum: Object.values(PostVisibilityEnum).splice(
        Object.values(PostVisibilityEnum).length / 2,
      ),
      default: PostVisibilityEnum.public,
    },

    userId: { type: String, required: true },

    mentions: { type: [Types.ObjectId], ref: "users" },

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

postSchema.pre(["findOne", "find", "countDocuments"], function () {
  const query = this.getQuery();
  if (query["paranoid"])
    this.setQuery({ deletedAt: { $exists: false }, ...query });
  else this.setQuery({ ...query });
});

postSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function () {
  const query = this.getQuery();
  const update = this.getUpdate() as HydratedDocument<IPost>;

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

postSchema.pre(["deleteOne", "findOneAndDelete"], function () {
  const query = this.getQuery();
  if (query["force"]) this.setQuery({ ...query });
  else this.setQuery({ deletedAt: { $exists: true }, ...query });
});

const postModel: Model<IPost> =
  mongoose.models["posts"] || model("posts", postSchema);

export default postModel;
