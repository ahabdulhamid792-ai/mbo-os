import {
  ContentLearningEngine,
} from "../learning/ContentLearning"

import {
  StrategyEngine,
} from "../strategy/StrategyEngine"

import {
  DecisionEngine,
} from "../decision/DecisionEngine"

const learningEngine =
  new ContentLearningEngine({
    remember() {},
    recall() {
      return []
    },
  })

const strategyEngine =
  new StrategyEngine()

const decisionEngine =
  new DecisionEngine()

for (let i = 0; i < 10; i++) {
  learningEngine.recordExperiment({
    patternType: "hook",
    patternValue:
      "You're wasting hours every week",
    viewsLiftPercent: 53,
    engagementLiftPercent: 25,
    completionLiftPercent: 20,
    businessValue: "high",
  })
}

for (let i = 0; i < 10; i++) {
  learningEngine.recordExperiment({
    patternType: "format",
    patternValue:
      "long-form tutorial",
    viewsLiftPercent: -20,
    engagementLiftPercent: -15,
    completionLiftPercent: -18,
    businessValue: "low",
  })
}

for (let i = 0; i < 5; i++) {
  learningEngine.recordExperiment({
    patternType: "topic",
    patternValue:
      "agency automation",
    viewsLiftPercent: 8,
    engagementLiftPercent: -2,
    completionLiftPercent: 4,
    businessValue: "medium",
  })
}

const learnings =
  learningEngine.getLearnings()

const recommendations =
  strategyEngine.generate(
    learnings
  )

const decisions =
  decisionEngine.decide(
    recommendations
  )

console.log("")
console.log("MBO DECISION ENGINE")
console.log("")

console.table(
  decisions.map(
    (decision) => ({
      pattern:
        decision.patternValue,

      priority:
        decision.priority,

      action:
        decision.action,

      urgency:
        decision.urgency,

      confidence:
        decision.confidence,

      decision:
        decision.decision,
    })
  )
)

console.log("")
console.log("FINAL MBO DECISIONS")
console.log("")

for (
  const decision
  of decisions
) {
  console.log(
    `[${decision.urgency.toUpperCase()}] ` +
    `${decision.decision}`
  )

  console.log(
    `Reason: ${decision.reason}`
  )

  console.log(
    `Next step: ${decision.nextStep}`
  )

  console.log("")
}
