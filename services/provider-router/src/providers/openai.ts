import { AIProvider } from "../interfaces/AIProvider";

export class OpenAIProvider implements AIProvider {
  name = "OpenAI";

  async chat(prompt: string): Promise<string> {
    return "OpenAI placeholder";
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}