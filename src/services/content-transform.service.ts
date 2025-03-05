import * as cheerio from "cheerio";
import { LLMService } from "./llm.service";
import { createFinalHtmlPrompt } from "@/templates";
import { RunnableSequence } from "@langchain/core/runnables";
import { ContentTransformerInput, ContentTransformerOutput } from "@/models";

export class ContentTransformerService {
  constructor(private llmService: LLMService) {}

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

      console.log({ optimizedHtml });

      const $ = cheerio.load(optimizedHtml?.text);

      $("img").each((_, img) => {
        const altText = $(img).attr("alt") || "Descriptive image related to site content";
        $(img).attr("alt", altText);
      });

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

      console.log({ finalHtml });

      return {
        message: "HTML successfully optimized for SEO, accessibility, and user experience.",
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
