import { IsBoolean, IsObject, IsString } from "class-validator";

export class HealthCheckResponse {
  @IsString()
  message!: string;

  @IsBoolean()
  isSuccessful!: boolean;

  @IsObject()
  result!: {
    serviceName: string;
    description: string;
    version: string;
  };
}

export const BaseDoc = {
  HealthCheckResponse,
  healthCheckOptions: {
    summary: "Health Check",
    description: "Checks if the API is running",
    tags: ["System"],
    responses: {
      "200": {
        description: "Service is up",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/HealthCheckResponse" }
          }
        }
      }
    }
  }
};
