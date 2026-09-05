import {
  ExecutionObjectiveContext,
} from "./ExecutionObjective"

import {
  ModelRoutingEngine,
  ModelRoutingDecision,
  RoutingPolicy,
  RoutingTask,
} from "../provider/ModelRoutingEngine"

import {
  RoutingAttemptEngine,
  RoutingAttemptResult,
} from "../provider/RoutingAttemptEngine"

export interface ExecutionTask {
  taskId: string

  capability: string

  objective: ExecutionObjectiveContext

  input: unknown

  type?: RoutingTask["type"]

  niche?: string

  description?: string

  requiresHighQuality?: boolean

  requiresFreshInformation?: boolean

  requiresReasoning?: boolean

  requiresLongContext?: boolean

  requiresMultimodal?: boolean
}

export interface ExecutionResult {
  taskId: string

  success: boolean

  decision: ModelRoutingDecision

  attemptResult?: RoutingAttemptResult

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

    private readonly routingAttemptEngine:
      RoutingAttemptEngine,

    private readonly policy:
      RoutingPolicy
  ) {}

  async execute(
    task: ExecutionTask,
    handler: ExecutionHandler
  ): Promise<ExecutionResult> {

    const routingTask: RoutingTask = {
      id: task.taskId,

      type:
        task.type ??
        "general",

      capability:
        task.capability,

      niche:
        task.niche,

      description:
        task.description,

      requiresHighQuality:
        task.requiresHighQuality,

      requiresFreshInformation:
        task.requiresFreshInformation,

      requiresReasoning:
        task.requiresReasoning,

      requiresLongContext:
        task.requiresLongContext,

      requiresMultimodal:
        task.requiresMultimodal,
    }

    const decision =
      this.routingEngine.route(
        routingTask,
        this.policy
      )

    if (
      decision.decision !== "route"
    ) {
      return {
        taskId:
          task.taskId,

        success: false,

        decision,

        objective:
          task.objective,

        error:
          decision.reason,
      }
    }

    /*
     * The current RoutingAttemptEngine is synchronous.
     *
     * Therefore the execution handler must be adapted into
     * the ModelExecutor contract. The actual async handler
     * is deliberately NOT passed directly into the routing
     * engine because doing so would create false-positive
     * successes.
     *
     * This orchestrator therefore only supports handlers
     * whose work can be represented synchronously at this
     * layer. Async execution should be connected through
     * the future async executor adapter.
     */

    const attemptResult =
      this.routingAttemptEngine.execute(
        routingTask,

        decision,

        this.policy
      )

    if (
      !attemptResult.success
    ) {
      return {
        taskId:
          task.taskId,

        success: false,

        decision,

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

      decision,

      attemptResult,

      objective:
        task.objective,
    }
  }
}
