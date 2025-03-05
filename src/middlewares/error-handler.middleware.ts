import { BadRequestError, ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
import { Request, Response, NextFunction } from "express";
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
    let errorResponse: any = {
      message,
      status: statusCode,
      result: {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        ...(isDevMode() && { stack: error.stack })
      }
    };

    if (error instanceof BadRequestError && (error as any).errors) {
      statusCode = 400;
      errorResponse = { errors: (error as any).errors }; // Return expected error format
    } else if (error.name === "UnauthorizedError") {
      statusCode = 401;
      message = "Unauthorized";
    }

    response.status(statusCode).json(errorResponse);
  }
}
