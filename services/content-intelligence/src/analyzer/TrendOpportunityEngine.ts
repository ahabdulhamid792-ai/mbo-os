import {
  TrendSignal,
} from "./TrendDiscoveryEngine"

export type OpportunityDecision =
  | "publish-now"
  | "prepare"
  | "monitor"
  | "ignore"

export type OpportunityPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"

export interface TrendOpportunity {
  id: string

  niche: string

  topic: string

  decision: OpportunityDecision

  priority: OpportunityPriority

  opportunityScore: number

  demandScore: number

  relevanceScore: number

  urgencyScore: number

  velocity:
    TrendSignal["velocity"]

  keywords: string[]

  reason: string

  createdAt: string
}

export class TrendOpportunityEngine {
  evaluate(
    signal: TrendSignal
  ): TrendOpportunity {
    const opportunityScore =
      this.calculateOpportunityScore(
        signal
      )

    const decision =
      this.determineDecision(
        signal,
        opportunityScore
      )

    const priority =
      this.determinePriority(
        signal,
        opportunityScore
      )

    return {
      id:
        `opportunity:${signal.id}`,

      niche:
        signal.niche,

      topic:
        signal.topic,

      decision,

      priority,

      opportunityScore,

      demandScore:
        signal.demandScore,

      relevanceScore:
        signal.relevanceScore,

      urgencyScore:
        signal.urgencyScore,

      velocity:
        signal.velocity,

      keywords:
        signal.keywords,

      reason:
        this.generateReason(
          signal,
          decision,
          priority
        ),

      createdAt:
        new Date().toISOString(),
    }
  }

  evaluateMany(
    signals: TrendSignal[]
  ): TrendOpportunity[] {
    return signals
      .map(
        (signal) =>
          this.evaluate(signal)
      )
      .sort(
        (a, b) =>
          b.opportunityScore -
          a.opportunityScore
      )
  }

  private calculateOpportunityScore(
    signal: TrendSignal
  ): number {
    return Math.round(
      signal.demandScore * 0.4 +
      signal.relevanceScore * 0.3 +
      signal.urgencyScore * 0.2 +
      this.velocityScore(
        signal.velocity
      ) * 0.1
    )
  }

  private determineDecision(
    signal: TrendSignal,
    score: number
  ): OpportunityDecision {
    if (
      score >= 85 &&
      signal.urgencyScore >= 70
    ) {
      return "publish-now"
    }

    if (
      score >= 70
    ) {
      return "prepare"
    }

    if (
      score >= 50
    ) {
      return "monitor"
    }

    return "ignore"
  }

  private determinePriority(
    signal: TrendSignal,
    score: number
  ): OpportunityPriority {
    if (
      score >= 90 &&
      signal.urgencyScore >= 80
    ) {
      return "critical"
    }

    if (
      score >= 75
    ) {
      return "high"
    }

    if (
      score >= 55
    ) {
      return "medium"
    }

    return "low"
  }

  private velocityScore(
    velocity:
      TrendSignal["velocity"]
  ): number {
    switch (velocity) {
      case "exploding":
        return 100

      case "rising":
        return 75

      case "stable":
        return 50

      case "falling":
        return 25
    }
  }

  private generateReason(
    signal: TrendSignal,
    decision:
      OpportunityDecision,
    priority:
      OpportunityPriority
  ): string {
    if (
      decision ===
      "publish-now"
    ) {
      return (
        `"${signal.topic}" has ` +
        `${priority} priority because demand, relevance, ` +
        `urgency, and trend velocity indicate a time-sensitive ` +
        `content opportunity.`
      )
    }

    if (
      decision ===
      "prepare"
    ) {
      return (
        `"${signal.topic}" has strong audience potential. ` +
        `Prepare content while monitoring the trend.`
      )
    }

    if (
      decision ===
      "monitor"
    ) {
      return (
        `"${signal.topic}" shows potential, but MBO needs ` +
        `more evidence before recommending immediate publishing.`
      )
    }

    return (
      `"${signal.topic}" does not currently meet ` +
      `the threshold for content production.`
    )
  }
}
