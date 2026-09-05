import {
  PatternInsight,
} from "./PatternInsight"

import {
  OutcomeInsight,
} from "./OutcomeAnalyzer"

export interface ContentIntelligence {
  contentId: string

  patternSignal:
    | "positive"
    | "neutral"
    | "negative"

  patternConfidence:
    | "low"
    | "medium"
    | "high"

  patternDecision:
    | "observe"
    | "test"
    | "scale"
    | "reduce"

  businessValue:
    | "high"
    | "medium"
    | "low"

  recommendation: string
}

export class ContentIntelligenceEngine {
  combine(
    patternInsights: PatternInsight[],
    outcomeInsights: OutcomeInsight[]
  ): ContentIntelligence[] {
    const results: ContentIntelligence[] = []

    for (const outcome of outcomeInsights) {
      const relatedPatterns =
        patternInsights.filter(
          (pattern) =>
            pattern.contentIds.includes(outcome.contentId)
        )

      if (relatedPatterns.length === 0) {
        results.push({
          contentId: outcome.contentId,

          patternSignal: "neutral",

          patternConfidence: "low",

          patternDecision: "observe",

          businessValue:
            outcome.businessValue,

          recommendation:
            outcome.recommendation,
        })

        continue
      }

      const strongestPattern =
        this.selectStrongestPattern(
          relatedPatterns
        )

      results.push({
        contentId: outcome.contentId,

        patternSignal:
          strongestPattern.signal,

        patternConfidence:
          strongestPattern.confidence,

        patternDecision:
          strongestPattern.decision,

        businessValue:
          outcome.businessValue,

        recommendation:
          this.generateRecommendation(
            strongestPattern,
            outcome
          ),
      })
    }

    return results
  }

  private selectStrongestPattern(
    patterns: PatternInsight[]
  ): PatternInsight {
    return [...patterns].sort(
      (a, b) =>
        Math.abs(b.signalScore) -
        Math.abs(a.signalScore)
    )[0]
  }

  private generateRecommendation(
    pattern: PatternInsight,
    outcome: OutcomeInsight
  ): string {
    if (
      outcome.businessValue === "high" &&
      pattern.decision === "scale"
    ) {
      return (
        `Scale content similar to "${outcome.contentId}". ` +
        `The pattern has a strong signal and the content ` +
        `is producing high business value.`
      )
    }

    if (
      outcome.businessValue === "high"
    ) {
      return (
        `Prioritize "${outcome.contentId}" as a business-winning pattern. ` +
        `Create controlled variations and continue measuring revenue.`
      )
    }

    if (
      outcome.businessValue === "low" &&
      pattern.signal === "positive"
    ) {
      return (
        `"${outcome.contentId}" attracts attention but is not ` +
        `producing proportional business results. ` +
        `Improve the offer, CTA, targeting, or conversion path.`
      )
    }

    if (
      pattern.decision === "test"
    ) {
      return (
        `Test variations of "${outcome.contentId}" ` +
        `before scaling. More evidence is required.`
      )
    }

    return (
      `Continue monitoring "${outcome.contentId}" ` +
      `and collect additional performance and revenue data.`
    )
  }
}
