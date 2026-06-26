import { Router, Request, Response } from "express";
import { authMiddleware, validationMiddleware } from "@/middleware";
import friendRequestService from "./friend.request.service.js";
import * as friendRequestValidation from "./friend.request.validation";

const friendRequestRouter = Router();
friendRequestRouter.use(authMiddleware);

friendRequestRouter.post(
  "/",
  validationMiddleware(friendRequestValidation.sendRequestSchema),
  async (req: Request, res: Response) => {
    const result = await friendRequestService.sendRequest(req);
    return res.json({ message: "Friend request sent", result });
  },
);

friendRequestRouter.put(
  "/:requestId",
  validationMiddleware(friendRequestValidation.processRequestSchema),
  async (req: Request, res: Response) => {
    const result = await friendRequestService.processRequest(req);
    return res.json({ message: `Friend request ${req.body.status}`, result });
  },
);

friendRequestRouter.get("/", async (req: Request, res: Response) => {
  const result = await friendRequestService.getReceivedRequests(req);
  return res.json({ message: "Received friend requests", result });
});

friendRequestRouter.get("/sent", async (req: Request, res: Response) => {
  const result = await friendRequestService.getSentRequests(req);
  return res.json({ message: "Sent friend requests", result });
});

friendRequestRouter.get("/friends", async (req: Request, res: Response) => {
  const result = await friendRequestService.getFriends(req);
  return res.json({ message: "Friends list", result });
});

friendRequestRouter.delete("/:target", async (req: Request, res: Response) => {
  const result = await friendRequestService.removeFriend(req);
  return res.json({ message: "Friend removed", result });
});

friendRequestRouter.delete(
  "/cancel/:requestId",
  async (req: Request, res: Response) => {
    const result = await friendRequestService.cancelRequest(req);
    return res.json({ message: "Friend request canceled", result });
  },
);

export default friendRequestRouter;
