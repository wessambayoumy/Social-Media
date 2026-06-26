import { Router } from "express";
import { authMiddleware, validationMiddleware } from "@/middleware";
import reactionService from "./reaction.service";
import * as reactionValidation from "./reaction.validation";

const reactionRouter = Router({ mergeParams: true });

reactionRouter.use(authMiddleware);

reactionRouter.post(
  "/likePost",
  validationMiddleware(reactionValidation.reactSchema),
  async (req, res) => {
    const reaction = await reactionService.reactOnPost(req);
    res.json(reaction);
  },
);
reactionRouter.post(
  "/likeComment",
  validationMiddleware(reactionValidation.reactSchema),
  async (req, res) => {
    const reaction = await reactionService.reactOnComment(req);
    res.json(reaction);
  },
);
reactionRouter.post(
  "/likeReply",
  validationMiddleware(reactionValidation.reactSchema),
  async (req, res) => {
    const reaction = await reactionService.reactOnReply(req);
    res.json(reaction);
  },
);
export default reactionRouter;
