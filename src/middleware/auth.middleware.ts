import { RequestHandler } from "express";
import { UnAuthorizedError } from "@response";
import { JwtDetails } from "@interfaces";
import { JwtService } from "@security";
import { env, CacheService } from "@services";
import { roleEnum } from "@enums";
import { Secret } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserRepository } from "@repository";

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    throw new UnAuthorizedError("Token is required");

  const token = authHeader.split(" ")[1] as string;

  const decoded = JwtService.decode(token) as JwtDetails;

  let signature: Secret = "";
  if (decoded?.role === roleEnum.admin) signature = env.jwtAdminSecretAccess;
  else signature = env.jwtUserSecretAccess;

  const payload = JwtService.verifyToken<JwtDetails>(token, signature);

  const user = await UserRepository.findById({ id: payload.userId });
  if (!user) throw new UnAuthorizedError("User doesn't exist");

  if (!Types.ObjectId.isValid(payload.userId))
    throw new UnAuthorizedError("Invalid token payload");

  if (
    user.signOutDate?.getTime() > decoded.iat! * 1000 ||
    (await CacheService.get(`revokeId:${decoded.jti}`))
  )
    throw new UnAuthorizedError("Token Revoked");

  req.userId = user._id;
  req.role = user.role;
  req.token = token;

  next();
};
