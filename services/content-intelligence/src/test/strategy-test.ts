import {
  ContentLearningEngine,
} from "../learning/ContentLearning"

import {
  StrategyEngine,
} from "../strategy/StrategyEngine"

const learningEngine =
  new ContentLearningEngine({
    remember() {},
    recall() {
      return []
    },
  })

const strategyEngine =
  new StrategyEngine()

const winningExperiment = {
  patternType: "hook",
  patternValue: "You're wasting hours every week",
  viewsLiftPercent: 53,
  engagementLiftPercent: 25,
  completionLiftPercent: 20,
  businessValue: "high" as const,
}

const decliningExperiment = {
  patternType: "format",
  patternValue: "long-form tutorial",
  viewsLiftPercent: -20,
  engagementLiftPercent: -15,
  completionLiftPercent: -18,
  businessValue: "low" as const,
}

const testingExperiment = {
  patternType: "topic",
  patternValue: "agency automation",
  viewsLiftPercent: 8,
  engagementLiftPercent: -2,
  completionLiftPercent: 4,
  businessValue: "medium" as const,
}

console.log("")
console.log("MBO STRATEGY ENGINE TEST")
console.log("")

console.log("WINNING PATTERN")
console.log("")

for (let i = 0; i < 10; i++) {
  learningEngine.recordExperiment(
    winningExperiment
  )
}

console.log(
  learningEngine.getLearning(
    "hook",
    "You're wasting hours every week"
  )
)

console.log("")
console.log("DECLINING PATTERN")
console.log("")

for (let i = 0; i < 10; i++) {
  learningEngine.recordExperiment(
    decliningExperiment
  )
}

console.log(
  learningEngine.getLearning(
    "format",
    "long-form tutorial"
  )
)

console.log("")
console.log("TESTING PATTERN")
console.log("")

for (let i = 0; i < 5; i++) {
  learningEngine.recordExperiment(
    testingExperiment
  )
}

console.log(
  learningEngine.getLearning(
    "topic",
    "agency automation"
  )
)

const recommendations =
  strategyEngine.generate(
    learningEngine.getLearnings()
  )

console.log("")
console.log("MBO STRATEGIC RECOMMENDATIONS")
console.log("")

console.table(
  recommendations.map(
    (recommendation) => ({
      pattern:
        recommendation.patternValue,

      priority:
        recommendation.priority,

      action:
        recommendation.action,

      confidence:
        recommendation.confidence,

      reason:
        recommendation.reason,

      recommendedAction:
        recommendation.recommendedAction,
    })
  )
)

console.log("")
console.log("FINAL DECISIONS")
console.log("")

for (
  const recommendation
  of recommendations
) {
  console.log(
    `[${recommendation.priority.toUpperCase()}] ` +
    `${recommendation.action.toUpperCase()} → ` +
    `${recommendation.patternValue}`
  )

  console.log(
    `Reason: ${recommendation.reason}`
  )

  console.log(
    `Action: ${recommendation.recommendedAction}`
  )

  console.log("")
}
