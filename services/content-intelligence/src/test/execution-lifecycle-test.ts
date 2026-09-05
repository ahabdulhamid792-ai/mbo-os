import {
  ActionExecutionEngine,
} from "../execution/ActionExecutionEngine"

import {
  ExecutionAuditEngine,
} from "../audit/ExecutionAuditEngine"

import {
  ExecutionLifecycleEngine,
} from "../execution/ExecutionLifecycleEngine"

import {
  MBOAction,
} from "../action/ActionEngine"

async function main() {
  const executions =
    new ActionExecutionEngine()

  const audit =
    new ExecutionAuditEngine()

  const lifecycle =
    new ExecutionLifecycleEngine(
      executions,
      audit
    )

  const action: MBOAction = {
    id:
      "action:decision:hook:lifecycle-test",

    decisionId:
      "decision:hook:lifecycle-test",

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
      "Create controlled variations.",

    steps: [
      "Create variations.",
      "Test variations.",
      "Measure results.",
    ],

    successMetrics: [
      "Views",
      "Engagement",
      "Revenue",
    ],

    requiresApproval:
      true,
  }

  const execution =
    executions.createExecution(
      action
    )

  const context = {
    executionId:
      execution.id,

    capability:
      "content-generation" as const,
  }

  console.log(
    "MBO EXECUTION LIFECYCLE TEST"
  )

  console.log(
    "\n1. CREATED"
  )

  console.log(
    lifecycle.recordCreated(
      context
    )
  )

  console.log(
    "\n2. POLICY EVALUATED"
  )

  console.log(
    lifecycle.recordApprovalRequired(
      context
    )
  )

  console.log(
    "\n3. APPROVING"
  )

  console.log(
    lifecycle.approve(
      context
    )
  )

  console.log(
    "\n4. STARTING"
  )

  console.log(
    lifecycle.start(
      context
    )
  )

  console.log(
    "\n5. PROVIDER SELECTED"
  )

  lifecycle.providerSelected(
    context,
    "manual"
  )

  console.log(
    "\n6. PROVIDER ATTEMPTED"
  )

  lifecycle.providerAttempted(
    context,
    "manual"
  )

  console.log(
    "\n7. PROVIDER SUCCEEDED"
  )

  lifecycle.providerSucceeded(
    context,
    "manual",
    'Execution prepared for "Lifecycle Test".'
  )

  console.log(
    "\n8. COMPLETING"
  )

  console.log(
    lifecycle.complete(
      context,
      'Execution prepared for "Lifecycle Test".',
      "manual"
    )
  )

  console.log(
    "\n9. FINAL EXECUTION"
  )

  console.log(
    lifecycle.getExecution(
      execution.id
    )
  )

  console.log(
    "\n10. AUDIT TRAIL"
  )

  console.table(
    lifecycle
      .getAudit(
        execution.id
      )
      .map(
        (event) => ({
          type:
            event.eventType,

          status:
            event.status,

          provider:
            event.providerId,

          message:
            event.message,

          timestamp:
            event.timestamp,
        })
      )
  )

  console.log(
    "\n11. AUDIT EVENT COUNT"
  )

  console.log(
    lifecycle
      .getAudit(
        execution.id
      )
      .length
  )
}

main().catch(
  (error) => {
    console.error(error)
    process.exit(1)
  }
)
