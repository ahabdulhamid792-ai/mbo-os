import {
  ActionExecution,
  ActionExecutionEngine,
} from "../execution/ActionExecutionEngine"

import {
  ExecutionProvider,
  ExecutionRequest,
  ExecutionResult,
} from "./ExecutionProvider"

import {
  ProviderRegistry,
} from "./ProviderRegistry"

export interface ProviderExecutionOptions {
  allowFailover?: boolean
}

export interface ProviderAttemptResult {
  success: boolean
  providerId: string
  executionId: string
  message: string
  output?: unknown
  error?: string
}

export class ProviderExecutionEngine {
  constructor(
    private readonly executions:
      ActionExecutionEngine,

    private readonly providers:
      ProviderRegistry
  ) {}

  /**
   * Execute exactly one provider attempt.
   *
   * This method does NOT start or complete the shared
   * ActionExecution when allowFailover is true.
   *
   * The failover engine owns the shared lifecycle.
   */
  async execute(
    executionId: string,
    providerId: string,
    request: ExecutionRequest,
    options: ProviderExecutionOptions = {}
  ): Promise<ProviderAttemptResult | undefined> {
    const execution =
      this.executions.getExecution(
        executionId
      )

    if (!execution) {
      return undefined
    }

    /*
     * Normal execution:
     *
     * approved -> executing -> completed/failed
     */
    if (!options.allowFailover) {
      if (
        execution.status ===
        "approved"
      ) {
        const started =
          this.executions.start(
            executionId
          )

        if (!started) {
          return undefined
        }

        if (
          started.status !==
          "executing"
        ) {
          this.executions.fail(
            executionId,
            "Execution failed to enter executing state."
          )

          return {
            success: false,
            providerId,
            executionId,
            message:
              "Execution failed to enter executing state.",
          }
        }
      } else if (
        execution.status !==
        "executing"
      ) {
        const message =
          `Execution cannot start from status "${execution.status}".`

        this.executions.fail(
          executionId,
          message
        )

        return {
          success: false,
          providerId,
          executionId,
          message,
        }
      }
    }

    /*
     * Failover execution must already be executing.
     */
    if (
      options.allowFailover &&
      execution.status !==
        "executing"
    ) {
      return {
        success: false,
        providerId,
        executionId,
        message:
          `Provider attempt requires execution status "executing", ` +
          `but current status is "${execution.status}".`,
      }
    }

    const provider =
      this.providers.get(
        providerId
      )

    if (!provider) {
      return {
        success: false,
        providerId,
        executionId,
        message:
          `Provider "${providerId}" was not found.`,
        error:
          `Provider "${providerId}" was not found.`,
      }
    }

    if (
      !provider.canExecute(
        request
      )
    ) {
      return {
        success: false,
        providerId,
        executionId,
        message:
          `Provider "${providerId}" cannot execute this request.`,
        error:
          `Provider "${providerId}" cannot execute this request.`,
      }
    }

    try {
      const result:
        ExecutionResult =
        await provider.execute(
          request
        )

      if (!result.success) {
        const message =
          result.error ??
          result.message

        /*
         * During failover, do NOT mutate the
         * shared execution into failed state.
         */
        if (
          options.allowFailover
        ) {
          return {
            success: false,
            providerId,
            executionId,
            message,
            output:
              result.output,
            error:
              result.error,
          }
        }

        this.executions.fail(
          executionId,
          message
        )

        return {
          success: false,
          providerId,
          executionId,
          message,
          output:
            result.output,
          error:
            result.error,
        }
      }

      /*
       * Normal execution completes the shared
       * execution because there is no failover.
       */
      if (
        !options.allowFailover
      ) {
        this.executions.complete(
          executionId,
          result.message
        )
      }

      return {
        success: true,
        providerId,
        executionId,
        message:
          result.message,
        output:
          result.output,
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown provider execution error."

      if (
        options.allowFailover
      ) {
        return {
          success: false,
          providerId,
          executionId,
          message,
          error: message,
        }
      }

      this.executions.fail(
        executionId,
        message
      )

      return {
        success: false,
        providerId,
        executionId,
        message,
        error: message,
      }
    }
  }

  findProvider(
    capability:
      ExecutionProvider["capabilities"][number]
  ):
    ExecutionProvider | undefined {
    return this.providers.findProvider(
      capability
    )
  }
}
