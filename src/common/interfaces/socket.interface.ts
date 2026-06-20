import { Socket } from "socket.io";
import { JwtDetails } from "./jwt.interface.js";

export interface IAuthSocket extends Socket {
  decoded: JwtDetails;
}
