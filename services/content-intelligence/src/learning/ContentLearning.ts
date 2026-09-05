import {
  MemoryEngine,
  MemoryItem,
} from "../../../memory-engine/dist"

export type LearningConfidence =
  | "low"
  | "medium"
  | "high"

export type LearningStatus =
  | "observing"
  | "testing"
  | "established"
  | "declining"

export interface ContentLearning {
  id: string

  patternType: string

  patternValue: string

  experiments: number

  wins: number

  losses: number

  averageViewsLift: number

  averageEngagementLift: number

  averageCompletionLift: number

  winRate: number

  confidence: LearningConfidence

  status: LearningStatus

  learning: string

  lastUpdated: string
}

export interface ContentExperiment {
  patternType: string

  patternValue: string

  viewsLiftPercent: number

  engagementLiftPercent: number

  completionLiftPercent: number

  businessValue:
    | "high"
    | "medium"
    | "low"
}

export class ContentLearningEngine {
  private learnings:
    Map<string, ContentLearning> =
      new Map()

  constructor(
    private readonly memory: MemoryEngine
  ) {}

  recordExperiment(
    experiment: ContentExperiment
  ): ContentLearning {
    const id =
      this.createId(
        experiment.patternType,
        experiment.patternValue
      )

    const existing =
      this.learnings.get(id)

    const isWin =
      this.isSuccessfulExperiment(
        experiment
      )

    const isLoss =
      this.isFailedExperiment(
        experiment
      )

    if (!existing) {
      const learning: ContentLearning = {
        id,

        patternType:
          experiment.patternType,

        patternValue:
          experiment.patternValue,

        experiments: 1,

        wins: isWin ? 1 : 0,

        losses: isLoss ? 1 : 0,

        averageViewsLift:
          experiment.viewsLiftPercent,

        averageEngagementLift:
          experiment.engagementLiftPercent,

        averageCompletionLift:
          experiment.completionLiftPercent,

        winRate:
          isWin ? 100 : 0,

        confidence: "low",

        status: "observing",

        learning:
          this.generateLearning(
            experiment.patternValue,
            1,
            isWin,
            isLoss
          ),

        lastUpdated:
          new Date().toISOString(),
      }

      this.learnings.set(
        id,
        learning
      )

      this.persistLearning(
        learning
      )

      return learning
    }

    const experiments =
      existing.experiments + 1

    const wins =
      existing.wins +
      (isWin ? 1 : 0)

    const losses =
      existing.losses +
      (isLoss ? 1 : 0)

    const confidence =
      this.calculateConfidence(
        experiments
      )

    const averageViewsLift =
      this.updateAverage(
        existing.averageViewsLift,
        experiment.viewsLiftPercent,
        existing.experiments
      )

    const averageEngagementLift =
      this.updateAverage(
        existing.averageEngagementLift,
        experiment.engagementLiftPercent,
        existing.experiments
      )

    const averageCompletionLift =
      this.updateAverage(
        existing.averageCompletionLift,
        experiment.completionLiftPercent,
        existing.experiments
      )

    const winRate =
      (wins / experiments) * 100

    const status =
      this.calculateStatus(
        experiments,
        wins,
        losses,
        averageViewsLift,
        averageEngagementLift,
        averageCompletionLift
      )

    const learning: ContentLearning = {
      ...existing,

      experiments,

      wins,

      losses,

      averageViewsLift,

      averageEngagementLift,

      averageCompletionLift,

      winRate,

      confidence,

      status,

      learning:
        this.generateLearning(
          experiment.patternValue,
          experiments,
          isWin,
          isLoss
        ),

      lastUpdated:
        new Date().toISOString(),
    }

    this.learnings.set(
      id,
      learning
    )

    this.persistLearning(
      learning
    )

    return learning
  }

  getLearning(
    patternType: string,
    patternValue: string
  ): ContentLearning | undefined {
    return this.learnings.get(
      this.createId(
        patternType,
        patternValue
      )
    )
  }

