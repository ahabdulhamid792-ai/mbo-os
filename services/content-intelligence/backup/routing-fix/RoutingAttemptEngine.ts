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

  attempts: RoutingExecutionAttempt[]

  usedFallback: boolean

  usedProviderFallback: boolean

  usedManualFallback: boolean

  output?: unknown

  error?: string
}

export type RoutingAttemptResult = RoutingExecutionResult

 {
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
    private readonly executor:
      ModelExecutor
  ) {}

  async execute(
    task: RoutingTask,
    plan: RoutingPlan,
    policy: RoutingPolicy
  ): Promise<RoutingExecutionResult> {
    if (
      plan.decision !== "route"
    ) {
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

    const attempts:
      RoutingExecutionAttempt[] = []

    let attemptNumber = 0

    /*
     * Primary model.
     */
    if (
      plan.selectedModelId &&
      plan.selectedProviderId
    ) {
      const primary = await this.tryModel(
        task,
        plan.selectedModelId,
        plan.selectedProviderId,
        attemptNumber + 1
      )

      attemptNumber = primary.attempt

      attempts.push(primary)

      if (primary.result === "success") {
        return {
          taskId: task.id,

          success: true,

          finalModelId: primary.modelId,

          finalProviderId: primary.providerId,

          attempts,

          usedFallback: false,

          usedProviderFallback: false,

          usedManualFallback: false,

          output: primary.output,
        }
      }
    }

    /*
     * Model fallbacks.
     *
     * These are attempted in the exact
     * order supplied by the routing engine.
     */
    if (
      policy.allowModelFallback
    ) {
      for (
        const modelId of
        plan.fallbackModelIds
      ) {
        const providerId =
          this.extractProviderId(
            modelId
          )

        if (!providerId) {
          continue
        }

        const result = await this.tryModel(
          task,
          modelId,
          providerId,
          attemptNumber + 1
        )

        attemptNumber = result.attempt

        attempts.push(result)

        if (result.result === "success") {
          return {
            taskId: task.id,

            success: true,

            finalModelId: result.modelId,

            finalProviderId: result.providerId,

            attempts,

            usedFallback: true,

            usedProviderFallback: false,

            usedManualFallback: false,

            output: result.output,
          }
        }
      }
    }

    /*
     * Provider fallback.
     *
     * We deliberately do not invent a model here.
     * The provider fallback will be resolved
     * through the model IDs already supplied
     * by the routing plan.
     */
    if (
      policy.allowProviderFallback
    ) {
      for (
        const providerId of
        plan.fallbackProviderIds
      ) {
        const providerModel =
          plan.fallbackModelIds.find(
            (modelId) =>
              this.extractProviderId(
                modelId
              ) === providerId
          )

        if (!providerModel) {
          continue
        }

        const alreadyAttempted =
          attempts.some(
            (attempt) =>
              attempt.modelId ===
              providerModel
          )

        if (
          alreadyAttempted
        ) {
          continue
        }

        const result = await this.tryModel(
          task,
          providerModel,
          providerId,
          attemptNumber + 1
        )

        attemptNumber = result.attempt

        attempts.push(result)

        if (result.result === "success") {
          return {
            taskId: task.id,

            success: true,

            finalModelId: result.modelId,

            finalProviderId: result.providerId,

            attempts,

            usedFallback: true,

            usedProviderFallback: true,

            usedManualFallback: false,

            output: result.output,
          }
        }
      }
    }

    /*
     * Nothing succeeded.
     */
    if (
      policy.allowManualFallback
    ) {
      return {
        taskId: task.id,

        success: false,

        attempts,

        usedFallback:
          attempts.length > 1,

        usedProviderFallback:
          false,

        usedManualFallback:
          true,

        error:
          "All configured AI execution attempts failed. Manual execution is required.",
      }
    }

    return {
      taskId: task.id,

      success: false,

      attempts,

      usedFallback:
        attempts.length > 1,

      usedProviderFallback:
        false,

      usedManualFallback:
        false,

      error:
        "All configured AI execution attempts failed.",
    }
  }

  private async tryModel(
    task: RoutingTask,
    modelId: string,
    providerId: string,
    attempt: number
  ): Promise<RoutingExecutionAttempt> {
    const timestamp =
      new Date().toISOString()
    const response = await this.executor.execute({
      task,

      modelId,

      providerId,

      attempt,
    })

    return {
      attempt,

      modelId,

      providerId,

      result: response.success ? "success" : "failed",

      output: response.result,

      error: response.error,

      timestamp,
    }
  }

  private extractProviderId(
    modelId: string
  ): string | undefined {
    const separator =
      modelId.indexOf(":")

    if (
      separator <= 0
    ) {
      return undefined
    }

    return modelId.slice(
      0,
      separator
    )
  }
}
