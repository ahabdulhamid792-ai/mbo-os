import { AIProvider } from "../interfaces/AIProvider";

import { OllamaProvider } from "../providers/ollama";
import { OpenAIProvider } from "../providers/openai";
import { ClaudeProvider } from "../providers/claude";
import { GeminiProvider } from "../providers/gemini";

export class ProviderRouter {
  private providers: AIProvider[];

  constructor() {
    this.providers = [
      new OllamaProvider(),
      new OpenAIProvider(),
      new ClaudeProvider(),
      new GeminiProvider(),
    ];
  }

  async getAvailableProviders(): Promise<AIProvider[]> {
    const available: AIProvider[] = [];

    for (const provider of this.providers) {
      if (!provider.enabled) {
        continue;
      }

      try {
        const healthy = await provider.healthCheck();

        if (healthy) {
          available.push(provider);
        }
      } catch (error) {
        console.warn(
          `Provider health check failed: ${provider.name}`,
          error
        );
      }
    }

    return available;
  }

  async selectProvider(): Promise<AIProvider> {
    const available = await this.getAvailableProviders();

    if (available.length === 0) {
      throw new Error("No AI providers are available.");
    }

    available.sort((a, b) => a.priority - b.priority);

    return available[0];
  }

  async generate(prompt: string): Promise<string> {
    const provider = await this.selectProvider();

    console.log(`Using AI provider: ${provider.name}`);

    return provider.generate(prompt);
  }
}