import {
  TrendDiscoveryEngine,
  TrendSignal,
} from "../analyzer/TrendDiscoveryEngine"

import {
  TrendOpportunityEngine,
} from "../analyzer/TrendOpportunityEngine"

const discovery =
  new TrendDiscoveryEngine()

const opportunities =
  new TrendOpportunityEngine()

const now =
  new Date().toISOString()

const signals: TrendSignal[] = [
  {
    id:
      "trend:football:breaking-transfer",

    niche:
      "football",

    topic:
      "Major Football Transfer",

    type:
      "news-event",

    velocity:
      "exploding",

    demandScore:
      94,

    relevanceScore:
      98,

    urgencyScore:
      95,

    source:
      "test-source",

    detectedAt:
      now,

    keywords: [
      "transfer",
      "football",
      "breaking",
    ],

    reason:
      "Major breaking football story.",
  },

  {
    id:
      "trend:football:tactics",

    niche:
      "football",

    topic:
      "Tactical Analysis",

    type:
      "search-demand",

    velocity:
      "rising",

    demandScore:
      78,

    relevanceScore:
      91,

    urgencyScore:
      40,

    source:
      "test-search",

    detectedAt:
      now,

    keywords: [
      "tactics",
      "formation",
      "analysis",
    ],

    reason:
      "Search demand is increasing.",
  },

  {
    id:
      "trend:football:old-topic",

    niche:
      "football",

    topic:
      "Old Football Story",

    type:
      "trending-topic",

    velocity:
      "falling",

    demandScore:
      35,

    relevanceScore:
      40,

    urgencyScore:
      15,

    source:
      "test-source",

    detectedAt:
      now,

    keywords: [
      "football",
    ],

    reason:
      "Interest is declining.",
  },
]

console.log(
  "MBO TREND OPPORTUNITY TEST"
)

console.log(
  "\n1. DISCOVERING FOOTBALL TRENDS"
)

const discovered =
  discovery.discover(
    "football",
    signals
  )

console.table(
  discovered.signals.map(
    (signal) => ({
      topic:
        signal.topic,

      velocity:
        signal.velocity,

      demand:
        signal.demandScore,

      relevance:
        signal.relevanceScore,

      urgency:
        signal.urgencyScore,
    })
  )
)

console.log(
  "\n2. EVALUATING OPPORTUNITIES"
)

const evaluated =
  opportunities.evaluateMany(
    discovered.signals
  )

console.table(
  evaluated.map(
    (opportunity) => ({
      topic:
        opportunity.topic,

      decision:
        opportunity.decision,

      priority:
        opportunity.priority,

      score:
        opportunity.opportunityScore,
    })
  )
)

console.log(
  "\n3. FULL OPPORTUNITIES"
)

console.log(
  evaluated
)

console.log(
  "\n4. MBO RECOMMENDATION"
)

for (
  const opportunity of
  evaluated
) {
  console.log(
    `${opportunity.priority.toUpperCase()} | ` +
    `${opportunity.decision.toUpperCase()} | ` +
    `${opportunity.topic} | ` +
    `${opportunity.reason}`
  )
}
