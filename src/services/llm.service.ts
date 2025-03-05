import wandb from "@wandb/sdk";
import { Run } from "@wandb/sdk/dist/sdk/wandb_run";

import { ChatMistralAI, ChatMistralAICallOptions } from "@langchain/mistralai";
import { SERVER } from "@/config";

export class LLMService {
  public imageLLM!: ChatMistralAI<ChatMistralAICallOptions>;
  public htmlLLM!: ChatMistralAI<ChatMistralAICallOptions>;
  public wandbRun: Run | null = null;

  private async initializeWandb() {
    await wandb.login({ key: SERVER.WANDB_API_KEY, relogin: true });

    return wandb.init({
      project: "smartbloks-content-transformer",
      job_type: "monitoring"
    });
  }

  constructor() {
    this.imageLLM = new ChatMistralAI({
      model: "pixtral-12b",
      temperature: 0
    });

    this.htmlLLM = new ChatMistralAI({
      model: "codestral-latest",
      temperature: 0,
      topP: 1
    });
  }

  async finishWandb() {
    if (this.wandbRun) {
      await this.wandbRun.finish();
    }
  }
}
