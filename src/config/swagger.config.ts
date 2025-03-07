import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { SERVER } from "./server.config";
import { isDevMode } from "@/utils";
import { SwaggerUiOptions } from "swagger-ui-express";
import { BaseController, ContentTransformerController, TokenManagerController } from "@/controllers";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

const generateSwaggerSpec = (version: string) => {
  return routingControllersToSpec(
    getMetadataArgsStorage(),
    {
      controllers: [BaseController, TokenManagerController, ContentTransformerController]
    },
    {
      openapi: "3.0.0",
      info: {
        title: `${SERVER.SERVICE_NAME}`,
        version,
        description: `${SERVER.SERVICE_DESCRIPTION} - Version ${version}`,
        contact: {
          name: "SmartBloks Team",
          url: "https://smartbloks.ai",
          email: "support@smartbloks.ai"
        }
      },
      servers: isDevMode()
        ? [
            {
              url: `http://${SERVER.HOSTNAME}:${SERVER.PORT}/api/${version}`,
              description: `Local Development Server - ${version}`
            }
          ]
        : [
            {
              url: `https://smartbloks-ai-forge.up.railway.app/api/${version}`,
              description: `Production Server - ${version}`
            }
          ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        },
        schemas: validationMetadatasToSchemas()
      },
      security: [{ bearerAuth: [] }]
    }
  );
};

export const swaggerSpecs = {
  [SERVER.SERVICE_VERSION]: generateSwaggerSpec(SERVER.SERVICE_VERSION)
};

export const swaggerConfig: SwaggerUiOptions = {
  customSiteTitle: "SmartBloks AI-Forge API Docs",
  customfavIcon: "https://smartbloks.ai/favicon.png",
  customCssUrl: "/swagger.css"
};
