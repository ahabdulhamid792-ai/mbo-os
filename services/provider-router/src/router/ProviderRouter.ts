import { OpenAIProvider } from "../providers/openai";

export class ProviderRouter {
  private provider = new OpenAIProvider();

  async ask(prompt: string) {
    return this.provider.chat(prompt);
  }
}