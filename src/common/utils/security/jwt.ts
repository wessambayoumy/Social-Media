import {
  Secret,
  sign,
  verify,
  SignOptions,
  VerifyOptions,
  decode,
  DecodeOptions,
} from "jsonwebtoken";
import { env } from "@services";
import { v4 } from "uuid";
import { JwtDetails } from "@interfaces";

class JwtService {
  signToken = (
    payload: JwtDetails,
    secret: Secret,
    options?: SignOptions,
  ): string =>
    sign(payload, secret, {
      ...options,
      jwtid: v4(),
      issuer: env.jwtIssuer,
    });

  verifyToken = <T = JwtDetails>(
    token: string,
    secret: Secret,
    options?: VerifyOptions,
  ): T => verify(token, secret, options) as T;

  decode = (token: string, options?: DecodeOptions): JwtDetails | null =>
    decode(token, options) as JwtDetails | null;
}

export default new JwtService();
