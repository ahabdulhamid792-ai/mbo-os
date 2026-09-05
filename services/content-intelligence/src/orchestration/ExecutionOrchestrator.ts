import {
  ExecutionObjectiveContext,
} from "../execution/ExecutionObjective"

import {
  ModelRoutingEngine,
  RoutingPlan,
  RoutingPolicy,
  RoutingTask,
  RoutingTaskType,
} from "../provider/ModelRoutingEngine"

import {
  RoutingAttemptEngine,
  ModelExecutor,
  ModelExecutionRequest,
  ModelExecutionResponse,
  RoutingExecutionResult,
} from "../provider/RoutingAttemptEngine"

export interface ExecutionTask {
  taskId: string

  type: RoutingTaskType

  capability: string

  objective: ExecutionObjectiveContext

  input: unknown
}

export interface ExecutionResult {
  taskId: string

  success: boolean

  decision: RoutingPlan

  attemptResult?: RoutingExecutionResult

  objective: ExecutionObjectiveContext

  output?: unknown

  error?: string
}

export interface ExecutionHandler {
  execute(
    task: ExecutionTask,
    modelId: string,
    providerId: string
  ): Promise<unknown>
}

export class ExecutionOrchestrator {
  constructor(
    private readonly routingEngine:
      ModelRoutingEngine,

    private readonly routingAttemptEngineFactory:
      (
        executor: ModelExecutor
      ) => RoutingAttemptEngine,

    private readonly policy:
      RoutingPolicy
  ) {}

  async execute(
    task: ExecutionTask,
    handler: ExecutionHandler
  ): Promise<ExecutionResult> {
    const routingTask: RoutingTask = {
      id:
        task.taskId,

      type:
        task.type,

      capability:
        task.capability,

      description:
        task.objective.objective,
    }

    const plan =
      this.routingEngine.route(
        routingTask,
        this.policy
      )

    if (
      plan.decision !== "route"
    ) {
      return {
        taskId:
          task.taskId,

        success: false,

        decision:
          plan,

        objective:
          task.objective,

        error:
          plan.reason,
      }
    }

    const executor:
      ModelExecutor = {
        execute: async (
          request: ModelExecutionRequest
        ): Promise<ModelExecutionResponse> => {
          try {
            const output =
              await handler.execute(
                task,
                request.modelId,
                request.providerId
              )

            return {
              success: true,

              result:
                output,
            }
          } catch (error) {
            return {
              success: false,

              error:
                error instanceof Error
                  ? error.message
                  : String(error),
            }
          }
        },
      }

    const attemptEngine =
      this.routingAttemptEngineFactory(
        executor
      )

    const attemptResult =
      await attemptEngine.execute(
        routingTask,
        plan,
        this.policy
      )

    if (
      !attemptResult.success
    ) {
      return {
        taskId:
          task.taskId,

        success: false,

        decision:
          plan,

        attemptResult,

        objective:
          task.objective,

        error:
          attemptResult.error,
      }
    }

    return {
      taskId:
        task.taskId,

      success: true,

      decision:
        plan,

      attemptResult,

      objective:
        task.objective,

      output:
        attemptResult.output,
    }
  }
}

export type OrchestrationResult =
  ExecutionResult
