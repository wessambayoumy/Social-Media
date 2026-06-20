import { PostRepository, UserRepository } from "@repository";
import { Types } from "mongoose";
import * as PostDto from "./post.dto";
import { getVisibiltyFilter } from "@filters";
import { IPost } from "@interfaces";
import { BadRequestError, NotFoundError } from "@response";
import { s3Service } from "@services";

class PostService {
  async getAllPosts(
    userId: Types.ObjectId,
    { limit = 10, page = 1, search }: PostDto.getPostsDto,
  ) {
    const user = await UserRepository.findById({ id: userId });
    return await PostRepository.paginate({
      filter: {
        $or: getVisibiltyFilter(user),
        ...(search && { content: { $regex: search, $options: "i" } }),
      },
      page,
      limit,
    });
  }
  async getPostById(id: Types.ObjectId) {
    return PostRepository.findById({ id });
  }
  async createPost(
    { content, files, visibility, mentions }: PostDto.createPostDto,
    userId: Types.ObjectId,
  ): Promise<IPost> {
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
        path: `posts/user-${userId}`,
      });
    }
    const post = await PostRepository.create({
      data: {
        userId,
        ...(content && { content }),
        ...(attachments && { attachments }),
        ...(visibility && { visibility }),
        ...(mentions && { mentions: mentions as unknown as Types.ObjectId[] }),
      },
    });
    if (!post) {
      if (attachments) await s3Service.deleteManyFiles(attachments);
      throw new BadRequestError("Post not created");
    }
    return post.toJSON();
  }

  async updatePost(id: Types.ObjectId, post: any) {
    return PostRepository.findByIdAndUpdate({ id, update: post });
  }
  async deleteAllPosts(userId: Types.ObjectId) {
    return PostRepository.deleteMany({ filter: { id: userId } });
  }
  async deletePostById(id: Types.ObjectId) {
    return PostRepository.findByIdAndDelete({ id });
  }
}

export default new PostService();
