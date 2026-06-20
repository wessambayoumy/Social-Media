import { IComment } from "@interfaces";
import DBRepository from "./db.repository";
import { commentModel } from "@models";

class CommentRepository extends DBRepository<IComment> {
  constructor() {
    super(commentModel);
  }
}

export default new CommentRepository();
