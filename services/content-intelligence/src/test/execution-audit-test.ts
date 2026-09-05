import {
  ExecutionAuditEngine,
} from "../audit/ExecutionAuditEngine"

async function main() {
  const audit =
    new ExecutionAuditEngine()

  const executionId =
    "execution:action:decision:hook:audit-test"

  console.log(
    "MBO EXECUTION AUDIT TEST"
  )

  console.log(
    "\n1. RECORDING EXECUTION CREATED"
  )

  console.log(
    audit.record({
      executionId,
      eventType:
        "execution-created",
      status:
        "pending",
      capability:
        "content-generation",
      message:
        "Execution was created.",
    })
  )

  console.log(
    "\n2. RECORDING POLICY DECISION"
  )

  console.log(
    audit.record({
      executionId,
      eventType:
        "policy-evaluated",
      status:
        "pending",
      capability:
        "content-generation",
      message:
        "Execution requires approval.",
      metadata: {
        decision:
          "approval-required",
        requiresApproval:
          true,
      },
    })
  )

  console.log(
    "\n3. RECORDING APPROVAL"
  )

  console.log(
    audit.record({
      executionId,
      eventType:
        "execution-approved",
      status:
        "approved",
      message:
        "Execution was approved by the owner.",
    })
  )

  console.log(
    "\n4. RECORDING PROVIDER SELECTION"
  )

  console.log(
    audit.record({
      executionId,
      eventType:
        "provider-selected",
      status:
        "executing",
      providerId:
        "manual",
      capability:
        "content-generation",
      message:
        'Provider "manual" was selected.',
    })
  )

  console.log(
    "\n5. RECORDING PROVIDER ATTEMPT"
  )

  console.log(
    audit.record({
      executionId,
      eventType:
        "provider-attempted",
      status:
        "executing",
      providerId:
        "manual",
      capability:
        "content-generation",
      message:
        'Provider "manual" execution started.',
    })
  )

  console.log(
    "\n6. RECORDING PROVIDER SUCCESS"
  )

  console.log(
    audit.record({
      executionId,
      eventType:
        "provider-succeeded",
      status:
        "completed",
      providerId:
        "manual",
      capability:
        "content-generation",
      message:
        'Provider "manual" completed successfully.',
    })
  )

  console.log(
    "\n7. RECORDING EXECUTION COMPLETED"
  )

  console.log(
    audit.record({
      executionId,
      eventType:
        "execution-completed",
      status:
        "completed",
      providerId:
        "manual",
      capability:
        "content-generation",
      message:
        "Execution completed successfully.",
    })
  )

  console.log(
    "\n8. ALL EVENTS"
  )

  console.table(
    audit
      .getEvents(executionId)
      .map((event) => ({
        id:
          event.id,
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
      }))
  )

  console.log(
    "\n9. LATEST EVENT"
  )

  console.log(
    audit.getLatestEvent(
      executionId
    )
  )

  console.log(
    "\n10. EVENT COUNT"
  )

  console.log(
    audit
      .getEvents(executionId)
      .length
  )

  console.log(
    "\n11. HAS EVENTS"
  )

  console.log(
    audit.hasEvents(
      executionId
    )
  )
}

main().catch(
  (error) => {
    console.error(error)
    process.exit(1)
  }
)
