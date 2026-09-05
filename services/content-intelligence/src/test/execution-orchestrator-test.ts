import {
  ActionExecutionEngine,
} from "../execution/ActionExecutionEngine"

import {
  ExecutionOrchestrator,
} from "../execution/ExecutionOrchestrator"

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
  MBOAction,
} from "../action/ActionEngine"


class FailingOrchestratorTestProvider
  implements ExecutionProvider {

  readonly id = "failing-orchestrator-test"

  readonly name =
    "Failing Orchestrator Test Provider"

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
      "FAILING ORCHESTRATOR PROVIDER CALLED"
    )

    return {
      success: false,

      providerId:
        this.id,

      executionId:
        request.executionId,

      message:
        "Intentional orchestrator provider failure.",

      error:
        "TEST_ORCHESTRATOR_PROVIDER_FAILURE",
    }
  }
}


async function main() {

  console.log(
    "MBO EXECUTION ORCHESTRATOR TEST"
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
    new FailingOrchestratorTestProvider()
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


  const orchestrator =
    new ExecutionOrchestrator(
      executions,
      failover
    )


  const action: MBOAction = {

    id:
      "action:test:execution-orchestrator",

    decisionId:
      "decision:test:execution-orchestrator",

    patternType:
      "hook",

    patternValue:
      "Execution orchestrator test",

    actionType:
      "create",

    priority:
      "medium",

    urgency:
      "next",

    title:
      "Execution Orchestrator Test",

    objective:
      "Verify that the execution orchestrator delegates provider execution and failover correctly.",

    steps: [
      "Start execution.",
      "Attempt the first provider.",
      "Detect provider failure.",
      "Execute fallback provider.",
      "Complete execution.",
    ],

    successMetrics: [
      "Fallback provider executed",
      "Execution completed",
      "Provider attempts recorded",
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
    "\n2. EXECUTING THROUGH ORCHESTRATOR"
  )


  const result =
    await orchestrator.execute(
      execution.id,
      "content-generation",
      request
    )


  console.log(
    "\n3. ORCHESTRATION RESULT"
  )

  console.dir(
    result,
    {
      depth: null,
    }
  )


  console.log(
    "\n4. FINAL EXECUTION"
  )


  const finalExecution =
    executions.getExecution(
      execution.id
    )

  console.log(
    finalExecution
  )


  console.log(
    "\n5. AUDIT TRAIL"
  )


  const auditTrail =
    audit.getEvents(
      execution.id
    )


  console.table(
    auditTrail.map(
      (event) => ({
        eventType:
          event.eventType,

        status:
          event.status,

        providerId:
          event.providerId,

        capability:
          event.capability,

        message:
          event.message,
      })
    )
  )


  if (!result.success) {
    throw new Error(
      "Expected orchestration to succeed."
    )
  }


  if (
    result.providerId !==
    "manual"
  ) {
    throw new Error(
      `Expected manual fallback provider, received "${result.providerId}".`
    )
  }


  if (
    result.attempts.length !==
    2
  ) {
    throw new Error(
      `Expected 2 provider attempts, received ${result.attempts.length}.`
    )
  }


  if (
    result.attempts[0].providerId !==
    "failing-orchestrator-test"
  ) {
    throw new Error(
      "Expected the failing provider to be attempted first."
    )
  }


  if (
    result.attempts[0].success
  ) {
    throw new Error(
      "Expected the first provider attempt to fail."
    )
  }


  if (
    result.attempts[1].providerId !==
    "manual"
  ) {
    throw new Error(
      "Expected manual provider to be the fallback."
    )
  }


  if (
    !result.attempts[1].success
  ) {
    throw new Error(
      "Expected the fallback provider attempt to succeed."
    )
  }


  if (
    finalExecution?.status !==
    "completed"
  ) {
    throw new Error(
      `Expected final execution status to be completed, received "${finalExecution?.status}".`
    )
  }


  if (
    !auditTrail.some(
      (event) =>
        event.eventType ===
        "provider-failed"
    )
  ) {
    throw new Error(
      "Expected provider-failed audit event."
    )
  }


  if (
    !auditTrail.some(
      (event) =>
        event.eventType ===
        "provider-succeeded" &&
        event.providerId ===
        "manual"
    )
  ) {
    throw new Error(
      "Expected manual provider-succeeded audit event."
    )
  }


  if (
    !auditTrail.some(
      (event) =>
        event.eventType ===
        "execution-completed"
    )
  ) {
    throw new Error(
      "Expected execution-completed audit event."
    )
  }


  console.log(
    "\nEXECUTION ORCHESTRATOR TEST PASSED"
  )
}


main().catch(
  (error) => {
    console.error(error)
    process.exit(1)
  }
)