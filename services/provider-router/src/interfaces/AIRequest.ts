export interface AIRequest {
  prompt: string

  requiresStreaming?: boolean

  requiresVision?: boolean

  requiresReasoning?: boolean

  minimumContext?: number

  preferredProvider?: string
}
