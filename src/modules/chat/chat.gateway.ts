import { Server } from "socket.io";
import chatEvent from "./chat.event";
import { IAuthSocket } from "@interfaces";

class ChatGateway {
  registerEvents(io: Server, socket: IAuthSocket) {
    chatEvent.sendMessage(io, socket);
    chatEvent.sendGroupMessage(io, socket);
  }
}

export default new ChatGateway();
