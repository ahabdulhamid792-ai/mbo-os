import {
  MBOAction,
} from "../action/ActionEngine"

import {
  ExecutionAuditEngine,
} from "../audit/ExecutionAuditEngine"

import {
  ExecutionLifecycleEngine,
} from "../execution/ExecutionLifecycleEngine"

import {
  ProviderExecutionEngine,
} from "../provider/ProviderExecutionEngine"

import {
  ProviderFailoverEngine,
} from "../provider/ProviderFailoverEngine"

import {
  ProviderRegistry,
} from "../provider/ProviderRegistry"

import {
  ManualExecutionProvider,
} from "../provider/ManualExecutionProvider"

import {
  ExecutionProvider,
  ExecutionRequest,
  ExecutionResult,
} from "../provider/ExecutionProvider"

import {
  ActionExecutionEngine,
} from "../execution/ActionExecutionEngine"

class FailingTestProvider
  implements ExecutionProvider {

  readonly id = "failing"

  readonly name = "Failing Test Provider"

  readonly capabilities =
    [
      "content-generation",
    ] as ExecutionProvider["capabilities"]

  canExecute(
    request: ExecutionRequest
  ): boolean {
    return Boolean(
      request.executionId &&
      request.actionId
    )
  }

  async execute(
    request: ExecutionRequest
  ): Promise<ExecutionResult> {

    console.log(
      "FAILING PROVIDER CALLED"
    )

    return {
      success: false,

      providerId:
        this.id,

      executionId:
        request.executionId,

      message:
        "Intentional provider failure.",

      error:
        "TEST_PROVIDER_FAILURE",
    }
  }
}


async function main() {

  console.log(
    "MBO PROVIDER FAILOVER TEST"
  )


  const executions =
    new ActionExecutionEngine()


  const audit =
    new ExecutionAuditEngine()


  const lifecycle =
    new ExecutionLifecycleEngine(
      executions,
      audit
    )


  const providers =
    new ProviderRegistry()


  providers.register(
    new FailingTestProvider()
  )


  providers.register(
    new ManualExecutionProvider()
  )


  const providerEngine =
    new ProviderExecutionEngine(
      executions,
      providers
    )


  const failover =
    new ProviderFailoverEngine(
      executions,
      providerEngine,
      providers,
      lifecycle
    )


  const action: MBOAction = {
  id:
    "action:test:provider-failover",

  decisionId:
    "decision:test:provider-failover",

  patternType:
    "hook",

  patternValue:
    "Provider failover test",

  actionType:
    "create",

  priority:
    "medium",

  urgency:
    "next",

  title:
    "Provider Failover Test",

  objective:
    "Verify that a failed provider can trigger failover.",

  steps: [
    "Execute with primary provider.",
    "Detect failure.",
    "Trigger fallback.",
  ],

  successMetrics: [
    "Failover triggered",
    "Fallback executed",
  ],

  requiresApproval:
    false,
}

const execution =
  executions.createExecution(
    action
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
    action.title,

  objective:
    action.objective,

  steps:
    action.steps,

  successMetrics:
    action.successMetrics,
}


  console.log(
    "\n1. CREATED EXECUTION"
  )

  console.log(
    execution
  )


  console.log(
    "\n2. RECORDING CREATION"
  )

  lifecycle.recordCreated({
    executionId:
      execution.id,

    capability:
      "content-generation",
  })


  console.log(
    "\n3. EXECUTING FAILOVER"
  )

  const result =
  await failover.execute(
    execution.id,
    "content-generation",
    request
  )


  console.log(
    "\n4. FAILOVER RESULT"
  )

  console.dir(
    result,
    {
      depth: null,
    }
  )


  console.log(
    "\n5. FINAL EXECUTION"
  )

  console.dir(
    executions.getExecution(
      execution.id
    ),
    {
      depth: null,
    }
  )


  console.log(
    "\nPROVIDER FAILOVER TEST COMPLETE"
  )
}


main().catch(
  (error) => {

    console.error(
      "\nPROVIDER FAILOVER TEST FAILED"
    )

    console.error(
      error
    )

    process.exitCode = 1
  }
)
