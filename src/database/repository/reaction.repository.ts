import { IReaction } from "@interfaces";
import DBRepository from "./db.repository";
import { reactionModel } from "@models";

class ReactionRepository extends DBRepository<IReaction> {
  constructor() {
    super(reactionModel);
  }
}

export default new ReactionRepository();
