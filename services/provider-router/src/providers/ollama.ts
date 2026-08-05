import { AIProvider } from "../interfaces/AIProvider";

export class OllamaProvider implements AIProvider {
  name = "Ollama";

  async chat(prompt: string): Promise<string> {
    return "Ollama placeholder";
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}