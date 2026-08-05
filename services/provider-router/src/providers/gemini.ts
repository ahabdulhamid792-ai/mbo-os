import { AIProvider } from "../interfaces/AIProvider";

export class GeminiProvider implements AIProvider {
  name = "Gemini";

  async chat(prompt: string): Promise<string> {
    return "Gemini placeholder";
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}