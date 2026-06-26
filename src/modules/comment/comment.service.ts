import { Types } from "mongoose";
import * as CommentDto from "./comment.dto";
import {
  CommentRepository,
  FriendshipRepository,
  PostRepository,
  UserRepository,
} from "@repository";
import { s3Service } from "@services";
import { BadRequestError, NotFoundError } from "@response";
import { getVisibiltyFilter } from "@filters";

async function getFriendIds(userId: Types.ObjectId): Promise<Types.ObjectId[]> {
  const friendships = await FriendshipRepository.find({
    filter: { $or: [{ userA: userId }, { userB: userId }] },
  });
  return friendships.map((f) =>
    (f.userA as Types.ObjectId).equals(userId) ? (f.userB as Types.ObjectId) : (f.userA as Types.ObjectId),
  );
}

class CommentService {
  async createComment(
    post_Id: string,
    { content, files, mentions }: CommentDto.createCommentDto,
    userId: Types.ObjectId,
  ) {
    const [user, friendIds] = await Promise.all([
      UserRepository.findById({ id: userId }),
      getFriendIds(userId),
    ]);
    const postId = new Types.ObjectId(post_Id);
    const post = await PostRepository.findOne({
      filter: {
        _id: postId,
        $or: getVisibiltyFilter(user, friendIds),
      },
    });
    if (!post) {
      throw new NotFoundError("Fail to find matching post");
    }
    if (mentions) {
      const validMentions = await Promise.all(
        mentions.map((mention: string) =>
          PostRepository.findById({ id: new Types.ObjectId(mention) }),
        ),
      );
      if (validMentions.length !== mentions.length)
        throw new NotFoundError("One or more mentioned users not found");
    }
    let attachments: string[] = [];
    if (files) {
      attachments = await s3Service.uploadManyFiles({
        files: files as unknown as Express.Multer.File[],
        path: `user-${userId}/posts/post-${post.id}/comments`,
      });
    }
    const Comment = await CommentRepository.create({
      data: {
        userId,
        ...(content && { content }),
        ...(attachments && { attachments }),
        ...(mentions && { mentions: mentions as unknown as Types.ObjectId[] }),
        postId,
      },
    });
    if (!Comment) {
      if (attachments) await s3Service.deleteManyFiles(attachments);
      throw new BadRequestError("Comment not created");
    }
    return Comment.toJSON();
  }

  async replyOnComment(
    post_Id: string,
    comment_Id: string,
    { content, files, mentions }: CommentDto.createCommentDto,
    userId: Types.ObjectId,
  ) {
    const [user, friendIds] = await Promise.all([
      UserRepository.findById({ id: userId }),
      getFriendIds(userId),
    ]);
    const postId = new Types.ObjectId(post_Id);
    const commentId = new Types.ObjectId(comment_Id);

    const comment = await CommentRepository.findOne({
      filter: {
        id: commentId,
        postId: postId,
      },
      options: {
        populate: [
          {
            path: "postId",
            match: {
              $or: getVisibiltyFilter(user, friendIds),
            },
          },
        ],
      },
    });
    if (!comment) {
      throw new NotFoundError("Fail to find matching comment");
    }
    const post = await PostRepository.findOne({
      filter: {
        _id: postId,
        $or: getVisibiltyFilter(user, friendIds),
      },
    });
    if (!post) {
      throw new NotFoundError("Fail to find matching post");
    }
    if (mentions) {
      const validMentions = await Promise.all(
        mentions.map((mention: string) =>
          PostRepository.findById({ id: new Types.ObjectId(mention) }),
        ),
      );
      if (validMentions.length !== mentions.length)
        throw new NotFoundError("One or more mentioned users not found");
    }
    let attachments: string[] = [];
    if (files) {
      attachments = await s3Service.uploadManyFiles({
        files: files as unknown as Express.Multer.File[],
        path: `user-${userId}/posts/post-${post.id}/comments/comment-${comment.id}/replies`,
      });
    }
    const reply = await CommentRepository.create({
      data: {
        userId,
        ...(content && { content }),
        ...(attachments && { attachments }),
        ...(mentions && { mentions: mentions as unknown as Types.ObjectId[] }),
        postId,
        commentId,
      },
    });
    if (!reply) {
      if (attachments) await s3Service.deleteManyFiles(attachments);
      throw new BadRequestError("reply not created");
    }
    return reply.toJSON();
  }

  async getAllComments(post_Id: string) {
    return await CommentRepository.find({
      filter: { postId: new Types.ObjectId(post_Id) },
    });
  }

  async getCommentById(comment_Id: string) {
    return await CommentRepository.findById({
      id: new Types.ObjectId(comment_Id),
    });
  }

  async deleteCommentById(comment_Id: string) {
    return await CommentRepository.findByIdAndDelete({
      id: new Types.ObjectId(comment_Id),
    });
  }
}

export default new CommentService();
