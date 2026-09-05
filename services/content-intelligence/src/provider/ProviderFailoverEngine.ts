import {
  ExecutionRequest,
  ProviderCapability,
} from "./ExecutionProvider"

import {
  ExecutionAuditEngine,
} from "../audit/ExecutionAuditEngine"

import {
  ProviderRegistry,
} from "./ProviderRegistry"

import {
  ProviderExecutionEngine,
} from "./ProviderExecutionEngine"

import {
  ActionExecutionEngine,
} from "../execution/ActionExecutionEngine"

import {
  ExecutionLifecycleEngine,
} from "../execution/ExecutionLifecycleEngine"

export interface ProviderFailoverAttempt {
  providerId: string
  success: boolean
  message: string
}

export interface ProviderFailoverResult {
  success: boolean
  executionId: string
  capability: ProviderCapability
  providerId?: string
  attempts: ProviderFailoverAttempt[]
  message: string
}

export class ProviderFailoverEngine {
  constructor(
    private readonly executions:
      ActionExecutionEngine,

    private readonly providerEngine:
      ProviderExecutionEngine,

    private readonly providers:
      ProviderRegistry,

    private readonly lifecycle:
      ExecutionLifecycleEngine
  ) {}

  async execute(
    executionId: string,
    capability: ProviderCapability,
    request: ExecutionRequest,
    preferredProviderId?: string
  ): Promise<ProviderFailoverResult> {
    const execution =
      this.executions.getExecution(
        executionId
      )

    if (!execution) {
      return {
        success: false,
        executionId,
        capability,
        attempts: [],
        message:
          "Execution was not found.",
      }
    }

    /*
     * Approval gate.
     */
    if (
      execution.status ===
      "pending"
    ) {
      return {
        success: false,
        executionId,
        capability,
        attempts: [],
        message:
          "Execution requires approval before provider failover can begin.",
      }
    }

    /*
     * Failover can only operate on an
     * approved or already-executing execution.
     */
    if (
      execution.status !==
        "approved" &&
      execution.status !==
        "executing"
    ) {
      return {
        success: false,
        executionId,
        capability,
        attempts: [],
        message:
          `Execution cannot begin failover from status "${execution.status}".`,
      }
    }

    const context = {
      executionId,
      capability,
    }

    /*
     * Start the shared execution exactly once.
     *
     * The lifecycle engine records the
     * execution-started audit event.
     */
    if (
      execution.status ===
      "approved"
    ) {
      const started =
        this.lifecycle.start(
          context
        )

      if (
        !started ||
        started.status !==
          "executing"
      ) {
        return {
          success: false,
          executionId,
          capability,
          attempts: [],
          message:
            "Execution could not enter the executing state.",
        }
      }
    }

    /*
     * Find all providers capable of handling
     * the requested capability and request.
     */
    const candidates =
      this.providers
        .getAll()
        .filter(
          (provider) =>
            provider.capabilities.includes(
              capability
            ) &&
            provider.canExecute(
              request
            )
        )

    const ordered =
      this.orderProviders(
        candidates.map(
          (provider) =>
            provider.id
        ),
        preferredProviderId
      )

    if (
      ordered.length === 0
    ) {
      const message =
        `No provider is available for "${capability}".`

      this.lifecycle.fail(
        context,
        message
      )

      return {
        success: false,
        executionId,
        capability,
        attempts: [],
        message,
      }
    }

    const attempts:
      ProviderFailoverAttempt[] = []

    /*
     * Try providers sequentially.
     */
    for (
      const providerId of ordered
    ) {
      /*
       * Record which provider was selected
       * before attempting execution.
       */
      this.lifecycle.providerSelected(
        context,
        providerId
      )

      this.lifecycle.providerAttempted(
        context,
        providerId
      )

      const result =
        await this.providerEngine.execute(
          executionId,
          providerId,
          request,
          {
            allowFailover:
              true,
          }
        )

      if (!result) {
        const message =
          "Provider execution did not return a result."

        this.lifecycle.providerFailed(
          context,
          providerId,
          message
        )

        attempts.push({
          providerId,
          success: false,
          message,
        })

        continue
      }

      attempts.push({
        providerId,
        success:
          result.success,
        message:
          result.message,
      })

      /*
       * Successful provider wins.
       */
      if (
        result.success
      ) {
        this.lifecycle.providerSucceeded(
          context,
          providerId,
          result.message
        )

        /*
         * ProviderExecutionEngine may already
         * complete the shared execution.
         *
         * Lifecycle.complete() is therefore
         * only called if the execution is still
         * in the executing state.
         */
        const current =
          this.executions.getExecution(
            executionId
          )

        if (
          current?.status ===
          "executing"
        ) {
          this.lifecycle.complete(
            context,
            result.message,
            providerId
          )
        }

        return {
          success: true,
          executionId,
          capability,
          providerId,
          attempts,
          message:
            result.message,
        }
      }

      /*
       * Provider failed, but failover continues.
       */
      this.lifecycle.providerFailed(
        context,
        providerId,
        result.message
      )
    }

    /*
     * Every provider failed.
     *
     * Only now does the shared execution
     * become permanently failed.
     */
    const message =
      `All available providers failed for "${capability}".`

    this.lifecycle.fail(
      context,
      message
    )

    return {
      success: false,
      executionId,
      capability,
      attempts,
      message,
    }
  }

  private orderProviders(
    providerIds: string[],
    preferredProviderId?: string
  ): string[] {
    if (
      !preferredProviderId
    ) {
      return providerIds
    }

    return [
      ...providerIds.filter(
        (id) =>
          id ===
          preferredProviderId
      ),

      ...providerIds.filter(
        (id) =>
          id !==
          preferredProviderId
      ),
    ]
  }
}
