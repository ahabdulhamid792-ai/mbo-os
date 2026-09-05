import {
  ContentLearning,
} from "../learning/ContentLearning"

export type StrategyPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"

export type StrategyAction =
  | "scale"
  | "test"
  | "reduce"
  | "observe"

export interface StrategyRecommendation {
  id: string

  patternType: string

  patternValue: string

  priority: StrategyPriority

  action: StrategyAction

  confidence:
    | "low"
    | "medium"
    | "high"

  reason: string

  expectedImpact: string

  recommendedAction: string
}

export class StrategyEngine {
  generate(
    learnings: ContentLearning[]
  ): StrategyRecommendation[] {
    return learnings
      .map((learning) =>
        this.createRecommendation(
          learning
        )
      )
      .sort(
        (a, b) =>
          this.priorityScore(b.priority) -
          this.priorityScore(a.priority)
      )
  }

  private createRecommendation(
    learning: ContentLearning
  ): StrategyRecommendation {
    if (
      learning.status === "established" &&
      learning.confidence === "high"
    ) {
      return {
        id: `strategy:${learning.id}`,

        patternType:
          learning.patternType,

        patternValue:
          learning.patternValue,

        priority: "critical",

        action: "scale",

        confidence:
          learning.confidence,

        reason:
          `"${learning.patternValue}" has produced ` +
          `repeatable positive evidence across ` +
          `${learning.experiments} experiments.`,

        expectedImpact:
          `Potential to improve content performance ` +
          `through controlled scaling.`,

        recommendedAction:
          `Create more content using "${learning.patternValue}" ` +
          `while monitoring business outcomes.`,
      }
    }

    if (
      learning.status === "established"
    ) {
      return {
        id: `strategy:${learning.id}`,

        patternType:
          learning.patternType,

        patternValue:
          learning.patternValue,

        priority: "high",

        action: "scale",

        confidence:
          learning.confidence,

        reason:
          `"${learning.patternValue}" is showing ` +
          `consistent positive evidence.`,

        expectedImpact:
          `Likely improvement in content performance ` +
          `if the pattern continues to hold.`,

        recommendedAction:
          `Increase controlled usage of "${learning.patternValue}" ` +
          `and continue measuring results.`,
      }
    }

    if (
      learning.status === "declining"
    ) {
      return {
        id: `strategy:${learning.id}`,

        patternType:
          learning.patternType,

        patternValue:
          learning.patternValue,

        priority: "high",

        action: "reduce",

        confidence:
          learning.confidence,

        reason:
          `"${learning.patternValue}" has produced ` +
          `repeated negative evidence.`,

        expectedImpact:
          `Reducing reliance on this pattern may ` +
          `prevent continued performance decline.`,

        recommendedAction:
          `Reduce usage of "${learning.patternValue}" ` +
          `and test alternative patterns.`,
      }
    }

    if (
      learning.status === "testing"
    ) {
      return {
        id: `strategy:${learning.id}`,

        patternType:
          learning.patternType,

        patternValue:
          learning.patternValue,

        priority: "medium",

        action: "test",

        confidence:
          learning.confidence,

        reason:
          `"${learning.patternValue}" has mixed or ` +
          `insufficient evidence.`,

        expectedImpact:
          `Additional experiments will improve ` +
          `MBO's confidence in the pattern.`,

        recommendedAction:
          `Run controlled variations of "${learning.patternValue}" ` +
          `before making a scaling decision.`,
      }
    }

    return {
      id: `strategy:${learning.id}`,

      patternType:
        learning.patternType,

      patternValue:
        learning.patternValue,

      priority: "low",

      action: "observe",

      confidence:
        learning.confidence,

      reason:
        `"${learning.patternValue}" does not yet have ` +
        `enough evidence for a strategic decision.`,

      expectedImpact:
        `More observations should improve MBO's understanding ` +
        `of this pattern.`,

      recommendedAction:
        `Continue collecting evidence without making ` +
        `a permanent strategic change.`,
    }
  }

  private priorityScore(
    priority: StrategyPriority
  ): number {
    switch (priority) {
      case "critical":
        return 4

      case "high":
        return 3

      case "medium":
        return 2

      case "low":
        return 1
    }
  }
}
