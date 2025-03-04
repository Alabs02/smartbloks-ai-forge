import "reflect-metadata";
import { ROUTES } from "@/routes";
import { Request, Response } from "express";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { JsonController, Get, Req, Res } from "routing-controllers";
import { SERVER } from "@/config";
import { BaseDoc } from "@/docs";

@JsonController()
export class BaseController {
  @Get(ROUTES.BASE.ROOT)
  @Get(ROUTES.BASE.HEALTH_CHECK)
  @OpenAPI(BaseDoc.healthCheckOptions)
  @ResponseSchema(BaseDoc.HealthCheckResponse)
  healthCheck(@Req() request: Request, @Res() response: Response): { message: string; isSuccessful: boolean; result: Record<string, unknown> } {
    const isSuccessful = true;

    return {
      message: "Service is up",
      isSuccessful,
      result: {
        serviceName: SERVER.SERVICE_NAME,
        description: SERVER.SERVICE_DESCRIPTION,
        version: SERVER.SERVICE_VERSION
      }
    };
  }
}
