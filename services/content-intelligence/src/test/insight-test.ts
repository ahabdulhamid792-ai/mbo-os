import { PatternDetector } from "../analyzer/PatternDetector"
import { PatternInsightEngine } from "../analyzer/PatternInsight"
import { ContentPerformance } from "../interfaces/ContentPerformance"

const records: ContentPerformance[] = [
  {
    id: "video-1",
    businessId: "demo-business",
    platform: "youtube",
    contentType: "short",
    title: "Get more clients",
    hook: "You're losing clients because of this",
    topic: "client acquisition",
    format: "educational",
    durationSeconds: 25,
    views: 10000,
    likes: 900,
    comments: 120,
    shares: 180,
    saves: 100,
    completionRate: 82,
  },
  {
    id: "video-2",
    businessId: "demo-business",
    platform: "youtube",
    contentType: "short",
    title: "Agency mistakes",
    hook: "Most agency owners make this mistake",
    topic: "agency operations",
    format: "educational",
    durationSeconds: 28,
    views: 15000,
    likes: 1400,
    comments: 180,
    shares: 300,
    saves: 200,
    completionRate: 88,
  },
  {
    id: "video-3",
    businessId: "demo-business",
    platform: "youtube",
    contentType: "short",
    title: "Software review",
    hook: "Here is a useful tool",
    topic: "software",
    format: "review",
    durationSeconds: 65,
    views: 4000,
    likes: 180,
    comments: 20,
    shares: 30,
    saves: 20,
    completionRate: 42,
  },
  {
    id: "video-4",
    businessId: "demo-business",
    platform: "youtube",
    contentType: "short",
    title: "Save agency time",
    hook: "You're wasting hours every week",
    topic: "agency operations",
    format: "educational",
    durationSeconds: 30,
    views: 18000,
    likes: 1800,
    comments: 240,
    shares: 420,
    saves: 260,
    completionRate: 91,
  },
]

const detector = new PatternDetector()

const patterns = detector.detect(records)

const insightEngine = new PatternInsightEngine()

const insights = insightEngine.analyze(patterns)

console.log("\nMBO CONTENT INTELLIGENCE\n")

console.table(insights)

console.log("\nDECISIONS\n")

for (const insight of insights) {
  console.log(
    `[${insight.decision.toUpperCase()}] ${insight.value}`
  )

  console.log(
    `Signal: ${insight.signal} (${insight.signalScore.toFixed(2)})`
  )

  console.log(
    `Confidence: ${insight.confidence} (${insight.confidenceScore}%)`
  )

  console.log(
    `Recommendation: ${insight.recommendation}`
  )

  console.log("")
}
