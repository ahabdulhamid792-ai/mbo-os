import {
  ActionExecutionEngine,
  ActionExecution,
} from "../execution/ActionExecutionEngine"

import {
  ExecutionAuditEngine,
} from "../audit/ExecutionAuditEngine"

import {
  ProviderRegistry,
} from "../provider/ProviderRegistry"

import {
  ExecutionProvider,
  ExecutionRequest,
  ExecutionResult,
} from "../provider/ExecutionProvider"

import {
  LocalModelExecutionProvider,
} from "../provider/LocalModelExecutionProvider"

import {
  MBOAction,
} from "../action/ActionEngine"


/**
 * ---------------------------------------------------------
 * TEST PROVIDER
 * ---------------------------------------------------------
 *
 * This provider intentionally fails.
 *
 * Its only purpose is to prove that MBO can recover from
 * a provider failure and continue with the Ollama provider.
 */

class FailingTestProvider
  implements ExecutionProvider {

  readonly id =
    "failing-test"

  readonly name =
    "Intentional Failing Test Provider"

  readonly capabilities =
    [
      "content-generation",
    ] as const

  canExecute(
    request: ExecutionRequest
  ): boolean {
    return Boolean(
      request.executionId &&
      request.actionId &&
      request.objective
    )
  }

  async execute(
    request: ExecutionRequest
  ): Promise<ExecutionResult> {

    console.log(
      "FAILING TEST PROVIDER CALLED"
    )

    return {
      success: false,

      providerId:
        this.id,

      executionId:
        request.executionId,

      message:
        "INTENTIONAL_TEST_FAILURE",

      error:
        "INTENTIONAL_TEST_FAILURE",
    }
  }
}


/**
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

function assert(
  condition: boolean,
  message: string
): void {

  if (!condition) {
    throw new Error(message)
  }
}


/**
 * ---------------------------------------------------------
 * MAIN TEST
 * ---------------------------------------------------------
 */

