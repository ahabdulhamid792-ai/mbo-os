import { AIProvider } from "../interfaces/AIProvider"

export class ClaudeProvider implements AIProvider {

  id = "claude"

  name = "Claude"

  enabled = true

  priority = 1

  supportsStreaming = true

  supportsVision = false

  supportsReasoning = true

  maxContext = 32000

  async generate(prompt: string): Promise<string> {

    return `CLAUDE RESPONSE: ${prompt}`

  }

  async healthCheck(): Promise<boolean> {

    return true

  }

}