  getLearnings(): ContentLearning[] {
    return Array.from(
      this.learnings.values()
    )
  }

  private persistLearning(
    learning: ContentLearning
  ): void {
    const memory: MemoryItem = {
      id:
        `content-learning:${learning.id}`,

      business:
        "mbo",

      category:
        "content-learning",

      title:
        `${learning.patternType}: ${learning.patternValue}`,

      content:
        JSON.stringify(
          learning
        ),

      createdAt:
        new Date(
          learning.lastUpdated
        ),

      updatedAt:
        new Date(
          learning.lastUpdated
        ),

      tags: [
        "content-intelligence",
        "learning",
        learning.patternType,
        learning.status,
        learning.confidence,
      ],
    }

    this.memory.remember(
      memory
    )
  }

  private isSuccessfulExperiment(
    experiment: ContentExperiment
  ): boolean {
    if (
      experiment.businessValue ===
      "high"
    ) {
      return true
    }

    return (
      experiment.viewsLiftPercent > 0 &&
      experiment.engagementLiftPercent > 0 &&
      experiment.completionLiftPercent > 0
    )
  }

  private isFailedExperiment(
    experiment: ContentExperiment
  ): boolean {
    if (
      experiment.businessValue ===
      "low"
    ) {
      return true
    }

    return (
      experiment.viewsLiftPercent < 0 &&
      experiment.engagementLiftPercent < 0 &&
      experiment.completionLiftPercent < 0
    )
  }

  private updateAverage(
    currentAverage: number,
    newValue: number,
    previousCount: number
  ): number {
    return (
      (
        currentAverage *
          previousCount +
        newValue
      ) /
      (previousCount + 1)
    )
  }

  private calculateConfidence(
    experiments: number
  ): LearningConfidence {
    if (experiments < 3) {
      return "low"
    }

    if (experiments < 10) {
      return "medium"
    }

    return "high"
  }

  private calculateStatus(
    experiments: number,
    wins: number,
    losses: number,
    viewsLift: number,
    engagementLift: number,
    completionLift: number
  ): LearningStatus {
    if (experiments < 3) {
      return "observing"
    }

    const winRate =
      wins / experiments

    const lossRate =
      losses / experiments

    if (
      winRate >= 0.7 &&
      viewsLift > 0 &&
      engagementLift > 0 &&
      completionLift > 0
    ) {
      return "established"
    }

    if (
      lossRate >= 0.7 &&
      viewsLift < 0 &&
      engagementLift < 0 &&
      completionLift < 0
    ) {
      return "declining"
    }

    return "testing"
  }

  private generateLearning(
    patternValue: string,
    experiments: number,
    isWin: boolean,
    isLoss: boolean
  ): string {
    if (experiments === 1) {
      return (
        `Initial evidence for "${patternValue}" ` +
        `has been recorded. MBO should not ` +
        `generalize from a single result.`
      )
    }

    if (experiments < 3) {
      return (
        `"${patternValue}" has produced ` +
        `${experiments} observations. ` +
        `The pattern is still being observed.`
      )
    }

    if (isWin) {
      return (
        `"${patternValue}" continues to produce ` +
        `positive evidence across ${experiments} ` +
        `experiments. MBO should continue controlled ` +
        `testing before treating the pattern as established.`
      )
    }

    if (isLoss) {
      return (
        `"${patternValue}" is producing negative evidence ` +
        `across repeated experiments. MBO should test ` +
        `alternative executions before reducing emphasis.`
      )
    }

    return (
      `"${patternValue}" has mixed evidence after ` +
      `${experiments} experiments. MBO should continue ` +
      `testing rather than making a permanent decision.`
    )
  }

  private createId(
    patternType: string,
    patternValue: string
  ): string {
    return (
      `${patternType}:${patternValue}`
        .toLowerCase()
        .replace(/\s+/g, "-")
    )
  }
}
