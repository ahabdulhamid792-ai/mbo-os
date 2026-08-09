import { AIProvider } from "../interfaces/AIProvider"

export class GeminiProvider implements AIProvider {

  id = "gemini"

  name = "Gemini"

  enabled = true

  priority = 1

  supportsStreaming = true

  supportsVision = false

  supportsReasoning = true

  maxContext = 32000

  async generate(prompt: string): Promise<string> {

    return `OLLAMA RESPONSE: ${prompt}`

  }

  async healthCheck(): Promise<boolean> {

    return true

  }

}