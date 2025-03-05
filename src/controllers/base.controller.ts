import "reflect-metadata";
import { ROUTES } from "@/routes";
import { SERVER } from "@/config";
import { BaseDoc } from "@/docs";
import { Request, Response } from "express";
import { GenericResponse } from "@/models";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { JsonController, Get, Req, Res } from "routing-controllers";

@JsonController()
export class BaseController {
  @Get(ROUTES.BASE.ROOT)
  @Get(ROUTES.BASE.HEALTH_CHECK)
  @OpenAPI(BaseDoc.healthCheckOptions)
  @ResponseSchema(BaseDoc.HealthCheckResponse)
  healthCheck(@Req() request: Request, @Res() response: Response): GenericResponse {
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
