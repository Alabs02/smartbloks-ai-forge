import { ROUTES } from "@/routes";
import { ContentTransformerDoc } from "@/docs";
import { ContentTransformerService, LLMService } from "@/services";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { ContentTransformerInput, ContentTransformerOutput, GenericResponse } from "@/models";
import { Post, Body, BadRequestError, JsonController } from "routing-controllers";

@JsonController(ROUTES.CONTENT_TRANSFORMER.BASE)
export class ContentTransformerController {
  private llmService = new LLMService();
  private contentTransformerService = new ContentTransformerService(this.llmService);

  @Post(ROUTES.CONTENT_TRANSFORMER.TRANSFORM)
  @OpenAPI(ContentTransformerDoc.transformOptions)
  @ResponseSchema(ContentTransformerDoc.ContentTransformerResponse)
  async transformContent(@Body() input: ContentTransformerInput): Promise<ContentTransformerOutput> {
    const validationErrors = this.validateInput(input);

    if (validationErrors.errors.length > 0) {
      let errorObj = new BadRequestError("Validation Failed");
      (errorObj as any) = validationErrors;
      throw errorObj;
    }

    return await this.contentTransformerService.transformContent(input);
  }

  private validateInput(input: any): GenericResponse & { errors: string[] } {
    const errors: string[] = [];

    if (!input.html || typeof input.html !== "string" || input.html.length < 20 || input.html.length > 1500) {
      errors.push("html must be a string between 20 and 1500 characters.");
    }

    if (!input.siteName || typeof input.siteName !== "string" || input.siteName.length < 3 || input.siteName.length > 40) {
      errors.push("siteName must be a string between 3 and 40 characters.");
    }

    if (!Array.isArray(input.keywords)) {
      errors.push("keywords must be an array of strings.");
    } else {
      if (input.keywords.length < 3) {
        errors.push("keywords must contain at least 3 items.");
      }
      if (input.keywords.length > 10) {
        errors.push("keywords cannot exceed 10 items.");
      }
      if (input.keywords.some((k: string) => typeof k !== "string" || k.trim().length < 1 || k.length > 20)) {
        errors.push("Each keyword must be a non-empty string between 1 and 20 characters.");
      }
    }

    return {
      message: "Validation Error.",
      isSuccessful: false,
      result: {},
      errors
    };
  }
}
