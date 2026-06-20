import { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { cacheService, env } from "@services";
import { JwtService } from "@security";
import { IAuthSocket, JwtDetails } from "@interfaces";
import { chatGateway } from "@chat";

class SocketGateway {
  io!: Server;

  async authenticateSocket(socket: Socket, next: Function) {
    try {
      const authSocket = socket as IAuthSocket;
      const token: string =
        authSocket.handshake.auth["token"] ||
        authSocket.handshake.headers["token"]; //remove on production
      const decodedToken = JwtService.decode(token) as JwtDetails;
      await cacheService.addSocket(
        decodedToken.userId.toString(),
        authSocket.id,
      );
      authSocket.decoded = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  }

  async connectionHandler(socket: Socket) {
    const authSocket = socket as IAuthSocket;
    const connections = await cacheService.getSockets(
      authSocket.decoded.userId.toString(),
    );
    chatGateway.registerEvents(this.io, authSocket);
    console.log("A user connected", { connections });
    console.log("Socket ID:", authSocket.id);
    authSocket.on("disconnect", () =>
      this.socketDisconnectionHandler(authSocket),
    );
  }

  async socketDisconnectionHandler(socket: Socket) {
    const authSocket = socket as IAuthSocket;
    await cacheService.removeSocket(
      authSocket.decoded.userId.toString(),
      authSocket.id,
    );
    const connections = await cacheService.getSockets(
      authSocket.decoded.userId.toString(),
    );
    if (connections.length < 1)
      authSocket.broadcast.emit("userOffline", () => {
        console.log(`User ${authSocket.decoded.userId} is offline`);
      });
    console.log("A user disconnected");
    console.log("Socket ID:", authSocket.id);
  }

  initIO(httpServer: httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: env.corsOrigins,
      },
    });
    this.io.use(this.authenticateSocket);
    this.io.on("connection", this.connectionHandler);
  }
}
export default new SocketGateway();
