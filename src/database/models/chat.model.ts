import mongoose, {
  HydratedDocument,
  Model,
  model,
  Schema,
  Types,
} from "mongoose";
import { BadRequestError } from "@response";
import { IChat } from "@interfaces";
import { ChatTypeEnum } from "@enums";
import { messageSchema } from "./message.model";

const chatSchema = new Schema<IChat>(
  {
    members: { type: [Types.ObjectId], ref: "users" },
    createdBy: { type: [Types.ObjectId], ref: "users" },
    type: {
      type: Number,
      enum: Object.values(ChatTypeEnum).splice(
        Object.values(ChatTypeEnum).length / 2,
      ),
      required: true,
      default: ChatTypeEnum.private,
    },
    groupName: {
      type: String,
      trim: true,
      required: function () {
        return this.type === ChatTypeEnum.group;
      },
    },
    groupImage: {
      type: String,
      trim: true,
    },
    chatId: {
      type: String,
      trim: true,
      unique: true,
      required: function () {
        return this.type === ChatTypeEnum.group;
      },
    },

    messages: [{ type: messageSchema, ref: "messages" }],

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

chatSchema.pre(["findOne", "find", "countDocuments"], function () {
  const query = this.getQuery();
  if (query["paranoid"])
    this.setQuery({ deletedAt: { $exists: false }, ...query });
  else this.setQuery({ ...query });
});

chatSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function () {
  const query = this.getQuery();
  const update = this.getUpdate() as HydratedDocument<IChat>;

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

chatSchema.pre(["deleteOne", "findOneAndDelete"], function () {
  const query = this.getQuery();
  if (query["force"]) this.setQuery({ ...query });
  else this.setQuery({ deletedAt: { $exists: true }, ...query });
});

const chatModel: Model<IChat> =
  mongoose.models["chats"] || model("chats", chatSchema);

export default chatModel;
