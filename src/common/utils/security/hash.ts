import { hash, compare } from "bcrypt";
import { env } from "@services";

class HashService {
  hash = async (data: string | Buffer<ArrayBufferLike>) =>
    await hash(data, env.saltRounds);

  compareHash = async (plain: string | Buffer<ArrayBufferLike>, hash: string) =>
    await compare(plain, hash);
}

export default new HashService();
