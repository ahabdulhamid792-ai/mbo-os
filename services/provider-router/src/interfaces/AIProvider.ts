export interface AIProvider {
  id: string
  name: string

  enabled: boolean

  priority: number

  supportsStreaming: boolean

  supportsVision: boolean

  supportsReasoning: boolean

  maxContext: number

  generate(prompt: string): Promise<string>

  healthCheck(): Promise<boolean>
}