import { HydratedDocument } from "mongoose";

export interface PaginationReturn<TRawDoc> {
  docs: HydratedDocument<TRawDoc>[];
  total?: number;
  page: number;
  limit: number;
}
