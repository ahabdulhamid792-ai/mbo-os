import {
  RoutingPlan,
  RoutingPolicy,
  RoutingTask,
} from "./ModelRoutingEngine"

export type AttemptResult =
  | "success"
  | "failed"

export interface RoutingExecutionAttempt {
  attempt: number
  modelId: string
  providerId: string
  result: AttemptResult
  output?: unknown
  error?: string
  timestamp: string
}

export interface RoutingExecutionResult {
  taskId: string
  success: boolean
  finalModelId?: string
  finalProviderId?: string
  output?: unknown
  attempts: RoutingExecutionAttempt[]
  usedFallback: boolean
  usedProviderFallback: boolean
  usedManualFallback: boolean
  error?: string
}

export interface ModelExecutionRequest {
  task: RoutingTask
  modelId: string
  providerId: string
  attempt: number
}

export interface ModelExecutionResponse {
  success: boolean
  result?: unknown
  error?: string
}

export interface ModelExecutor {
  execute(
    request: ModelExecutionRequest
  ): Promise<ModelExecutionResponse>
}

export class RoutingAttemptEngine {
  constructor(
    private readonly executor: ModelExecutor
  ) {}

  async execute(
    task: RoutingTask,
    plan: RoutingPlan,
    policy: RoutingPolicy
  ): Promise<RoutingExecutionResult> {
    if (plan.decision !== "route") {
      return {
        taskId: task.id,
        success: false,
        attempts: [],
        usedFallback: false,
        usedProviderFallback: false,
        usedManualFallback:
          plan.decision === "manual",
        error:
          plan.decision === "prepare"
            ? "Execution requires approval before routing."
            : plan.reason,
      }
    }

    const attempts: RoutingExecutionAttempt[] = []

    let attemptNumber = 0

    /*
     * PRIMARY MODEL
     */
    if (
      plan.selectedModelId &&
      plan.selectedProviderId
    ) {
      const primary =
        await this.tryModel(
          task,
          plan.selectedModelId,
          plan.selectedProviderId,
          ++attemptNumber
        )

      attempts.push(primary)

      if (primary.result === "success") {
        return {
          taskId: task.id,
          success: true,
          finalModelId: primary.modelId,
          finalProviderId: primary.providerId,
          output: primary.output,
          attempts,
          usedFallback: false,
          usedProviderFallback: false,
          usedManualFallback: false,
        }
      }
    }

    /*
     * MODEL FALLBACKS
     */
    if (policy.allowModelFallback) {
      for (
        const modelId of plan.fallbackModelIds
      ) {
        const providerId =
          this.extractProviderId(modelId)

        if (!providerId) {
          continue
        }

        const result =
          await this.tryModel(
            task,
            modelId,
            providerId,
            ++attemptNumber
          )

        attempts.push(result)

        if (result.result === "success") {
          return {
            taskId: task.id,
            success: true,
            finalModelId: result.modelId,
            finalProviderId: result.providerId,
            output: result.output,
            attempts,
            usedFallback: true,
            usedProviderFallback: false,
            usedManualFallback: false,
          }
        }
      }
    }

    /*
     * PROVIDER FALLBACKS
     *
     * Only use models explicitly supplied
     * by the routing plan.
     */
    if (policy.allowProviderFallback) {
      for (
        const providerId of plan.fallbackProviderIds
      ) {
        const providerModel =
          plan.fallbackModelIds.find(
            (modelId) =>
              this.extractProviderId(modelId) ===
              providerId
          )

        if (!providerModel) {
          continue
        }

        const alreadyAttempted =
          attempts.some(
            (attempt) =>
              attempt.modelId === providerModel
          )

        if (alreadyAttempted) {
          continue
        }

        const result =
          await this.tryModel(
            task,
            providerModel,
            providerId,
            ++attemptNumber
          )

        attempts.push(result)

        if (result.result === "success") {
          return {
            taskId: task.id,
            success: true,
            finalModelId: result.modelId,
            finalProviderId: result.providerId,
            output: result.output,
            attempts,
            usedFallback: true,
            usedProviderFallback: true,
            usedManualFallback: false,
          }
        }
      }
    }

    /*
     * MANUAL FALLBACK
     */
    if (policy.allowManualFallback) {
      return {
        taskId: task.id,
        success: false,
        attempts,
        usedFallback: attempts.length > 1,
        usedProviderFallback: false,
        usedManualFallback: true,
        error:
          "All configured AI execution attempts failed. Manual execution is required.",
      }
    }

    return {
      taskId: task.id,
      success: false,
      attempts,
      usedFallback: attempts.length > 1,
      usedProviderFallback: false,
      usedManualFallback: false,
      error:
        "All configured AI execution attempts failed.",
    }
  }

  private async tryModel(
    task: RoutingTask,
    modelId: string,
    providerId: string,
    attempt: number
  ): Promise<RoutingExecutionAttempt & {
    output?: unknown
  }> {
    const timestamp =
      new Date().toISOString()

    try {
      const response =
        await this.executor.execute({
          task,
          modelId,
          providerId,
          attempt,
        })

      return {
        attempt,
        modelId,
        providerId,
        result:
          response.success
            ? "success"
            : "failed",
        error: response.error,
        timestamp,
        output: response.result,
      }
    } catch (error) {
      return {
        attempt,
        modelId,
        providerId,
        result: "failed",
        error:
          error instanceof Error
            ? error.message
            : String(error),
        timestamp,
      }
    }
  }

  private extractProviderId(
    modelId: string
  ): string | undefined {
    const separator =
      modelId.indexOf(":")

    if (separator <= 0) {
      return undefined
    }

    return modelId.slice(0, separator)
  }
}

/*
 * Backwards-compatible aliases.
 *
 * Older orchestration code used these names.
 */
// removed backwards-compatible alias that caused duplicate/circular type
