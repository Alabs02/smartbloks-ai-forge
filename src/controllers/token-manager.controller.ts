import "reflect-metadata";
import { ROUTES } from "@/routes";
import { TokenManagerDoc } from "@/docs";
import { Request, Response } from "express";
import { GenericResponse } from "@/models";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { JsonController, Get, Req, Res } from "routing-controllers";

@JsonController(ROUTES.TOKEN_MANAGER.BASE)
export class TokenManagerController {
  @Get(ROUTES.TOKEN_MANAGER.AUTHENTICATE)
  @OpenAPI(TokenManagerDoc.authenticateOptions)
  @ResponseSchema(TokenManagerDoc.AuthenticateResponse)
  authenticate(@Req() request: Request, @Res() response: Response): GenericResponse {
    const isSuccessful = true;

    return { message: "Authenticated successfully.", isSuccessful, result: {} };
  }
}
