import { ContentPerformance } from "../interfaces/ContentPerformance"

export interface ContentAnalysis {
  engagementRate: number
  likeRate: number
  commentRate: number
  shareRate: number
  saveRate: number
  completionRate: number
  performanceScore: number
}

export class PerformanceAnalyzer {
  analyze(content: ContentPerformance): ContentAnalysis {
    const views = Math.max(content.views, 1)

    const engagementRate =
      ((content.likes +
        content.comments +
        content.shares +
        (content.saves ?? 0)) /
        views) *
      100

    const likeRate = (content.likes / views) * 100

    const commentRate = (content.comments / views) * 100

    const shareRate = (content.shares / views) * 100

    const saveRate =
      ((content.saves ?? 0) / views) * 100

    const completionRate =
      content.completionRate ??
      this.calculateCompletionRate(content)

    const performanceScore =
      this.calculatePerformanceScore({
        engagementRate,
        likeRate,
        commentRate,
        shareRate,
        saveRate,
        completionRate,
      })

    return {
      engagementRate,
      likeRate,
      commentRate,
      shareRate,
      saveRate,
      completionRate,
      performanceScore,
    }
  }

  private calculateCompletionRate(
    content: ContentPerformance
  ): number {
    if (
      !content.durationSeconds ||
      !content.averageViewDurationSeconds
    ) {
      return 0
    }

    return Math.min(
      (content.averageViewDurationSeconds /
        content.durationSeconds) *
        100,
      100
    )
  }

  private calculatePerformanceScore(
    analysis: Omit<ContentAnalysis, "performanceScore">
  ): number {
    const score =
      analysis.engagementRate * 0.35 +
      analysis.shareRate * 100 * 0.25 +
      analysis.saveRate * 100 * 0.15 +
      analysis.completionRate * 0.25

    return Math.min(Math.max(score, 0), 100)
  }
}
