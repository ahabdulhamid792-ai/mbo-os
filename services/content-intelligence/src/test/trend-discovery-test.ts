import {
  TrendDiscoveryEngine,
  TrendSignal,
} from "../analyzer/TrendDiscoveryEngine"

const engine =
  new TrendDiscoveryEngine()

const now =
  new Date().toISOString()

const signals: TrendSignal[] = [
  {
    id: "trend:football:transfer",
    niche: "football",

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
      "breaking news",
    ],

    reason:
      "High current interest and immediate news value.",
  },

  {
    id: "trend:football:tactics",
    niche: "football",

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
      "football analysis",
    ],

    reason:
      "Search demand is increasing.",
  },

  {
    id: "trend:fitness:workout",
    niche: "fitness",

    topic:
      "Home Workout",

    type:
      "trending-topic",

    velocity:
      "rising",

    demandScore:
      85,

    relevanceScore:
      90,

    urgencyScore:
      35,

    source:
      "test-source",

    detectedAt:
      now,

    keywords: [
      "workout",
      "home fitness",
    ],

    reason:
      "Growing interest in home workouts.",
  },
]

console.log(
  "MBO TREND DISCOVERY TEST"
)

console.log(
  "\n1. ALL SIGNALS"
)

console.table(
  signals.map(
    (signal) => ({
      niche:
        signal.niche,

      topic:
        signal.topic,

      type:
        signal.type,

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
  "\n2. FOOTBALL DISCOVERY"
)

const football =
  engine.discover(
    "football",
    signals
  )

console.log(
  football
)

console.log(
  "\n3. RANKED FOOTBALL OPPORTUNITIES"
)

console.table(
  football.signals.map(
    (signal) => ({
      topic:
        signal.topic,

      type:
        signal.type,

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
  "\n4. FITNESS DISCOVERY"
)

console.log(
  engine.discover(
    "fitness",
    signals
  )
)
