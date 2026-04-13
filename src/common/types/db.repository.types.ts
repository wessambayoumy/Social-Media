import type {
  CreateOptions,
  MongooseBaseQueryOptions,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  ReturnsNewDoc,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  mongo,
} from "mongoose";

/**
 * Parameters for create operation (single document)
 */

/**
 * Parameters for create operation (multiple documents)
 */
export interface CreateParams<TRawDoc> {
  data: Partial<TRawDoc[]>;
  options?: CreateOptions;
}

/**
 * Parameters for find operation (lean query)
 */
export interface FindParamsLean<TRawDoc> {
  filter?: QueryFilter<TRawDoc>;
  projection?: ProjectionType<TRawDoc>;
  options?: QueryOptions<TRawDoc> & { lean?: true };
}

/**
 * Parameters for find operation (hydrated query)
 */
export interface FindParamsHydrated<TRawDoc> {
  filter?: QueryFilter<TRawDoc>;
  projection?: ProjectionType<TRawDoc>;
  options?: QueryOptions<TRawDoc> & { lean?: false };
}

/**
 * Parameters for find operation (generic)
 */
export interface FindParams<TRawDoc> {
  filter?: QueryFilter<TRawDoc>;
  projection?: ProjectionType<TRawDoc>;
  options?: QueryOptions<TRawDoc>;
}

/**
 * Parameters for findOne operation (lean query)
 */
export interface FindOneParamsLean<TRawDoc> {
  filter?: QueryFilter<TRawDoc>;
  projection?: ProjectionType<TRawDoc>;
  options?: (QueryOptions<TRawDoc> & { lean?: true }) | null;
}

/**
 * Parameters for findOne operation (hydrated query)
 */
export interface FindOneParamsHydrated<TRawDoc> {
  filter?: QueryFilter<TRawDoc>;
  projection?: ProjectionType<TRawDoc>;
  options?: (QueryOptions<TRawDoc> & { lean?: false }) | null;
}

/**
 * Parameters for findOne operation (generic)
 */
export interface FindOneParams<TRawDoc> {
  filter?: QueryFilter<TRawDoc>;
  projection?: ProjectionType<TRawDoc>;
  options?: QueryOptions<TRawDoc> | null;
}

/**
 * Parameters for findById operation (lean query)
 */
export interface FindByIdParamsLean<TRawDoc> {
  id: Types.ObjectId;
  projection?: ProjectionType<TRawDoc>;
  options?: (QueryOptions<TRawDoc> & { lean?: true }) | null;
}

/**
 * Parameters for findById operation (hydrated query)
 */
export interface FindByIdParamsHydrated<TRawDoc> {
  id: Types.ObjectId;
  projection?: ProjectionType<TRawDoc>;
  options?: (QueryOptions<TRawDoc> & { lean?: false }) | null;
}

/**
 * Parameters for findById operation (generic)
 */
export interface FindByIdParams<TRawDoc> {
  id: Types.ObjectId;
  projection?: ProjectionType<TRawDoc>;
  options?: QueryOptions<TRawDoc> | null;
}

/**
 * Parameters for updateOne operation
 */
export interface UpdateOneParams<TRawDoc> {
  filter: QueryFilter<TRawDoc>;
  update: UpdateQuery<TRawDoc> | UpdateWithAggregationPipeline;
  options?: mongo.UpdateOptions;
}

/**
 * Parameters for updateMany operation
 */
export interface UpdateManyParams<TRawDoc> {
  filter: QueryFilter<TRawDoc>;
  update: UpdateQuery<TRawDoc> | UpdateWithAggregationPipeline;
  options?: mongo.UpdateOptions;
}

/**
 * Parameters for findOneAndUpdate operation
 */
export interface FindOneAndUpdateParams<TRawDoc> {
  filter: QueryFilter<TRawDoc>;
  update: UpdateQuery<TRawDoc>;
  options?: QueryOptions<TRawDoc> & ReturnsNewDoc;
}

/**
 * Parameters for findByIdAndUpdate operation
 */
export interface FindByIdAndUpdateParams<TRawDoc> {
  id: Types.ObjectId;
  update: UpdateQuery<TRawDoc>;
  options?: QueryOptions<TRawDoc> & ReturnsNewDoc;
}

/**
 * Parameters for deleteOne operation
 */
export interface DeleteOneParams<TRawDoc> {
  filter?: QueryFilter<TRawDoc>;
  options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<TRawDoc>) | null;
}

/**
 * Parameters for deleteMany operation
 */
export interface DeleteManyParams<TRawDoc> {
  filter?: QueryFilter<TRawDoc>;
  options?: (mongo.DeleteOptions & MongooseBaseQueryOptions<TRawDoc>) | null;
}

/**
 * Parameters for findOneAndDelete operation
 */
export interface FindOneAndDeleteParams<TRawDoc> {
  filter: QueryFilter<TRawDoc> | null;
  options?: QueryOptions<TRawDoc> | null;
}

/**
 * Parameters for findByIdAndDelete operation
 */
export interface FindByIdAndDeleteParams<TRawDoc> {
  id: Types.ObjectId;
  options?: QueryOptions<TRawDoc> | null;
}
