import {
  StrategyRecommendation,
} from "../strategy/StrategyEngine"

export type DecisionUrgency =
  | "immediate"
  | "next"
  | "monitor"

export interface MBODecision {
  id: string

  patternType: string

  patternValue: string

  priority:
    | "critical"
    | "high"
    | "medium"
    | "low"

  action:
    | "scale"
    | "test"
    | "reduce"
    | "observe"

  urgency: DecisionUrgency

  confidence:
    | "low"
    | "medium"
    | "high"

  decision: string

  reason: string

  nextStep: string
}

export class DecisionEngine {
  decide(
    recommendations: StrategyRecommendation[]
  ): MBODecision[] {
    return recommendations
      .map(
        (recommendation) =>
          this.createDecision(
            recommendation
          )
      )
      .sort(
        (a, b) =>
          this.urgencyScore(
            b.urgency
          ) -
          this.urgencyScore(
            a.urgency
          )
      )
  }

  private createDecision(
    recommendation: StrategyRecommendation
  ): MBODecision {
    if (
      recommendation.priority ===
        "critical" &&
      recommendation.action ===
        "scale"
    ) {
      return {
        id:
          `decision:${recommendation.id}`,

        patternType:
          recommendation.patternType,

        patternValue:
          recommendation.patternValue,

        priority:
          recommendation.priority,

        action:
          recommendation.action,

        urgency:
          "immediate",

        confidence:
          recommendation.confidence,

        decision:
          `Scale "${recommendation.patternValue}"`,

        reason:
          recommendation.reason,

        nextStep:
          recommendation.recommendedAction,
      }
    }

    if (
      recommendation.action ===
        "reduce" &&
      recommendation.confidence ===
        "high"
    ) {
      return {
        id:
          `decision:${recommendation.id}`,

        patternType:
          recommendation.patternType,

        patternValue:
          recommendation.patternValue,

        priority:
          recommendation.priority,

        action:
          recommendation.action,

        urgency:
          "immediate",

        confidence:
          recommendation.confidence,

        decision:
          `Reduce "${recommendation.patternValue}"`,

        reason:
          recommendation.reason,

        nextStep:
          recommendation.recommendedAction,
      }
    }

    if (
      recommendation.action ===
        "test"
    ) {
      return {
        id:
          `decision:${recommendation.id}`,

        patternType:
          recommendation.patternType,

        patternValue:
          recommendation.patternValue,

        priority:
          recommendation.priority,

        action:
          recommendation.action,

        urgency:
          "next",

        confidence:
          recommendation.confidence,

        decision:
          `Test "${recommendation.patternValue}"`,

        reason:
          recommendation.reason,

        nextStep:
          recommendation.recommendedAction,
      }
    }

    return {
      id:
        `decision:${recommendation.id}`,

      patternType:
        recommendation.patternType,

      patternValue:
        recommendation.patternValue,

      priority:
        recommendation.priority,

      action:
        recommendation.action,

      urgency:
        "monitor",

      confidence:
        recommendation.confidence,

      decision:
        `Monitor "${recommendation.patternValue}"`,

      reason:
        recommendation.reason,

      nextStep:
        recommendation.recommendedAction,
    }
  }

  private urgencyScore(
    urgency: DecisionUrgency
  ): number {
    switch (urgency) {
      case "immediate":
        return 3

      case "next":
        return 2

      case "monitor":
        return 1
    }
  }
}
