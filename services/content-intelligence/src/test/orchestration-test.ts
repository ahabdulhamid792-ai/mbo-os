import {
  ModelRoutingEngine,
  ModelRoutingCatalog,
  RoutingPolicy,
} from "../provider/ModelRoutingEngine"

import {
  RoutingAttemptEngine,
} from "../provider/RoutingAttemptEngine"

import {
  ProviderModelConfiguration,
} from "../provider/ProviderConfiguration"

import {
  ExecutionOrchestrator,
  ExecutionTask,
} from "../orchestration/ExecutionOrchestrator"

const models:
  ProviderModelConfiguration[] = [
    {
      id:
        "openrouter:primary",

      providerId:
        "openrouter",

      name:
        "Primary Model",

      enabled:
        true,

      capabilities: [
        "content-generation",
        "free",
      ],

      role:
        "primary",

      priority:
        10,
    },

    {
      id:
        "minimax:fallback",

      providerId:
        "minimax",

      name:
        "Fallback Model",

      enabled:
        true,

      capabilities: [
        "content-generation",
        "free",
      ],

      role:
        "fallback",

      priority:
        20,
    },

    {
      id:
        "openai:backup",

      providerId:
        "openai",

      name:
        "Backup Model",

      enabled:
        true,

      capabilities: [
        "content-generation",
        "free",
      ],

      role:
        "backup",

      priority:
        30,
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
      ].includes(
        providerId
      )
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

    allowPremiumModels:
      true,

    allowPaidModels:
      true,

    allowFreeModels:
      true,

    maxRetries:
      2,

    allowProviderFallback:
      true,

    allowModelFallback:
      true,

    allowManualFallback:
      true,
  }

const orchestrator =
  new ExecutionOrchestrator(
    routingEngine,

    (executor) =>
      new RoutingAttemptEngine(
        executor
      ),

    policy
  )

const task:
  ExecutionTask = {
    taskId:
      "task:orchestration-test",

    type:
      "content-generation",

    capability:
      "content-generation",

    objective: {
      objective:
        "Generate a piece of content.",
    } as any,

    input: {
      prompt:
        "Generate a piece of content.",
    },
  }

const handler = {
  async execute(
    executionTask: ExecutionTask,
    modelId: string,
    providerId: string
  ) {
    console.log(
      `Executing ${providerId}/${modelId}`
    )

    if (
      modelId ===
      "openrouter:primary"
    ) {
      return {
        message:
          "Primary model executed successfully.",
      }
    }

    throw new Error(
      "Unexpected fallback execution."
    )
  },
}

async function main() {
  console.log(
    "MBO EXECUTION ORCHESTRATION TEST"
  )

  console.log(
    "\n1. ROUTING PLAN"
  )

  const routingTask = {
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
    routingEngine.route(
      routingTask,
      policy
    )

  console.dir(
    plan,
    {
      depth:
        null,
    }
  )

  console.log(
    "\n2. EXECUTION"
  )

  const result =
    await orchestrator.execute(
      task,
      handler
    )

  console.dir(
    result,
    {
      depth:
        null,
    }
  )

  console.log(
    "\n3. RESULT"
  )

  if (
    result.success
  ) {
    console.log(
      "ORCHESTRATION SUCCESS"
    )
  } else {
    console.log(
      "ORCHESTRATION FAILED"
    )

    console.error(
      result.error
    )

    process.exitCode =
      1
  }
}

main().catch(
  (error) => {
    console.error(
      "ORCHESTRATION TEST FAILED"
    )

    console.error(
      error
    )

    process.exitCode =
      1
  }
)
