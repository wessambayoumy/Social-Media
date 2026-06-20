import { IChat } from "@interfaces";
import DBRepository from "./db.repository";
import { chatModel } from "@models";
import { FindParams, PaginationReturn } from "@types";

class ChatRepository extends DBRepository<IChat> {
  constructor() {
    super(chatModel);
  }
  async findChat({
    filter,
    options = {},
    page = 0,
    limit = 10,
  }: FindParams<IChat> & { page: number; limit: number }): Promise<
    PaginationReturn<IChat>
  > {
    if (page > 1) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    const docs = await this.model.find(
      filter,
      { messages: { $slice: [-(limit * page), limit] } },
      options,
    );
    return {
      docs,
      page,
      limit,
    };
  }
}

export default new ChatRepository();
