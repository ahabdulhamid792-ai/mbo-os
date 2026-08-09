import { AIProvider } from "../interfaces/AIProvider"

export class OllamaProvider implements AIProvider {
  id = "ollama"
  name = "Ollama"

  enabled = true
  priority = 1

  supportsStreaming = false
  supportsVision = false
  supportsReasoning = false

  maxContext = 32000

  private baseUrl = "http://localhost:11434"
  private model = "llama3.2:1b"

async generate(prompt: string): Promise<string> {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2:1B",
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = await response.json();

  return data.response;
}

   
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:11434/api/tags")

      return response.ok
    } catch {
      return false
    }
  }
}