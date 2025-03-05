import * as cheerio from "cheerio";
import { LLMService } from "./llm.service";
import { ImageSearchService } from "./image.service";
import { createFinalHtmlPrompt } from "@/templates";
import { RunnableSequence } from "@langchain/core/runnables";
import { ContentTransformerInput, ContentTransformerOutput } from "@/models";

export class ContentTransformerService {
  constructor(
    private llmService: LLMService,
    private imageSearchService: ImageSearchService
  ) {}

  async transformContent(input: ContentTransformerInput): Promise<ContentTransformerOutput> {
    const startTime = performance.now();

    try {
      const { html, siteName, keywords } = input;

      if (this.llmService.wandbRun) {
        this.llmService.wandbRun.log({
          input_html: html,
          siteName,
          keywords
        });
      }

      const htmlOptimizationChain = RunnableSequence.from([createFinalHtmlPrompt, this.llmService.htmlLLM]);
      const optimizedHtml = await htmlOptimizationChain.invoke({ html, siteName, keywords });

      if (this.llmService.wandbRun) {
        this.llmService.wandbRun.log({
          optimized_html: optimizedHtml?.text
        });
      }

      const $ = cheerio.load(optimizedHtml?.text);

      await Promise.all(
        $("img").map(async (_, img) => {
          let altText = $(img).attr("alt")?.trim() || "Descriptive image related to site content";
          $(img).attr("alt", altText);

          const imageUrl = await this.imageSearchService.fetchImageUrl(altText);

          console.log({ imageUrl });

          if (imageUrl) {
            $(img).attr("src", imageUrl);
          }
        })
      );

      const finalHtml = $.html();
      const latency = performance.now() - startTime;

      if (this.llmService.wandbRun) {
        this.llmService.wandbRun.log({
          task: "rewriteTextForSEO",
          latency,
          inputLength: html.length,
          outputLength: finalHtml.length
        });
      }

      return {
        message: "HTML successfully optimized with real images, SEO, and accessibility.",
        isSuccessful: true,
        result: { html: finalHtml }
      };
    } catch (error: any) {
      console.error(error);
      return {
        isSuccessful: false,
        result: { html: "" },
        message: error?.message || "An error occurred during content transformation."
      };
    } finally {
      setTimeout(() => this.llmService.finishWandb(), 1000);
    }
  }
}
