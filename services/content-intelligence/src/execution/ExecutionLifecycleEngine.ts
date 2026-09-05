import {
  ActionExecution,
  ActionExecutionEngine,
} from "./ActionExecutionEngine"

import {
  ExecutionAuditEngine,
} from "../audit/ExecutionAuditEngine"

import {
  ProviderCapability,
} from "../provider/ExecutionProvider"

export interface LifecycleExecutionContext {
  executionId: string
  capability?: ProviderCapability
}

export class ExecutionLifecycleEngine {
  constructor(
    private readonly executions:
      ActionExecutionEngine,

    private readonly audit:
      ExecutionAuditEngine
  ) {}

  recordCreated(
    context: LifecycleExecutionContext
  ): ActionExecution | undefined {
    const execution =
      this.executions.getExecution(
        context.executionId
      )

    if (!execution) {
      return undefined
    }

    this.audit.record({
      executionId:
        context.executionId,

      eventType:
        "execution-created",

      status:
        execution.status,

      capability:
        context.capability,

      message:
        "Execution was created.",
    })

    return execution
  }

  recordApprovalRequired(
    context: LifecycleExecutionContext,
    message:
      string = "Execution requires approval."
  ): ActionExecution | undefined {
    const execution =
      this.executions.getExecution(
        context.executionId
      )

    if (!execution) {
      return undefined
    }

    this.audit.record({
      executionId:
        context.executionId,

      eventType:
        "policy-evaluated",

      status:
        execution.status,

      capability:
        context.capability,

      message,

      metadata: {
        decision:
          "approval-required",

        requiresApproval:
          true,
      },
    })

    return execution
  }

  approve(
    context: LifecycleExecutionContext
  ): ActionExecution | undefined {
    const execution =
      this.executions.approve(
        context.executionId
      )

    if (!execution) {
      return undefined
    }

    if (
      execution.status ===
      "approved"
    ) {
      this.audit.record({
        executionId:
          context.executionId,

        eventType:
          "execution-approved",

        status:
          "approved",

        capability:
          context.capability,

        message:
          "Execution was approved by the owner.",
      })
    }

    return execution
  }

  start(
    context: LifecycleExecutionContext
  ): ActionExecution | undefined {
    const execution =
      this.executions.start(
        context.executionId
      )

    if (!execution) {
      return undefined
    }

    if (
      execution.status ===
      "executing"
    ) {
      this.audit.record({
        executionId:
          context.executionId,

        eventType:
          "execution-started",

        status:
          "executing",

        capability:
          context.capability,

        message:
          "Execution entered the executing state.",
      })
    }

    return execution
  }

  providerSelected(
    context: LifecycleExecutionContext,
    providerId: string
  ): void {
    this.audit.record({
      executionId:
        context.executionId,

      eventType:
        "provider-selected",

      status:
        "executing",

      providerId,

      capability:
        context.capability,

      message:
        `Provider "${providerId}" was selected.`,
    })
  }

  providerAttempted(
    context: LifecycleExecutionContext,
    providerId: string
  ): void {
    this.audit.record({
      executionId:
        context.executionId,

      eventType:
        "provider-attempted",

      status:
        "executing",

      providerId,

      capability:
        context.capability,

      message:
        `Provider "${providerId}" execution started.`,
    })
  }

  providerFailed(
    context: LifecycleExecutionContext,
    providerId: string,
    message: string
  ): void {
    this.audit.record({
      executionId:
        context.executionId,

      eventType:
        "provider-failed",

      status:
        "executing",

      providerId,

      capability:
        context.capability,

      message,
    })
  }

  providerSucceeded(
    context: LifecycleExecutionContext,
    providerId: string,
    message: string
  ): void {
    this.audit.record({
      executionId:
        context.executionId,

      eventType:
        "provider-succeeded",

      status:
        "completed",

      providerId,

      capability:
        context.capability,

      message,
    })
  }

  complete(
    context: LifecycleExecutionContext,
    result: string,
    providerId?: string
  ): ActionExecution | undefined {
    const execution =
      this.executions.complete(
        context.executionId,
        result
      )

    if (!execution) {
      return undefined
    }

    if (
      execution.status ===
      "completed"
    ) {
      this.audit.record({
        executionId:
          context.executionId,

        eventType:
          "execution-completed",

        status:
          "completed",

        providerId,

        capability:
          context.capability,

        message:
          "Execution completed successfully.",

        metadata: {
          result,
        },
      })
    }

    return execution
  }

  fail(
    context: LifecycleExecutionContext,
    error: string,
    providerId?: string
  ): ActionExecution | undefined {
    const execution =
      this.executions.fail(
        context.executionId,
        error
      )

    if (!execution) {
      return undefined
    }

    this.audit.record({
      executionId:
        context.executionId,

      eventType:
        "execution-failed",

      status:
        "failed",

      providerId,

      capability:
        context.capability,

      message:
        error,
    })

    return execution
  }

  getExecution(
    executionId: string
  ): ActionExecution | undefined {
    return this.executions.getExecution(
      executionId
    )
  }

  getAudit(
    executionId: string
  ) {
    return this.audit.getEvents(
      executionId
    )
  }
}
