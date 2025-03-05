import "@/log";
import path from "path";
import "reflect-metadata";
import { config } from "dotenv";
import { isDevMode } from "@/utils";
import { createServer } from "http";
import swaggerUI from "swagger-ui-express";
import { createExpressServer } from "routing-controllers";
import { SERVER, swaggerConfig, swaggerSpecs } from "@/config";
import express, { Request, Response, NextFunction } from "express";
import { BaseController, TokenManagerController } from "@/controllers";
import { CorsMiddleware, ErrorHandlerMiddleware, LoggingMiddleware, NotFoundMiddleware } from "@/middlewares";

config();

export const app = createExpressServer({
  routePrefix: `/api/${SERVER.SERVICE_VERSION}`,
  development: isDevMode(),
  defaultErrorHandler: false,
  controllers: [BaseController, TokenManagerController],
  middlewares: [CorsMiddleware, LoggingMiddleware, NotFoundMiddleware]
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use(`/docs/${SERVER.SERVICE_VERSION}`, swaggerUI.serve, swaggerUI.setup(swaggerSpecs.v1, swaggerConfig));
app.get(`/api-docs/${SERVER.SERVICE_VERSION}.json`, (req: Request, res: Response) => res.json(swaggerSpecs.v1));

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  new ErrorHandlerMiddleware().error(error, request, response, next);
});

let server: ReturnType<typeof createServer>;

export const main = () => {
  server = createServer(app);

  server.listen(SERVER.PORT, () => {
    divider();
    log.info(`SmartBloks AI-Forge Server Running: ${SERVER.BASE_URL}`);
    log.info(`Swagger Docs Available At: ${SERVER.DOCS_URL}`);
    divider();
  });
};

export const shutdown = (cb: () => void) => {
  if (server) {
    server.close(() => {
      log.info("Server has been shut down.");
      cb();
    });
  } else {
    cb();
  }
};

main();
