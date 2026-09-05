export type TrendSignalType =
  | "trending-topic"
  | "search-demand"
  | "news-event"
  | "rising-interest"

export type TrendVelocity =
  | "exploding"
  | "rising"
  | "stable"
  | "falling"

export interface TrendSignal {
  id: string

  niche: string

  topic: string

  type: TrendSignalType

  velocity: TrendVelocity

  demandScore: number

  relevanceScore: number

  urgencyScore: number

  source: string

  detectedAt: string

  expiresAt?: string

  keywords: string[]

  reason: string
}

export interface TrendDiscoveryResult {
  niche: string

  signals: TrendSignal[]

  generatedAt: string
}

export class TrendDiscoveryEngine {
  discover(
    niche: string,
    signals: TrendSignal[]
  ): TrendDiscoveryResult {
    const matchingSignals =
      signals.filter(
        (signal) =>
          signal.niche.toLowerCase() ===
          niche.toLowerCase()
      )

    return {
      niche,

      signals:
        this.rank(matchingSignals),

      generatedAt:
        new Date().toISOString(),
    }
  }

  rank(
    signals: TrendSignal[]
  ): TrendSignal[] {
    return [...signals].sort(
      (a, b) =>
        this.priorityScore(b) -
        this.priorityScore(a)
    )
  }

  private priorityScore(
    signal: TrendSignal
  ): number {
    return (
      signal.demandScore * 0.4 +
      signal.relevanceScore * 0.3 +
      signal.urgencyScore * 0.2 +
      this.velocityScore(
        signal.velocity
      ) * 0.1
    )
  }

  private velocityScore(
    velocity: TrendVelocity
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
}
