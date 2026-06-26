import { Request } from "express";
import { HydratedDocument, Types } from "mongoose";
import { NotFoundError } from "@response";
import {
  CommentRepository,
  PostRepository,
  ReactionRepository,
  ReplyRepository,
} from "@repository";
import { notificationService } from "@services";
import { IUser } from "@interfaces";

type ReactableType = "post" | "comment" | "reply";

interface ReactableStrategy {
  findById: (
    id: Types.ObjectId | string,
  ) => Promise<{ userId: Types.ObjectId | string | IUser }>;
  label: ReactableType;
}

class ReactionService {
  async reactOn(req: Request, strategy: ReactableStrategy) {
    const { id } = req.params as { id: string };
    const { reactType } = req.body;

    const target = await strategy.findById(new Types.ObjectId(id));
    if (!target) throw new NotFoundError(`${strategy.label} not found`);

    const existingReaction = await ReactionRepository.findOne({
      filter: { ref: id, userId: req.userId },
    });

    if (existingReaction) {
      existingReaction.emoji = reactType;
      await existingReaction.save();
    } else {
      await ReactionRepository.create({
        data: { emoji: reactType, ref: id, userId: req.userId },
      });
    }
    const ownerId =
      typeof target.userId === "object" && "id" in target.userId
        ? target.userId._id.toString()
        : target.userId.toString();

    await notificationService.sendOneNotification({
      token: ownerId,
      data: {
        title: `React on your ${strategy.label}`,
        body: `${req.userId} reacted with ${reactType} on your ${strategy.label} ${id}`,
      },
    });

    return "done";
  }

  async reactOnPost(req: Request) {
    return this.reactOn(req, {
      label: "post",
      findById: (id) => PostRepository.findById({ id: new Types.ObjectId(id) }),
    });
  }

  async reactOnComment(req: Request) {
    return this.reactOn(req, {
      label: "comment",
      findById: (id) =>
        CommentRepository.findById({ id: new Types.ObjectId(id) }),
    });
  }

  async reactOnReply(req: Request) {
    return this.reactOn(req, {
      label: "reply",
      findById: (id) =>
        ReplyRepository.findById({ id: new Types.ObjectId(id) }),
    });
  }
}

export default new ReactionService();
