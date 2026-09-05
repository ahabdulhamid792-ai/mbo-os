import {
  ActionExecutionEngine,
  ActionExecution,
} from "./ActionExecutionEngine"

import {
  ProviderFailoverEngine,
  ProviderFailoverResult,
} from "../provider/ProviderFailoverEngine"

import {
  ExecutionProvider,
  ExecutionRequest,
} from "../provider/ExecutionProvider"

export interface OrchestrationResult {
  success: boolean
  executionId: string
  capability: string
  providerId?: string
  attempts: Array<{
    providerId: string
    success: boolean
    message: string
  }>
  message: string
}

export class ExecutionOrchestrator {
  constructor(
    private readonly executionEngine: ActionExecutionEngine,
    private readonly failoverEngine: ProviderFailoverEngine,
  ) {}

  async execute(
    executionId: string,
    capability: ExecutionProvider["capabilities"][number],
    request: ExecutionRequest,
  ): Promise<OrchestrationResult> {
    const execution: ActionExecution | undefined =
      this.executionEngine.getExecution(executionId)

    if (!execution) {
      throw new Error(
        `Execution "${executionId}" was not found.`,
      )
    }

    const result: ProviderFailoverResult =
      await this.failoverEngine.execute(
        executionId,
        capability,
        request,
      )

    return {
      success: result.success,
      executionId: result.executionId,
      capability: result.capability,
      providerId: result.providerId,
      attempts: result.attempts,
      message: result.message,
    }
  }
}