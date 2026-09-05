export interface ExecutionObjectiveContext {
  objective: string

  goal?: string

  audience?: string

  niche?: string

  constraints?: string[]

  successCriteria?: string[]

  metadata?: Record<string, unknown>
}
