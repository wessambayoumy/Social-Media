import { hashSync, compareSync } from "bcrypt";
import { env } from "@config";

class HashService {
  hash = (data: string | Buffer<ArrayBufferLike>) =>
    hashSync(data, env.saltRounds);

  compareHash = (plain: string | Buffer<ArrayBufferLike>, hash: string) =>
    compareSync(plain, hash);
}

export default HashService;
