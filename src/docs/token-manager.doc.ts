import { IsBoolean, IsObject, IsString } from "class-validator";
export class AuthenticateResponse {
  @IsString()
  message!: string;

  @IsBoolean()
  isSuccessful!: boolean;

  @IsObject()
  result!: Record<string, unknown>;
}

export const TokenManagerDoc = {
  AuthenticateResponse,
  authenticateOptions: {
    summary: "Authenticate User",
    description: "Handles user authentication.",
    tags: ["Authentication"],
    responses: {
      "200": {
        description: "User authenticated successfully",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AuthenticateResponse" }
          }
        }
      }
    }
  }
};
