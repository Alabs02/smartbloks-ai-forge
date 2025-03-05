import { GenericResponse } from "./base.model";
export class ContentTransformerInput {
  html!: string;
  siteName!: string;
  keywords!: string[];
}

export class ContentTransformResult {
  html!: string;
}

export class ContentTransformerOutput extends GenericResponse<ContentTransformResult> {}

export class ImageGenerationContext {
  siteName!: string;
  keywords!: string[];
  altText?: string;
}

export class ImageGenerationPrompt {
  prompt!: string;
  context!: ImageGenerationContext;
}
