import { AIProvider } from "../interfaces/AIProvider";
import { AIRequest } from "../interfaces/AIRequest";

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

  async selectProvider(request?: AIRequest): Promise<AIProvider> {
    const available = await this.getAvailableProviders();

    if (available.length === 0) {
      throw new Error("No AI providers are available.");
    }

    const filtered = available.filter((provider) => {
      if (request?.requiresVision && !provider.supportsVision) {
        return false;
      }

      if (request?.requiresStreaming && !provider.supportsStreaming) {
        return false;
      }

      if (request?.requiresReasoning && !provider.supportsReasoning) {
        return false;
      }

      if (request?.minimumContext && provider.maxContext < request.minimumContext) {
        return false;
      }

      if (request?.preferredProvider && provider.id !== request.preferredProvider) {
        return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      throw new Error(
        "No AI providers are available that meet the requested capabilities."
      );
    }

    filtered.sort((a, b) => a.priority - b.priority);

    return filtered[0];
  }

  async generate(request: AIRequest): Promise<string> {
    const provider = await this.selectProvider(request);

    console.log(`Using AI provider: ${provider.name}`);

    return provider.generate(request.prompt);
  }
}