import {
  ContentPattern,
} from "./PatternDetector"

export type PatternSignal =
  | "positive"
  | "neutral"
  | "negative"

export type PatternConfidence =
  | "low"
  | "medium"
  | "high"

export type PatternDecision =
  | "observe"
  | "test"
  | "scale"
  | "reduce"

export interface PatternInsight {
  type: ContentPattern["type"]

  value: string

  contentIds: string[]

  sampleSize: number

  averageViews: number

  averageEngagementRate: number

  averageCompletionRate: number

  viewsLiftPercent: number

  engagementLiftPercent: number

  completionLiftPercent: number

  signal: PatternSignal

  signalScore: number

  confidence: PatternConfidence

  confidenceScore: number

  decision: PatternDecision

  recommendation: string
}

export class PatternInsightEngine {
  analyze(
    patterns: ContentPattern[]
  ): PatternInsight[] {
    if (patterns.length === 0) {
      return []
    }

    const baseline =
      this.calculateBaseline(patterns)

    return patterns.map((pattern) => {
      const viewsLiftPercent =
        this.calculateLift(
          pattern.averageViews,
          baseline.averageViews
        )

      const engagementLiftPercent =
        this.calculateLift(
          pattern.averageEngagementRate,
          baseline.averageEngagementRate
        )

      const completionLiftPercent =
        this.calculateLift(
          pattern.averageCompletionRate,
          baseline.averageCompletionRate
        )

      const signalScore =
        this.calculateSignalScore(
          viewsLiftPercent,
          engagementLiftPercent,
          completionLiftPercent
        )

      const signal =
        this.calculateSignal(signalScore)

      const confidence =
        this.calculateConfidence(
          pattern.sampleSize
        )

      const confidenceScore =
        this.calculateConfidenceScore(
          pattern.sampleSize
        )

      const decision =
        this.calculateDecision(
          signal,
          confidence,
          signalScore
        )

      const recommendation =
        this.generateRecommendation(
          pattern,
          signal,
          confidence,
          decision
        )

      return {
        type: pattern.type,

        value: pattern.value,

        contentIds: pattern.contentIds,

        sampleSize: pattern.sampleSize,

        averageViews:
          pattern.averageViews,

        averageEngagementRate:
          pattern.averageEngagementRate,

        averageCompletionRate:
          pattern.averageCompletionRate,

        viewsLiftPercent,

        engagementLiftPercent,

        completionLiftPercent,

        signal,

        signalScore,

        confidence,

        confidenceScore,

        decision,

        recommendation,
      }
    })
  }

  private calculateBaseline(
    patterns: ContentPattern[]
  ) {
    const totalSamples =
      patterns.reduce(
        (total, pattern) =>
          total + pattern.sampleSize,
        0
      )

    if (totalSamples === 0) {
      return {
        averageViews: 0,
        averageEngagementRate: 0,
        averageCompletionRate: 0,
      }
    }

    return {
      averageViews:
        patterns.reduce(
          (total, pattern) =>
            total +
            pattern.averageViews *
              pattern.sampleSize,
          0
        ) / totalSamples,

      averageEngagementRate:
        patterns.reduce(
          (total, pattern) =>
            total +
            pattern.averageEngagementRate *
              pattern.sampleSize,
          0
        ) / totalSamples,

      averageCompletionRate:
        patterns.reduce(
          (total, pattern) =>
            total +
            pattern.averageCompletionRate *
              pattern.sampleSize,
          0
        ) / totalSamples,
    }
  }

  private calculateLift(
    value: number,
    baseline: number
  ): number {
    if (baseline === 0) {
      return 0
    }

    return (
      ((value - baseline) / baseline) *
      100
    )
  }

  private calculateSignalScore(
    viewsLift: number,
    engagementLift: number,
    completionLift: number
  ): number {
    return (
      viewsLift * 0.4 +
      engagementLift * 0.3 +
      completionLift * 0.3
    )
  }

  private calculateSignal(
    signalScore: number
  ): PatternSignal {
    if (signalScore >= 15) {
      return "positive"
    }

    if (signalScore <= -15) {
      return "negative"
    }

    return "neutral"
  }

  private calculateConfidence(
    sampleSize: number
  ): PatternConfidence {
    if (sampleSize < 3) {
      return "low"
    }

    if (sampleSize < 10) {
      return "medium"
    }

    return "high"
  }

  private calculateConfidenceScore(
    sampleSize: number
  ): number {
    if (sampleSize < 3) {
      return 25
    }

    if (sampleSize < 5) {
      return 50
    }

    if (sampleSize < 10) {
      return 70
    }

    if (sampleSize < 20) {
      return 85
    }

    return 95
  }

  private calculateDecision(
    signal: PatternSignal,
    confidence: PatternConfidence,
    signalScore: number
  ): PatternDecision {
    if (signal === "neutral") {
      return "observe"
    }

    if (confidence === "low") {
      return "test"
    }

    if (
      signal === "positive" &&
      confidence === "medium"
    ) {
      return "test"
    }

    if (
      signal === "positive" &&
      confidence === "high" &&
      signalScore >= 20
    ) {
      return "scale"
    }

    if (
      signal === "negative" &&
      confidence === "high" &&
      signalScore <= -20
    ) {
      return "reduce"
    }

    return "observe"
  }

  private generateRecommendation(
    pattern: ContentPattern,
    signal: PatternSignal,
    confidence: PatternConfidence,
    decision: PatternDecision
  ): string {
    if (decision === "scale") {
      return (
        `Scale "${pattern.value}" carefully. ` +
        `The pattern shows a ${signal} signal ` +
        `with ${confidence} confidence. ` +
        `Continue testing creative variations rather than copying one execution.`
      )
    }

    if (decision === "reduce") {
      return (
        `Reduce emphasis on "${pattern.value}". ` +
        `The pattern shows a sustained negative signal ` +
        `with ${confidence} confidence. ` +
        `Test alternatives before removing it completely.`
      )
    }

    if (decision === "test") {
      return (
        `Test "${pattern.value}" with more content. ` +
        `There is a ${signal} performance signal, ` +
        `but the current evidence is only ${confidence} confidence.`
      )
    }

    return (
      `Observe "${pattern.value}" and collect more evidence ` +
      `before making a strategic change.`
    )
  }
}
