import { Server } from "socket.io";
import chatService from "./chat.service.js";
import { IAuthSocket } from "@interfaces";
import { cacheService } from "@services";
import { Types } from "mongoose";

class ChatEvent {
  async sendMessage(io: Server, socket: IAuthSocket) {
    return socket.on(
      "sendMessage",
      async ({
        content,
        attachments,
        mentions,
        sendTo,
      }: {
        sendTo: string;
        content: string;
        attachments: string[];
        mentions: Types.ObjectId[];
      }) => {
        try {
          await chatService.sendMessage(
            { content, attachments, mentions, sendTo },
            socket.data.user,
          );
          io.to(await cacheService.getSockets(socket.data.userId)).emit(
            "successMessage",
            { content, sendTo },
          );
          const receiverSocketIds = await cacheService.getSockets(sendTo);
          if (receiverSocketIds.length)
            socket
              .to(receiverSocketIds)
              .emit("newMessage", { content, attachments, mentions, sendTo });
        } catch (error) {
          console.log({ error });
          socket.emit("custom_error", error);
        }
      },
    );
  }
  async sendGroupMessage(io: Server, socket: IAuthSocket) {
    return socket.on(
      "sendGroupMessage",
      async ({
        content,
        attachments,
        mentions,
        chatId,
      }: {
        chatId: string;
        content: string;
        attachments: string[];
        mentions: Types.ObjectId[];
      }) => {
        try {
          const chat_Id = await chatService.sendGroupMessage(
            { content, attachments, mentions, chatId },
            socket.data.user,
          );
          io.to(await cacheService.getSockets(socket.data.userId)).emit(
            "successMessage",
            { content, sendTo: chatId },
          );
          socket
            .to(chatId)
            .emit("newMessage", { content, attachments, mentions, chat_Id });
        } catch (error) {
          console.log({ error });
          socket.emit("custom_error", error);
        }
      },
    );
  }

  joinRoom = (socket: IAuthSocket) => {
    return socket.on("joinRoom", async ({ roomId }: { roomId: string }) => {
      try {
        socket.join(roomId);
      } catch (error) {
        console.log({ error });
        socket.emit("custom_error", error);
      }
    });
  };
}

export default new ChatEvent();
