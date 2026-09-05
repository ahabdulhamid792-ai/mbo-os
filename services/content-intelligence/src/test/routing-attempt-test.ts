import {
  ModelRoutingEngine,
  ModelRoutingCatalog,
  RoutingPolicy,
  RoutingTask,
} from "../provider/ModelRoutingEngine"

import {
  RoutingAttemptEngine,
  ModelExecutor,
  ModelExecutionRequest,
} from "../provider/RoutingAttemptEngine"

import {
  ProviderModelConfiguration,
} from "../provider/ProviderConfiguration"

const models:
  ProviderModelConfiguration[] = [
    {
      id: "openrouter:primary",
      providerId: "openrouter",
      name: "Primary Model",
      enabled: true,
      capabilities: [
        "content-generation",
        "free",
      ],
      role: "primary",
      priority: 10,
    },

    {
      id: "minimax:fallback",
      providerId: "minimax",
      name: "Fallback Model",
      enabled: true,
      capabilities: [
        "content-generation",
        "free",
      ],
      role: "fallback",
      priority: 20,
    },

    {
      id: "openai:backup",
      providerId: "openai",
      name: "Backup Model",
      enabled: true,
      capabilities: [
        "content-generation",
        "free",
      ],
      role: "backup",
      priority: 30,
    },
  ]

const catalog:
  ModelRoutingCatalog = {
    getModels() {
      return models
    },

    isProviderEnabled(
      providerId: string
    ) {
      return [
        "openrouter",
        "minimax",
        "openai",
      ].includes(providerId)
    },
  }

const routingEngine =
  new ModelRoutingEngine(
    catalog
  )

const policy:
  RoutingPolicy = {
    costPreference:
      "free-first",

    approvalRequirement:
      "automatic",

    allowPremiumModels: true,

    allowPaidModels: true,

    allowFreeModels: true,

    maxRetries: 2,

    allowProviderFallback: true,

    allowModelFallback: true,

    allowManualFallback: true,
  }

const task:
  RoutingTask = {
    id: "task:routing-attempt-test",

    type:
      "content-generation",

    capability:
      "content-generation",
  }

console.log(
  "MBO ROUTING ATTEMPT TEST"
)

/*
 * TEST 1
 *
 * Primary succeeds immediately.
 */
console.log(
  "\n1. PRIMARY SUCCESS"
)

const primarySuccessExecutor:
  ModelExecutor = {
    async execute(
      request: ModelExecutionRequest
    ) {
      console.log(
        `Attempt ${request.attempt}: ` +
        `${request.providerId}/${request.modelId}`
      )

      return {
        success: true,
      }
    },
  }

const primarySuccessEngine =
  new RoutingAttemptEngine(
    primarySuccessExecutor
  )

const plan =
  routingEngine.route(
    task,
    policy
  )



/*
 * TEST 2
 *
 * Primary fails.
 * Fallback succeeds.
 */
console.log(
  "\n2. PRIMARY FAILURE → MODEL FALLBACK SUCCESS"
)

const fallbackExecutor:
  ModelExecutor = {
    async execute(
      request: ModelExecutionRequest
    ) {
      console.log(
        `Attempt ${request.attempt}: ` +
        `${request.providerId}/${request.modelId}`
      )

      if (
        request.modelId ===
        "openrouter:primary"
      ) {
        return {
          success: false,

          error:
            "Primary model unavailable.",
        }
      }

      return {
        success: true,
      }
    },
  }

const fallbackEngine =
  new RoutingAttemptEngine(
    fallbackExecutor
  )



/*
 * TEST 3
 *
 * Primary and fallback fail.
 * Backup succeeds.
 */
console.log(
  "\n3. MULTI-FAILURE → BACKUP SUCCESS"
)

const backupExecutor:
  ModelExecutor = {
    async execute(
      request: ModelExecutionRequest
    ) {
      console.log(
        `Attempt ${request.attempt}: ` +
        `${request.providerId}/${request.modelId}`
      )

      if (
        request.modelId !==
        "openai:backup"
      ) {
        return {
          success: false,

          error:
            "Model execution failed.",
        }
      }

      return {
        success: true,
      }
    },
  }

const backupEngine =
  new RoutingAttemptEngine(
    backupExecutor
  )



/*
 * TEST 4
 *
 * Everything fails.
 * MBO goes to manual execution.
 */
console.log(
  "\n4. EVERYTHING FAILS → MANUAL"
)

const failingExecutor:
  ModelExecutor = {
    async execute(
      request: ModelExecutionRequest
    ) {
      console.log(
        `Attempt ${request.attempt}: ` +
        `${request.providerId}/${request.modelId}`
      )

      return {
        success: false,

        error:
          "Simulated provider failure.",
      }
    },
  }

const failingEngine =
  new RoutingAttemptEngine(
    failingExecutor
  );

// Run routing attempt tests sequentially
(async () => {
  console.log(
    await primarySuccessEngine.execute(
      task,
      plan,
      policy
    )
  )

  console.log(
    await fallbackEngine.execute(
      task,
      plan,
      policy
    )
  )

  console.log(
    await backupEngine.execute(
      task,
      plan,
      policy
    )
  )

  console.log(
    await failingEngine.execute(
      task,
      plan,
      policy
    )
  )
})()
