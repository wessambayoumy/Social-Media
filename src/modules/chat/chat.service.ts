import { NotFoundError } from "@response";
import { Types } from "mongoose";
import { IChat } from "@interfaces";
import { ChatRepository, UserRepository } from "@repository";
import { ChatTypeEnum } from "@enums";
import { PaginationReturn } from "@types";
import { s3Service } from "@services";
class ChatService {
  async getChat(
    participantId: string,
    userId: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<PaginationReturn<IChat>> {
    const chat = await ChatRepository.findChat({
      filter: {
        members: { $all: [userId, new Types.ObjectId(participantId)] },
      },
      options: {
        populate: [{ path: "members" }],
      },
      page,
      limit,
    });
    if (!chat) throw new NotFoundError("Fail to find Matching Conversation");

    return chat;
  }
  async sendMessage(
    {
      content,
      attachments,
      mentions,
      sendTo,
    }: {
      content: string;
      attachments: string[];
      mentions: Types.ObjectId[];
      sendTo: string;
    },
    userId: Types.ObjectId,
  ) {
    let chat = await ChatRepository.findOneAndUpdate({
      filter: {
        members: { $all: [userId, new Types.ObjectId(sendTo)] },
        type: ChatTypeEnum.private,
      },
      update: {
        $addToSet: {
          messages: {
            content,
            attachments,
            sender: userId,
            createdBy: userId,
            mentions,
          },
        },
      },
    });
    chat ??
      (await ChatRepository.create({
        data: {
          members: [userId, new Types.ObjectId(sendTo)],
          createdBy: userId,
          type: ChatTypeEnum.private,
          messages: [
            {
              content,
              sender: userId,
              attachments: attachments || [],
              reactions: [],
              mentions: mentions || [],
              createdAt: new Date(),
            },
          ],
        },
      }));
  }
  async createGroup(
    {
      membersIds,
      groupName,
      chatId,
    }: { membersIds: Types.ObjectId[]; groupName: string; chatId: string },
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ): Promise<IChat> {
    membersIds = [...new Set(membersIds), userId];
    const users = await UserRepository.find({
      filter: { _id: { $in: membersIds }, friends: userId },
    });

    if (users.length !== membersIds.length)
      throw new NotFoundError("One or more members not found or not a friend");
    if (file)
      await s3Service.uploadOneFile({
        file,
        path: `chat/group/${groupName}-${chatId}/groupMainImage`,
      });

    const chat = await ChatRepository.create({
      data: {
        members: membersIds,
        createdBy: userId,
        type: ChatTypeEnum.group,
        groupName,
        groupImage: file ? file.path : "",
        chatId,
      },
    });
    return chat.toJSON();
  }
  async getGroupChat(
    chatId: string,
    userId: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<PaginationReturn<IChat>> {
    const chat = await ChatRepository.findChat({
      filter: {
        chatId,
        members: { $in: [userId] },
        type: ChatTypeEnum.group,
      },
      options: {
        populate: [{ path: "members" }, { path: "messages.createdBy" }],
      },
      page,
      limit,
    });
    if (!chat) throw new NotFoundError("Fail to find Matching Conversation");

    return chat;
  }

  async sendGroupMessage(
    {
      content,
      attachments,
      mentions,
      chatId,
    }: {
      content: string;
      attachments: string[];
      mentions: Types.ObjectId[];
      chatId: string;
    },
    userId: Types.ObjectId,
  ) {
    let chat = await ChatRepository.findOneAndUpdate({
      filter: {
        chatId,
        members: { $in: [userId] },
        type: ChatTypeEnum.group,
      },
      update: {
        $addToSet: {
          messages: {
            content,
            attachments,
            sender: userId,
            createdBy: userId,
            mentions,
          },
        },
      },
    });
    if (!chat) throw new NotFoundError("Fail to find Matching Conversation");
    return chat.chatId;
  }
}

export default new ChatService();
