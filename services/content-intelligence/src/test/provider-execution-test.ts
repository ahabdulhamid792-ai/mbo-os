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
  ExecutionRequest,
} from "../provider/ExecutionProvider"

async function main() {

const executions =
  new ActionExecutionEngine()

const providers =
  new ProviderRegistry()

const manual =
  new ManualExecutionProvider()

providers.register(
  manual
)

const providerEngine =
  new ProviderExecutionEngine(
    executions,
    providers
  )

const execution =
  executions.createExecution({
    id:
      "action:decision:hook:provider-test",

    decisionId:
      "decision:hook:provider-test",

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

console.log(
  "MBO PROVIDER EXECUTION TEST"
)

console.log(
  "\nCREATED:"
)

console.log(execution)

console.log(
  "\nAPPROVING:"
)

console.log(
  executions.approve(
    execution.id
  )
)

const request:
  ExecutionRequest = {
    executionId:
      execution.id,

    actionId:
      execution.actionId,

    patternType:
      execution.patternType,

    patternValue:
      execution.patternValue,

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
  }

console.log(
  "\nEXECUTING THROUGH MANUAL PROVIDER:"
)

const result =
  await providerEngine.execute(
    execution.id,
    "manual",
    request
  )

console.log(result)

console.log(
  "\nREGISTERED PROVIDERS:"
)

console.table(
  providers
    .getAll()
    .map((provider) => ({
      id:
        provider.id,

      name:
        provider.name,

      capabilities:
        provider.capabilities.join(
          ", "
        ),
    }))
)

console.log(
  "\nFINAL EXECUTION:"
)

console.log(
  executions.getExecution(
    execution.id
  )
)

}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