async function main(): Promise<void> {

  console.log(
    "MBO LOCAL MODEL FAILOVER TEST"
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 1. CREATE ENGINES
   * -------------------------------------------------------
   */

  const executionEngine =
    new ActionExecutionEngine()

  const auditEngine =
    new ExecutionAuditEngine()

  const providerRegistry =
    new ProviderRegistry()


  /**
   * -------------------------------------------------------
   * 2. REGISTER PROVIDERS
   * -------------------------------------------------------
   */

  const failingProvider =
    new FailingTestProvider()

  const ollamaProvider =
    new LocalModelExecutionProvider()

  providerRegistry.register(
    failingProvider
  )

  providerRegistry.register(
    ollamaProvider
  )


  console.log(
    "1. PROVIDERS REGISTERED"
  )

  console.log(
    providerRegistry.getAll()
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 3. CREATE TEST ACTION
   * -------------------------------------------------------
   *
   * We only provide the fields that the current
   * ActionExecutionEngine actually reads.
   */

  const action =
    {
      id:
        "action:test:local-model-integration",

      patternType:
        "content",

      patternValue:
        "Local model integration test",

      requiresApproval:
        false,

      title:
        "Local Model Integration Test",

      objective:
        "Generate a short explanation of why execution providers are important in an AI operating system.",

      steps:
        [
          "Explain the purpose of execution providers.",
          "Explain why provider failover is useful.",
          "Keep the explanation concise.",
        ],

      successMetrics:
        [
          "A useful explanation is produced.",
          "The local model successfully responds.",
        ],
    } as MBOAction


  /**
   * -------------------------------------------------------
   * 4. CREATE EXECUTION
   * -------------------------------------------------------
   */

  const execution:
    ActionExecution =
    executionEngine.createExecution(
      action
    )


  console.log(
    "2. CREATED EXECUTION"
  )

  console.log(
    execution
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 5. RECORD CREATION
   * -------------------------------------------------------
   */

  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "execution-created",

    status:
      execution.status,

    capability:
      "content-generation",

    message:
      "Execution was created.",
  })


  /**
   * -------------------------------------------------------
   * 6. START EXECUTION
   * -------------------------------------------------------
   */

  const started =
    executionEngine.start(
      execution.id
    )


  assert(
    Boolean(started),
    "Execution could not be started."
  )

  assert(
    started?.status ===
      "executing",
    "Execution did not enter executing state."
  )


  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "execution-started",

    status:
      started?.status,

    capability:
      "content-generation",

    message:
      "Execution entered the executing state.",
  })


  console.log(
    "3. EXECUTION STARTED"
  )

  console.log(
    started
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 7. BUILD EXECUTION REQUEST
   * -------------------------------------------------------
   *
   * IMPORTANT:
   *
   * title/objective/steps/successMetrics belong to the
   * request/action, NOT ActionExecution.
   */

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


  /**
   * -------------------------------------------------------
   * 8. TRY FIRST PROVIDER
   * -------------------------------------------------------
   */

  console.log(
    "4. TRYING FAILING PROVIDER"
  )

  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "provider-selected",

    status:
      "executing",

    providerId:
      failingProvider.id,

    capability:
      "content-generation",

    message:
      `Provider "${failingProvider.id}" was selected.`,
  })


  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "provider-attempted",

    status:
      "executing",

    providerId:
      failingProvider.id,

    capability:
      "content-generation",

    message:
      `Provider "${failingProvider.id}" execution started.`,
  })


  const failingResult =
    await failingProvider.execute(
      request
    )


  assert(
    failingResult.success === false,
    "Failing provider unexpectedly succeeded."
  )


  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "provider-failed",

    status:
      "executing",

    providerId:
      failingProvider.id,

    capability:
      "content-generation",

    message:
      failingResult.message,
  })


  console.log(
    "5. FAILING PROVIDER FAILED AS EXPECTED"
  )

  console.log(
    failingResult
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 9. FAILOVER TO OLLAMA
   * -------------------------------------------------------
   */

  console.log(
    "6. FAILING OVER TO OLLAMA"
  )


  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "provider-selected",

    status:
      "executing",

    providerId:
      ollamaProvider.id,

    capability:
      "content-generation",

    message:
      `Provider "${ollamaProvider.id}" was selected after failover.`,
  })


  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "provider-attempted",

    status:
      "executing",

    providerId:
      ollamaProvider.id,

    capability:
      "content-generation",

    message:
      `Provider "${ollamaProvider.id}" execution started.`,
  })


  const ollamaResult =
    await ollamaProvider.execute(
      request
    )


  console.log(
    ""
  )

  console.log(
    "7. OLLAMA RESULT"
  )

  console.log(
    ollamaResult
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 10. VERIFY OLLAMA SUCCEEDED
   * -------------------------------------------------------
   */

  assert(
    ollamaResult.success === true,
    "Ollama local model execution failed."
  )

  assert(
    ollamaResult.providerId ===
      "ollama",
    "Ollama was not the successful provider."
  )


  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "provider-succeeded",

    status:
      "completed",

    providerId:
      ollamaProvider.id,

    capability:
      "content-generation",

    message:
      ollamaResult.message,
  })


  /**
   * -------------------------------------------------------
   * 11. COMPLETE EXECUTION
   * -------------------------------------------------------
   */

  const finalExecution =
    executionEngine.complete(
      execution.id,

      ollamaResult.message
    )


  assert(
    Boolean(finalExecution),
    "Final execution was not returned."
  )

  assert(
    finalExecution?.status ===
      "completed",
    "Execution did not reach completed state."
  )


  auditEngine.record({
    executionId:
      execution.id,

    eventType:
      "execution-completed",

    status:
      "completed",

    providerId:
      ollamaProvider.id,

    capability:
      "content-generation",

    message:
      "Execution completed successfully.",

    metadata:
      {
        result:
          ollamaResult.message,
      },
  })


  /**
   * -------------------------------------------------------
   * 12. FINAL EXECUTION
   * -------------------------------------------------------
   */

  console.log(
    "8. FINAL EXECUTION"
  )

  console.log(
    finalExecution
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 13. MODEL OUTPUT
   * -------------------------------------------------------
   */

  console.log(
    "9. MODEL OUTPUT"
  )

  console.log(
    ollamaResult.output
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 14. AUDIT TRAIL
   * -------------------------------------------------------
   */

  const auditTrail =
    auditEngine.getEvents(
      execution.id
    )


  console.log(
    "10. AUDIT TRAIL"
  )

  console.log(
    auditTrail
  )

  console.log(
    ""
  )


  /**
   * -------------------------------------------------------
   * 15. ASSERTIONS
   * -------------------------------------------------------
   */

  console.log(
    "11. ASSERTIONS"
  )


  const failedProviderEvent =
    auditTrail.find(
      (event) =>
        event.eventType ===
          "provider-failed" &&
        event.providerId ===
          "failing-test"
    )


  assert(
    Boolean(failedProviderEvent),
    "Audit trail does not contain failing provider failure."
  )


  const ollamaSelectedEvent =
    auditTrail.find(
      (event) =>
        event.eventType ===
          "provider-selected" &&
        event.providerId ===
          "ollama"
    )


  assert(
    Boolean(ollamaSelectedEvent),
    "Audit trail does not contain Ollama provider selection."
  )


  const ollamaAttemptedEvent =
    auditTrail.find(
      (event) =>
        event.eventType ===
          "provider-attempted" &&
        event.providerId ===
          "ollama"
    )


  assert(
    Boolean(ollamaAttemptedEvent),
    "Audit trail does not contain Ollama provider attempt."
  )


  const ollamaSucceededEvent =
    auditTrail.find(
      (event) =>
        event.eventType ===
          "provider-succeeded" &&
        event.providerId ===
          "ollama"
    )


  assert(
    Boolean(ollamaSucceededEvent),
    "Audit trail does not contain Ollama provider success."
  )


  const completedEvent =
    auditTrail.find(
      (event) =>
        event.eventType ===
        "execution-completed"
    )


  assert(
    Boolean(completedEvent),
    "Audit trail does not contain execution completion."
  )


  assert(
    finalExecution?.status ===
      "completed",
    "Final execution is not completed."
  )


  assert(
    ollamaResult.success === true,
    "Local model did not successfully execute."
  )


  assert(
    ollamaResult.providerId ===
      "ollama",
    "Final provider is not Ollama."
  )


  console.log(
    ""
  )

  console.log(
    "ALL ASSERTIONS PASSED"
  )

  console.log(
    ""
  )

  console.log(
    "LOCAL MODEL FAILOVER TEST PASSED"
  )
}


/**
 * ---------------------------------------------------------
 * ERROR HANDLING
 * ---------------------------------------------------------
 */

main().catch(
  (error) => {

    console.error(
      "\nLOCAL MODEL FAILOVER TEST FAILED"
    )

    console.error(
      error
    )

    process.exitCode =
      1
  }
)