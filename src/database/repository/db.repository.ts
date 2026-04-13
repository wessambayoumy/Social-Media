import type {
  DeleteResult,
  FlattenMaps,
  HydratedDocument,
  Model,
  PopulateOptions,
  UpdateResult,
} from "mongoose";
import type {
  FindParamsLean,
  FindParamsHydrated,
  FindParams,
  FindOneParamsLean,
  FindOneParamsHydrated,
  FindOneParams,
  FindByIdParamsLean,
  FindByIdParamsHydrated,
  FindByIdParams,
  UpdateOneParams,
  UpdateManyParams,
  FindOneAndUpdateParams,
  FindByIdAndUpdateParams,
  DeleteOneParams,
  DeleteManyParams,
  FindOneAndDeleteParams,
  FindByIdAndDeleteParams,
  CreateParams,
} from "@types";

abstract class DBRepository<TRawDoc> {
  constructor(public model: Model<TRawDoc>) {}

  async create(
    params: CreateParams<TRawDoc>,
  ): Promise<HydratedDocument<TRawDoc>>;

  async create(
    params: CreateParams<TRawDoc>,
  ): Promise<HydratedDocument<TRawDoc>[]>;

  async create({
    data,
    options,
  }: CreateParams<TRawDoc>): Promise<
    HydratedDocument<TRawDoc>[] | HydratedDocument<TRawDoc>
  > {
    if (Array.isArray(data))
      return await this.model.create(data as any, options);

    return await this.model.create(data as any);
  }

  async find(
    params: FindParamsLean<TRawDoc>,
  ): Promise<FlattenMaps<TRawDoc> | null>;
  async find(
    params: FindParamsHydrated<TRawDoc>,
  ): Promise<HydratedDocument<TRawDoc> | null>;

  async find({
    filter,
    projection,
    options,
  }: FindParams<TRawDoc>): Promise<any> {
    const doc = this.model.find(filter, projection, options);
    if (options?.populate) doc.populate(options.populate as PopulateOptions[]);
    if (options?.lean) doc.lean(options.lean);
    if (options!["select"]) doc.select(options!["select"]);
    return await doc.exec();
  }

  async findOne(
    params: FindOneParamsLean<TRawDoc>,
  ): Promise<HydratedDocument<TRawDoc> | null>;

  async findOne(
    params: FindOneParamsHydrated<TRawDoc>,
  ): Promise<FlattenMaps<TRawDoc> | null>;

  async findOne({
    filter,
    projection,
    options,
  }: FindOneParams<TRawDoc>): Promise<any> {
    const doc = this.model.findOne(filter, projection, options);
    if (options?.populate) doc.populate(options.populate as PopulateOptions[]);
    if (options?.lean) doc.lean(options.lean);
    if (options!["select"]) doc.select(options!["select"]);
    return await doc;
  }

  async findById(
    params: FindByIdParamsLean<TRawDoc>,
  ): Promise<HydratedDocument<TRawDoc>>;
  async findById(
    params: FindByIdParamsHydrated<TRawDoc>,
  ): Promise<FlattenMaps<TRawDoc>>;
  async findById({
    id,
    projection,
    options,
  }: FindByIdParams<TRawDoc>): Promise<any> {
    const doc = this.model.findById(id, projection, options);
    if (options?.populate) doc.populate(options.populate as PopulateOptions[]);
    if (options?.lean) doc.lean(options.lean);
    if (options!["select"]) doc.select(options!["select"]);
    return await doc.exec();
  }

  async updateOne({
    filter,
    update,
    options,
  }: UpdateOneParams<TRawDoc>): Promise<UpdateResult> {
    return await this.model.updateOne(filter, update, options);
  }
  async updateMany({
    filter,
    update,
    options,
  }: UpdateManyParams<TRawDoc>): Promise<UpdateResult> {
    return await this.model.updateMany(filter, update, options);
  }

  async findOneAndUpdate({
    filter,
    update = { new: true },
    options,
  }: FindOneAndUpdateParams<TRawDoc>): Promise<HydratedDocument<TRawDoc> | null> {
    return await this.model.findOneAndUpdate(filter, update, options);
  }
  async findByIdAndUpdate({
    id,
    update = { new: true },
    options,
  }: FindByIdAndUpdateParams<TRawDoc>): Promise<HydratedDocument<TRawDoc> | null> {
    return await this.model.findByIdAndUpdate(id, update, options);
  }

  async deleteOne({
    filter,
    options,
  }: DeleteOneParams<TRawDoc>): Promise<DeleteResult> {
    return await this.model.deleteOne(filter, options);
  }
  async deleteMany({
    filter,
    options,
  }: DeleteManyParams<TRawDoc>): Promise<DeleteResult> {
    return await this.model.deleteMany(filter, options);
  }

  async findOneAndDelete({
    filter,
    options,
  }: FindOneAndDeleteParams<TRawDoc>): Promise<HydratedDocument<TRawDoc> | null> {
    return await this.model.findOneAndDelete(filter, options);
  }

  async findByIdAndDelete({
    id,
    options,
  }: FindByIdAndDeleteParams<TRawDoc>): Promise<HydratedDocument<TRawDoc> | null> {
    return await this.model.findByIdAndDelete(id, options);
  }
}

export default DBRepository;
