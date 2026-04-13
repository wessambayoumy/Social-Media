import { RequestHandler } from "express";

export const successResponseInterceptor: RequestHandler = (_req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (payload) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const { message, ...rest } = payload ?? {};

      const response = {
        Success: true,
        message: message ?? "Request executed successfully",
        ...rest,
      };

      return originalJson(response);
    }

    return originalJson(payload);
  };

  next();
};
