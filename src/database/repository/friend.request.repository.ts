import { IFriendRequest } from "@interfaces";
import DBRepository from "./db.repository";
import { friendRequestModel } from "@models";

class FriendRequestRepository extends DBRepository<IFriendRequest> {
  constructor() {
    super(friendRequestModel);
  }
}

export default new FriendRequestRepository();
