import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "class-validator";
import { isDevMode } from "@/utils";

@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: Error, request: Request, response: Response, next: NextFunction): void {
    if (response.headersSent) {
      return next(error);
    }

    log.fatal(`[Error] ${error.message}\n${error.stack}`);

    let statusCode = 500;
    let message = "Internal Server Error";

    if (error instanceof ValidationError) {
      statusCode = 400;
      message = "Validation Error";
    } else if (error.name === "UnauthorizedError") {
      statusCode = 401;
      message = "Unauthorized";
    }

    const errorResponse = {
      message,
      status: statusCode,
      result: {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        ...(isDevMode() && { stack: error.stack })
      }
    };

    response.status(statusCode).json(errorResponse);
  }
}
