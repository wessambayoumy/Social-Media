import { IPost } from "@interfaces";
import DBRepository from "./db.repository";
import { postModel } from "@models";
import { FindParams, PaginationReturn } from "@types";

class PostRepository extends DBRepository<IPost> {
  constructor() {
    super(postModel);
  }
  async paginate({
    filter,
    projection,
    options = {},
    page = 0,
    limit = 10,
  }: FindParams<IPost> & { page: number; limit: number }): Promise<
    PaginationReturn<IPost>
  > {
    let count = -1;
    if (page > 1) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    count = await this.model.countDocuments(filter);
    const docs = await this.model.find(filter, projection, options);
    return {
      docs,
      page,
      limit,
      total: Math.ceil(count / limit),
    };
  }
}

export default new PostRepository();
