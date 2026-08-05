import { AIProvider } from "../interfaces/AIProvider";

export class ClaudeProvider implements AIProvider {
  name = "Claude";

  async chat(prompt: string): Promise<string> {
    return "Claude placeholder";
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}