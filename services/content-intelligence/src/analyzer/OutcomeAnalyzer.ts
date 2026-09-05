import { BusinessOutcome } from "../interfaces/BusinessOutcome"

export interface OutcomeInsight {
  contentId: string

  views: number

  leads: number

  qualifiedLeads: number

  conversions: number

  revenue: number

  leadRate: number

  conversionRate: number

  revenuePerThousandViews: number

  businessValue:
    | "high"
    | "medium"
    | "low"

  recommendation: string
}

export class OutcomeAnalyzer {
  analyze(
    outcomes: BusinessOutcome[]
  ): OutcomeInsight[] {
    if (outcomes.length === 0) {
      return []
    }

    const averageRevenuePerThousandViews =
      outcomes.reduce(
        (total, outcome) =>
          total +
          outcome.revenuePerThousandViews,
        0
      ) / outcomes.length

    return outcomes.map((outcome) => {
      const businessValue =
        this.calculateBusinessValue(
          outcome,
          averageRevenuePerThousandViews
        )

      const recommendation =
        this.generateRecommendation(
          outcome,
          businessValue
        )

      return {
        contentId: outcome.contentId,

        views: outcome.views,

        leads: outcome.leads,

        qualifiedLeads:
          outcome.qualifiedLeads,

        conversions:
          outcome.conversions,

        revenue: outcome.revenue,

        leadRate: outcome.leadRate,

        conversionRate:
          outcome.conversionRate,

        revenuePerThousandViews:
          outcome.revenuePerThousandViews,

        businessValue,

        recommendation,
      }
    })
  }

  private calculateBusinessValue(
    outcome: BusinessOutcome,
    averageRevenuePerThousandViews: number
  ):
    | "high"
    | "medium"
    | "low" {
    if (
      outcome.revenuePerThousandViews >=
        averageRevenuePerThousandViews * 1.5 &&
      outcome.conversions > 0
    ) {
      return "high"
    }

    if (
      outcome.revenuePerThousandViews >=
      averageRevenuePerThousandViews * 0.75
    ) {
      return "medium"
    }

    return "low"
  }

  private generateRecommendation(
    outcome: BusinessOutcome,
    businessValue:
      | "high"
      | "medium"
      | "low"
  ): string {
    if (businessValue === "high") {
      return (
        `Prioritize content similar to ${outcome.contentId}. ` +
        `It is generating strong business value relative to its reach.`
      )
    }

    if (businessValue === "low") {
      return (
        `Do not optimize for views alone on ${outcome.contentId}. ` +
        `Test stronger calls-to-action, offers, or audience targeting.`
      )
    }

    return (
      `Continue testing ${outcome.contentId} ` +
      `and monitor leads, conversions, and revenue.`
    )
  }
}
