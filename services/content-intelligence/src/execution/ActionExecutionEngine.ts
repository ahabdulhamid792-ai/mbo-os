import {
  MBOAction,
} from "../action/ActionEngine"

export type ExecutionStatus =
  | "pending"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled"

export interface ActionExecution {
  id: string

  actionId: string

  patternType: string

  patternValue: string

  status: ExecutionStatus

  requiresApproval: boolean

  approved: boolean

  startedAt?: string

  completedAt?: string

  error?: string

  result?: string
}

export class ActionExecutionEngine {
  private executions:
    Map<string, ActionExecution> =
    new Map()

  createExecution(
    action: MBOAction
  ): ActionExecution {
    const id =
      `execution:${action.id}`

    const existing =
      this.executions.get(id)

    if (existing) {
      return existing
    }

    const execution:
      ActionExecution = {
        id,

        actionId:
          action.id,

        patternType:
          action.patternType,

        patternValue:
          action.patternValue,

        status:
          action.requiresApproval
            ? "pending"
            : "approved",

        requiresApproval:
          action.requiresApproval,

        approved:
          !action.requiresApproval,
      }

    this.executions.set(
      id,
      execution
    )

    return execution
  }

  approve(
    executionId: string
  ): ActionExecution | undefined {
    const execution =
      this.executions.get(
        executionId
      )

    if (!execution) {
      return undefined
    }

    if (
      !execution.requiresApproval
    ) {
      return execution
    }

    if (
      execution.status !==
      "pending"
    ) {
      return execution
    }

    const updated:
      ActionExecution = {
        ...execution,

        approved:
          true,

        status:
          "approved",
      }

    this.executions.set(
      executionId,
      updated
    )

    return updated
  }
  
requireApproval(
  executionId: string
): ActionExecution | undefined {
  const execution =
    this.executions.get(
      executionId
    )

  if (!execution) {
    return undefined
  }

  if (
    execution.status !==
    "approved"
  ) {
    return execution
  }

  const updated:
    ActionExecution = {
    ...execution,

    status:
      "pending",

    requiresApproval:
      true,

    approved:
      false,
  }

  this.executions.set(
    executionId,
    updated
  )

  return updated
}

  start(
    executionId: string
  ): ActionExecution | undefined {
    const execution =
      this.executions.get(
        executionId
      )

    if (!execution) {
      return undefined
    }

    if (
      execution.requiresApproval &&
      !execution.approved
    ) {
      return {
        ...execution,

        error:
          "Execution requires approval.",
      }
    }

    if (
      execution.status !==
      "approved"
    ) {
      return execution
    }

    const updated:
      ActionExecution = {
        ...execution,

        status:
          "executing",

        startedAt:
          new Date().toISOString(),

        error:
          undefined,
      }

    this.executions.set(
      executionId,
      updated
    )

    return updated
  }

  complete(
    executionId: string,
    result: string
  ): ActionExecution | undefined {
    const execution =
      this.executions.get(
        executionId
      )

    if (!execution) {
      return undefined
    }

    if (
      execution.status !==
      "executing"
    ) {
      return execution
    }

    const updated:
      ActionExecution = {
        ...execution,

        status:
          "completed",

        completedAt:
          new Date().toISOString(),

        result,

        error:
          undefined,
      }

    this.executions.set(
      executionId,
      updated
    )

    return updated
  }

  fail(
    executionId: string,
    error: string
  ): ActionExecution | undefined {
    const execution =
      this.executions.get(
        executionId
      )

    if (!execution) {
      return undefined
    }

    const updated:
      ActionExecution = {
        ...execution,

        status:
          "failed",

        completedAt:
          new Date().toISOString(),

        error,
      }

    this.executions.set(
      executionId,
      updated
    )

    return updated
  }

  cancel(
    executionId: string
  ): ActionExecution | undefined {
    const execution =
      this.executions.get(
        executionId
      )

    if (!execution) {
      return undefined
    }

    if (
      execution.status ===
      "completed"
    ) {
      return execution
    }

    const updated:
      ActionExecution = {
        ...execution,

        status:
          "cancelled",

        completedAt:
          new Date().toISOString(),
      }

    this.executions.set(
      executionId,
      updated
    )

    return updated
  }

  getExecution(
    executionId: string
  ): ActionExecution | undefined {
    return this.executions.get(
      executionId
    )
  }

  getExecutions():
    ActionExecution[] {
    return Array.from(
      this.executions.values()
    )
  }
}
