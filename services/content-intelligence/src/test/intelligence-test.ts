import {
  PatternDetector,
} from "../analyzer/PatternDetector"

import {
  PatternInsightEngine,
} from "../analyzer/PatternInsight"

import {
  OutcomeAnalyzer,
} from "../analyzer/OutcomeAnalyzer"

import {
  ContentIntelligenceEngine,
} from "../analyzer/ContentIntelligenceEngine"

import {
  ContentPerformance,
} from "../interfaces/ContentPerformance"

import {
  BusinessOutcome,
} from "../interfaces/BusinessOutcome"


const content: ContentPerformance[] = [
  {
    id: "video-001",
    businessId: "demo-business",
    contentType: "short",
    title: "You're wasting hours every week",
    platform: "youtube",
    topic: "agency operations",
    hook: "You're wasting hours every week",
    format: "educational",
    durationSeconds: 24,
    views: 28000,
    likes: 3200,
    comments: 410,
    shares: 850,
    saves: 1100,
    completionRate: 91,
  },

  {
    id: "video-002",
    businessId: "demo-business",
    contentType: "short",
    title: "Most agency owners make this mistake",
    platform: "youtube",
    topic: "agency operations",
    hook: "Most agency owners make this mistake",
    format: "educational",
    durationSeconds: 22,
    views: 21000,
    likes: 2400,
    comments: 280,
    shares: 620,
    saves: 900,
    completionRate: 88,
  },

  {
    id: "video-003",
    businessId: "demo-business",
    contentType: "short",
    title: "Here is a useful tool",
    platform: "youtube",
    topic: "software",
    hook: "Here is a useful tool",
    format: "review",
    durationSeconds: 65,
    views: 5000,
    likes: 280,
    comments: 35,
    shares: 40,
    saves: 80,
    completionRate: 42,
  },
]


const outcomes: BusinessOutcome[] = [
  {
    contentId: "video-001",

    impressions: 42000,

    views: 28000,

    engagements: 5560,

    leads: 210,

    qualifiedLeads: 94,

    conversions: 31,

    revenue: 4650,

    conversionRate:
      (31 / 210) * 100,

    leadRate:
      (210 / 28000) * 100,

    revenuePerThousandViews:
      (4650 / 28000) * 1000,
  },

  {
    contentId: "video-002",

    impressions: 31000,

    views: 21000,

    engagements: 4200,

    leads: 120,

    qualifiedLeads: 51,

    conversions: 17,

    revenue: 2550,

    conversionRate:
      (17 / 120) * 100,

    leadRate:
      (120 / 21000) * 100,

    revenuePerThousandViews:
      (2550 / 21000) * 1000,
  },

  {
    contentId: "video-003",

    impressions: 8500,

    views: 5000,

    engagements: 435,

    leads: 8,

    qualifiedLeads: 2,

    conversions: 1,

    revenue: 150,

    conversionRate:
      (1 / 8) * 100,

    leadRate:
      (8 / 5000) * 100,

    revenuePerThousandViews:
      (150 / 5000) * 1000,
  },
]


const detector =
  new PatternDetector()

const insightEngine =
  new PatternInsightEngine()

const outcomeAnalyzer =
  new OutcomeAnalyzer()

const intelligenceEngine =
  new ContentIntelligenceEngine()


const patterns =
  detector.detect(content)

const patternInsights =
  insightEngine.analyze(patterns)

const outcomeInsights =
  outcomeAnalyzer.analyze(outcomes)

const intelligence =
  intelligenceEngine.combine(
    patternInsights,
    outcomeInsights
  )


console.log("\nMBO CONTENT INTELLIGENCE\n")

console.table(intelligence)

console.log("\nSTRATEGIC RECOMMENDATIONS\n")

for (const item of intelligence) {
  console.log(
    `[${item.businessValue.toUpperCase()}] ` +
    `${item.contentId}`
  )

  console.log(
    `Signal: ${item.patternSignal}`
  )

  console.log(
    `Confidence: ${item.patternConfidence}`
  )

  console.log(
    `Decision: ${item.patternDecision}`
  )

  console.log(
    `Recommendation: ${item.recommendation}\n`
  )
}
