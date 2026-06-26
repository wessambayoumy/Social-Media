import { BadRequestError, NotFoundError, UnAuthorizedError } from "@response";
import { Types } from "mongoose";
import {
  FriendRequestRepository,
  UserRepository,
  FriendshipRepository,
} from "@repository";
import { notificationService } from "@services";
import { friendRequestStatusEnum } from "@enums";
import { Request } from "express";

class FriendRequestService {
  async sendRequest(req: Request) {
    const { receiver } = req.body;

    const receiverUser = await UserRepository.findById({
      id: new Types.ObjectId(receiver),
    });
    if (!receiverUser) throw new NotFoundError("receiver user not found");

    const exists = await FriendRequestRepository.findOne({
      filter: {
        $or: [
          { sender: req.userId, receiver },
          { sender: receiver, receiver: req.userId },
        ],
      },
    });
    if (exists) throw new BadRequestError("friend request already exists");

    const alreadyFriends = await FriendshipRepository.findOne({
      filter: {
        $or: [
          { userA: req.userId, userB: receiver },
          { userA: receiver, userB: req.userId },
        ],
      },
    });
    if (alreadyFriends) throw new BadRequestError("you are already friends");

    const data = await FriendRequestRepository.create({
      data: { sender: req.userId, receiver },
    });

    await notificationService.sendOneNotification({
      token: receiverUser.id,
      data: {
        title: "Social Media App",
        body: "You have a new friend request",
      },
    });
    return data;
  }

  async processRequest(req: Request) {
    const { requestId } = req.params;
    const { status } = req.body as { status: number };

    const request = await FriendRequestRepository.findById({
      id: new Types.ObjectId(requestId),
    });
    if (!request) throw new NotFoundError("request not found");
    if (request.receiver.toString() !== req.userId.toString())
      throw new UnAuthorizedError("you are not the receiver of this request");

    request.status = status;
    await request.save();

    let friendship = null;
    if (status === friendRequestStatusEnum.accepted) {
      friendship = await FriendshipRepository.create({
        data: { userA: req.userId, userB: request.sender },
      });

      await notificationService.sendOneNotification({
        token: request.sender.toString(),
        data: {
          title: "Social Media App",
          body: "Your friend request was accepted",
        },
      });
    }
    return friendship ?? request;
  }

  async getReceivedRequests(req: Request) {
    return await FriendRequestRepository.find({
      filter: { receiver: req.userId, status: friendRequestStatusEnum.pending },
    });
  }

  async getSentRequests(req: Request) {
    return await FriendRequestRepository.find({
      filter: { sender: req.userId, status: friendRequestStatusEnum.pending },
    });
  }

  async getFriends(req: Request) {
    return await FriendshipRepository.find({
      filter: {
        $or: [{ userA: req.userId }, { userB: req.userId }],
      },
    });
  }

  async removeFriend(req: Request) {
    const { target } = req.params;
    const friendship = await FriendshipRepository.findOne({
      filter: {
        $or: [
          { userA: req.userId, userB: target },
          { userA: target, userB: req.userId },
        ],
      },
    });
    if (!friendship) throw new BadRequestError("you are not friends");

    await friendship.deleteOne();
    return "done";
  }

  async cancelRequest(req: Request) {
    const { requestId } = req.params;
    const request = await FriendRequestRepository.findOne({
      filter: {
        _id: new Types.ObjectId(requestId),
        sender: req.userId,
      },
    });
    if (!request) throw new NotFoundError("request not found");

    await request.deleteOne();
    return "done";
  }
}

export default new FriendRequestService();
