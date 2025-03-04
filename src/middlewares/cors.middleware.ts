import cors, { CorsOptions } from "cors";
import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "before" })
export class CorsMiddleware implements ExpressMiddlewareInterface {
  private corsHandler: ReturnType<typeof cors>;

  constructor() {
    const corsOptions: CorsOptions = {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    };

    this.corsHandler = cors(corsOptions);
  }

  use(request: Request, response: Response, next: NextFunction): void {
    this.corsHandler(request, response, next);
  }
}
