import { NextFunction, Request, Response } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "after" })
export class NotFoundMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction): void {
    if (response.headersSent) {
      return;
    }

    const error = {
      message: "Route Not Found",
      status: 404,
      result: {
        path: request.url,
        method: request.method
      }
    };

    log.fatal(`404 Route Not Found: ${request.method} ${request.url}`);

    response.status(404).json(error);
  }
}
