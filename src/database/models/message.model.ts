import { Schema, Types } from "mongoose";
import { IMessage } from "@interfaces";
export const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: function (this: IMessage) {
        return this.attachments.length === 0;
      },
    },

    attachments: { type: [String] },
    reactions: [{ type: Types.ObjectId, ref: "User" }],
    mentions: [{ type: Types.ObjectId, ref: "User" }],
    sender: { type: Types.ObjectId, ref: "User", required: true },

    deletedAt: { type: Date },
    restoredAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true,
  },
);
