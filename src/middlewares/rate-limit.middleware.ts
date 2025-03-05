import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

@Middleware({ type: "before" })
export class RateLimitMiddleware implements ExpressMiddlewareInterface {
  private rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: "Too many requests, please try again later.", isSSucceful: false, result: {} },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => req.ip || req.socket.remoteAddress || "unknown"
  });

  use(req: Request, res: Response, next: NextFunction): void {
    this.rateLimiter(req, res, next);
  }
}
