import {
  ActionExecutionEngine,
} from "../execution/ActionExecutionEngine"

import {
  ExecutionPolicyEngine,
} from "../policy/ExecutionPolicyEngine"

import {
  MBOAction,
} from "../action/ActionEngine"

import {
  ExecutionRequest,
} from "../provider/ExecutionProvider"


const policy =
  new ExecutionPolicyEngine()

const executions =
  new ActionExecutionEngine()


function createAction(
  overrides:
    Partial<MBOAction> = {}
): MBOAction {
  return {
    id:
      "action:policy:test",

    decisionId:
      "decision:policy:test",

    patternType:
      "hook",

    patternValue:
      "You're wasting hours every week",

    actionType:
      "create",

    priority:
      "medium",

    urgency:
      "next",

    title:
      "Policy test action",

    objective:
      "Test execution policy.",

    steps: [
      "Create content.",
      "Measure performance.",
    ],

    successMetrics: [
      "Views",
      "Engagement",
    ],

    requiresApproval:
      false,

    ...overrides,
  }
}


function createRequest(
  overrides:
    Partial<ExecutionRequest> = {}
): ExecutionRequest {
  return {
    executionId:
      "execution:policy:test",

    actionId:
      "action:policy:test",

    patternType:
      "hook",

    patternValue:
      "You're wasting hours every week",

    title:
      "Policy test action",

    objective:
      "Test execution policy.",

    steps: [
      "Create content.",
      "Measure performance.",
    ],

    successMetrics: [
      "Views",
      "Engagement",
    ],

    ...overrides,
  }
}


/* =========================
 * TEST 1
 * Critical action
 * ========================= */

const criticalAction =
  createAction({
    priority:
      "critical",
  })

const criticalRequest =
  createRequest()

const criticalExecution =
  executions.createExecution(
    criticalAction
  )

const criticalResult =
  policy.evaluate({
    executionId:
      criticalExecution.id,

    action:
      criticalAction,

    capability:
      "content-generation",

    request:
      criticalRequest,
  })

console.log(
  "\nTEST 1 — CRITICAL ACTION"
)

console.log(
  criticalResult
)


/* =========================
 * TEST 2
 * Social publishing
 * ========================= */

const publishingAction =
  createAction({
    priority:
      "medium",

    actionType:
      "create",
  })

const publishingRequest =
  createRequest()

const publishingExecution =
  executions.createExecution(
    publishingAction
  )

const publishingResult =
  policy.evaluate({
    executionId:
      publishingExecution.id,

    action:
      publishingAction,

    capability:
      "social-publishing",

    request:
      publishingRequest,
  })

console.log(
  "\nTEST 2 — SOCIAL PUBLISHING"
)

console.log(
  publishingResult
)


/* =========================
 * TEST 3
 * Monitoring
 * ========================= */

const monitorAction =
  createAction({
    actionType:
      "monitor",

    priority:
      "low",
  })

const monitorRequest =
  createRequest()

const monitorExecution =
  executions.createExecution(
    monitorAction
  )

const monitorResult =
  policy.evaluate({
    executionId:
      monitorExecution.id,

    action:
      monitorAction,

    capability:
      "content-generation",

    request:
      monitorRequest,
  })

console.log(
  "\nTEST 3 — MONITORING"
)

console.log(
  monitorResult
)


/* =========================
 * TEST 4
 * Analytics
 * ========================= */

const analyticsAction =
  createAction({
    actionType:
      "monitor",

    priority:
      "low",
  })

const analyticsRequest =
  createRequest()

const analyticsExecution =
  executions.createExecution(
    analyticsAction
  )

const analyticsResult =
  policy.evaluate({
    executionId:
      analyticsExecution.id,

    action:
      analyticsAction,

    capability:
      "analytics",

    request:
      analyticsRequest,
  })

console.log(
  "\nTEST 4 — ANALYTICS"
)

console.log(
  analyticsResult
)


/* =========================
 * TEST 5
 * Normal allowed action
 * ========================= */

const normalAction =
  createAction({
    priority:
      "medium",

    actionType:
      "test",
  })

const normalRequest =
  createRequest()

const normalExecution =
  executions.createExecution(
    normalAction
  )

const normalResult =
  policy.evaluate({
    executionId:
      normalExecution.id,

    action:
      normalAction,

    capability:
      "content-generation",

    request:
      normalRequest,
  })

console.log(
  "\nTEST 5 — NORMAL ACTION"
)

console.log(
  normalResult
)


/* =========================
 * SUMMARY
 * ========================= */

console.log(
  "\nMBO POLICY SUMMARY"
)

console.table([
  {
    test:
      "Critical",

    decision:
      criticalResult.decision,

    allowed:
      criticalResult.allowed,

    approval:
      criticalResult.requiresApproval,
  },

  {
    test:
      "Social Publishing",

    decision:
      publishingResult.decision,

    allowed:
      publishingResult.allowed,

    approval:
      publishingResult.requiresApproval,
  },

  {
    test:
      "Monitoring",

    decision:
      monitorResult.decision,

    allowed:
      monitorResult.allowed,

    approval:
      monitorResult.requiresApproval,
  },

  {
    test:
      "Analytics",

    decision:
      analyticsResult.decision,

    allowed:
      analyticsResult.allowed,

    approval:
      analyticsResult.requiresApproval,
  },

  {
    test:
      "Normal Action",

    decision:
      normalResult.decision,

    allowed:
      normalResult.allowed,

    approval:
      normalResult.requiresApproval,
  },
])
