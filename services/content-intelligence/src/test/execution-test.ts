import {
  ActionExecutionEngine,
} from "../execution/ActionExecutionEngine"

import {
  MBOAction,
} from "../action/ActionEngine"

const executionEngine =
  new ActionExecutionEngine()

const action: MBOAction = {
  id: "action:decision:hook:you're-wasting-hours-every-week",

  decisionId:
    "decision:hook:you're-wasting-hours-every-week",

  patternType: "hook",

  patternValue:
    "You're wasting hours every week",

  actionType: "create",

  priority: "critical",

  urgency: "immediate",

  title:
    `Scale "You're wasting hours every week"`,

  objective:
    `Increase the use of "You're wasting hours every week" while preserving measurement.`,

  steps: [
    `Create 3 controlled variations.`,
    "Keep the winning element consistent.",
    "Change one major variable.",
    "Publish according to the normal schedule.",
    "Compare against the baseline.",
  ],

  successMetrics: [
    "Views",
    "Engagement rate",
    "Completion rate",
    "Leads",
    "Conversions",
    "Revenue",
  ],

  requiresApproval: true,
}

console.log(
  "MBO ACTION EXECUTION ENGINE TEST"
)

const execution =
  executionEngine.createExecution(
    action
  )

console.log(
  "CREATED EXECUTION"
)

console.log(execution)

console.log(
  "\nATTEMPT START BEFORE APPROVAL"
)

const blocked =
  executionEngine.start(
    execution.id
  )

console.log(blocked)

console.log(
  "\nAPPROVING EXECUTION"
)

const approved =
  executionEngine.approve(
    execution.id
  )

console.log(approved)

console.log(
  "\nSTARTING EXECUTION"
)

const started =
  executionEngine.start(
    execution.id
  )

console.log(started)

console.log(
  "\nCOMPLETING EXECUTION"
)

const completed =
  executionEngine.complete(
    execution.id,
    "Three controlled content variations were created successfully."
  )

console.log(completed)

console.log(
  "\nALL EXECUTIONS"
)

console.table(
  executionEngine
    .getExecutions()
    .map((item) => ({
      id: item.id,
      status: item.status,
      approved: item.approved,
      pattern: item.patternValue,
      result: item.result,
    }))
)
