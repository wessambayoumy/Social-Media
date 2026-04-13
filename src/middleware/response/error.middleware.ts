import { ErrorRequestHandler } from "express";

class AppError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 400);
    this.cause = cause;
  }
}
export class UnAuthorizedError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 401);
    this.cause = cause;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 404);
    this.cause = cause;
  }
}
export class ConflictError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 409);
    this.cause = cause;
  }
}
export class InternalServerError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 500);
    this.cause = cause;
  }
}

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let status = err instanceof AppError ? err.statusCode : 500;
  let message = err instanceof AppError ? err.message : "Internal Server Error";
  res.status(status).json({
    error: message,
    stack:process.env["NODE_ENV"] === "prod" ? undefined : err.stack,
    cause: err.cause,
  });
};
