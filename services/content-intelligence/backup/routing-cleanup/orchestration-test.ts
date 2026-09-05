import {
  ActionExecutionEngine,
} from "../execution/ActionExecutionEngine"

import {
  ProviderExecutionEngine,
} from "../provider/ProviderExecutionEngine"

import {
  ProviderRegistry,
} from "../provider/ProviderRegistry"

import {
  ManualExecutionProvider,
} from "../provider/ManualExecutionProvider"

import {
  ProviderRouter,
} from "../provider/ProviderRouter"

import {
  ExecutionOrchestrator,
} from "../orchestration/ExecutionOrchestrator"

async function main() {
  const executions =
    new ActionExecutionEngine()

  const providers =
    new ProviderRegistry()

  providers.register(
    new ManualExecutionProvider()
  )

  const providerEngine =
    new ProviderExecutionEngine(
      executions,
      providers
    )

  const router =
    new ProviderRouter(
      providers
    )

  const orchestrator =
    new ExecutionOrchestrator(
      executions,
      providerEngine,
      router
    )

  const execution =
    executions.createExecution({
      id:
        "action:decision:hook:orchestration-test",

      decisionId:
        "decision:hook:orchestration-test",

      patternType:
        "hook",

      patternValue:
        "You're wasting hours every week",

      actionType:
        "create",

      priority:
        "critical",

      urgency:
        "immediate",

      title:
        'Scale "You\'re wasting hours every week"',

      objective:
        "Create controlled variations of the winning hook.",

      steps: [
        "Create 3 variations.",
        "Change one major variable.",
        "Publish variations.",
        "Compare results.",
      ],

      successMetrics: [
        "Views",
        "Engagement",
        "Completion",
        "Revenue",
      ],

      requiresApproval:
        true,
    })

  const request = {
    executionId:
      execution.id,

    actionId:
      execution.actionId,

    patternType:
      execution.patternType,

    patternValue:
      execution.patternValue,

    title:
      execution.patternValue,

    objective:
      "Create controlled variations.",

    steps: [
      "Create 3 variations.",
      "Publish variations.",
      "Measure results.",
    ],

    successMetrics: [
      "Views",
      "Engagement",
      "Revenue",
    ],
  }

  console.log(
    "MBO ORCHESTRATION TEST"
  )

  console.log(
    "\n1. CREATED EXECUTION"
  )

  console.log(
    execution
  )

  console.log(
    "\n2. ATTEMPT BEFORE APPROVAL"
  )

  console.log(
    await orchestrator.execute(
      execution.id,
      "content-generation",
      request
    )
  )

  console.log(
    "\n3. APPROVING"
  )

  console.log(
    executions.approve(
      execution.id
    )
  )

  console.log(
    "\n4. ORCHESTRATING"
  )

  console.log(
    await orchestrator.execute(
      execution.id,
      "content-generation",
      request
    )
  )

  console.log(
    "\n5. FINAL EXECUTION"
  )

  console.log(
    executions.getExecution(
      execution.id
    )
  )

  console.log(
    "\n6. REGISTERED PROVIDERS"
  )

  console.table(
    providers
      .getAll()
      .map(
        (provider) => ({
          id:
            provider.id,

          name:
            provider.name,

          capabilities:
            provider.capabilities.join(
              ", "
            ),
        })
      )
  )
}

main().catch(
  (error) => {
    console.error(
      error
    )

    process.exitCode = 1
  }
)
