import { IReply } from "@interfaces";
import DBRepository from "./db.repository";
import { replyModel } from "@models";

class ReplyRepository extends DBRepository<IReply> {
  constructor() {
    super(replyModel);
  }
}

export default new ReplyRepository();
