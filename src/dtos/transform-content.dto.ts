import { IsString, IsArray, MinLength, MaxLength } from "class-validator";

export class TransformContentDto {
  @IsString()
  @MinLength(20)
  @MaxLength(1500)
  html!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(40)
  siteName!: string;

  @IsArray()
  @MaxLength(10, { each: true }) // Limit 10 items
  @MinLength(1, { each: true }) // Each keyword must be at least 1 char
  @MaxLength(20, { each: true }) // Each keyword max 20 chars
  keywords!: string[];

  static validateInput(input: TransformContentDto): string[] {
    const errors: string[] = [];

    if (!input.html || input.html.length < 20 || input.html.length > 1500) {
      errors.push("HTML content must be between 20 and 1500 characters.");
    }

    if (!input.siteName || input.siteName.length < 3 || input.siteName.length > 40) {
      errors.push("Site name must be between 3 and 40 characters.");
    }

    if (!input.keywords || input.keywords.length > 10 || input.keywords.some((k) => k.length > 20)) {
      errors.push("Keywords must be provided, cannot exceed 10 items, and each keyword must be ≤ 20 characters.");
    }

    return errors;
  }
}
