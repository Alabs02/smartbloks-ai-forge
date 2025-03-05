import cors from "cors";
import { corsConfig } from "@/config";
import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "before" })
export class CorsMiddleware implements ExpressMiddlewareInterface {
  private corsHandler: ReturnType<typeof cors>;

  constructor() {
    this.corsHandler = cors(corsConfig);
  }

  use(request: Request, response: Response, next: NextFunction): void {
    this.corsHandler(request, response, next);
  }
}
