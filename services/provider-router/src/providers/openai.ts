import { AIProvider } from "../interfaces/AIProvider"

export class OpenAIProvider implements AIProvider {

  id = "openai"

  name = "OpenAI"

  enabled = true

  priority = 1

  supportsStreaming = true

  supportsVision = false

  supportsReasoning = true

  maxContext = 32000

  async generate(prompt: string): Promise<string> {

    return `OPENAI RESPONSE: ${prompt}`

  }

  async healthCheck(): Promise<boolean> {

    return true

  }

}