import { Request, RequestHandler } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestError } from "@response";

type ValidationKey = keyof Request;
type ValidationSchema = Partial<Record<ValidationKey, ZodType>>;
type ValidationError = {
  key: ValidationKey;
  issue: ZodError["issues"];
};
export const validationMiddleware = (
  schema: ValidationSchema,
): RequestHandler => {
  return (req, _res, next) => {
    const errors: ValidationError[] = [];

    // if (req.file) req.body.file = req.file;
    // if (req.files) req.body.files = req.files;

    for (const key of Object.keys(schema) as ValidationKey[]) {
      const value = schema[key]?.safeParse(req[key]);
      if (!value?.success) {
        errors.push({
          key,
          issue: value?.error.issues || [],
        });
      }
    }
    if (errors.length > 0)
      throw new BadRequestError("Validation failed", errors);

    next();
  };
};
