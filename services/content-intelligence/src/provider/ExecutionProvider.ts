export type ProviderCapability =
  | "content-generation"
  | "image-generation"
  | "video-generation"
  | "voice-generation"
  | "social-publishing"
  | "analytics"

export interface ExecutionRequest {
  executionId: string

  actionId: string

  patternType: string

  patternValue: string

  title: string

  objective: string

  steps: string[]

  successMetrics: string[]
}

export interface ExecutionResult {
  success: boolean

  providerId: string

  executionId: string

  message: string

  output?: unknown

  error?: string
}

export interface ExecutionProvider {
  readonly id: string

  readonly name: string

  readonly capabilities:
    readonly ProviderCapability[]

  canExecute(
    request: ExecutionRequest
  ): boolean

  execute(
    request: ExecutionRequest
  ): Promise<ExecutionResult>
}
