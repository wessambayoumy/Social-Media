import { IFriendship } from "@interfaces";
import DBRepository from "./db.repository";
import { friendshipModel } from "@models";

class FriendshipRepository extends DBRepository<IFriendship> {
  constructor() {
    super(friendshipModel);
  }
}

export default new FriendshipRepository();
