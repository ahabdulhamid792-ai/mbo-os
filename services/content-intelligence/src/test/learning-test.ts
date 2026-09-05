import { ContentLearningEngine } from "../learning/ContentLearning"

const memory = {
  remember(memory: any) {
    console.log("MEMORY:", memory)
  },

  recall(query: string) {
    return []
  },
}

const engine = new ContentLearningEngine(memory)

const experiments = [
  {
    patternType: "hook",
    patternValue: "You're wasting hours every week",
    viewsLiftPercent: 53,
    engagementLiftPercent: 25,
    completionLiftPercent: 20,
    businessValue: "high" as const,
  },
  {
    patternType: "hook",
    patternValue: "You're wasting hours every week",
    viewsLiftPercent: 31,
    engagementLiftPercent: 18,
    completionLiftPercent: 15,
    businessValue: "high" as const,
  },
  {
    patternType: "hook",
    patternValue: "You're wasting hours every week",
    viewsLiftPercent: 27,
    engagementLiftPercent: 16,
    completionLiftPercent: 14,
    businessValue: "high" as const,
  },
]

for (const experiment of experiments) {
  engine.recordExperiment(experiment)
}

console.log("\nMBO CONTENT LEARNING\n")

console.table(engine.getLearnings())

console.log("\nMEMORY ENGINE\n")

console.table(memory.recall("wasting hours"))
