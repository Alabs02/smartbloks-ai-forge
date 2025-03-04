import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "before" })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();

    log.info(`[Request] ${request.method} ${request.url} from ${request.ip} - Body: ${JSON.stringify(request.body)}`);

    response.on("finish", () => {
      const responseTime = Date.now() - startTime;
      log.info(`[Response] ${request.method} ${request.url} - Status: ${response.statusCode} - Time: ${responseTime}ms`);
    });

    response.on("close", () => {
      if (!response.writableEnded) {
        log.error(`[Response Interrupted] ${request.method} ${request.url} - Client disconnected before response could be sent`);
      }
    });

    next();
  }
}
