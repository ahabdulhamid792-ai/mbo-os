import { ContentPerformance } from "../interfaces/ContentPerformance"

export interface ContentPattern {
  type:
    | "topic"
    | "hook"
    | "format"
    | "duration"
    | "platform"

  value: string

  contentIds: string[]

  sampleSize: number

  averageViews: number

  averageEngagementRate: number

  averageCompletionRate: number
}

export class PatternDetector {
  detect(
    records: ContentPerformance[]
  ): ContentPattern[] {
    if (records.length === 0) {
      return []
    }

    const patterns: ContentPattern[] = []

    patterns.push(
      ...this.detectFieldPattern(
        records,
        "topic",
        "topic"
      )
    )

    patterns.push(
      ...this.detectFieldPattern(
        records,
        "hook",
        "hook"
      )
    )

    patterns.push(
      ...this.detectFieldPattern(
        records,
        "format",
        "format"
      )
    )

    patterns.push(
      ...this.detectFieldPattern(
        records,
        "platform",
        "platform"
      )
    )

    patterns.push(
      ...this.detectDurationPatterns(records)
    )

    return patterns
  }

  private detectFieldPattern(
    records: ContentPerformance[],
    field:
      | "topic"
      | "hook"
      | "format"
      | "platform",
    type: ContentPattern["type"]
  ): ContentPattern[] {
    const groups = new Map<
      string,
      ContentPerformance[]
    >()

    for (const record of records) {
      const value = record[field]

      if (!value) {
        continue
      }

      const group = groups.get(value) ?? []

      group.push(record)

      groups.set(value, group)
    }

    return Array.from(groups.entries()).map(
      ([value, group]) =>
        this.createPattern(
          type,
          value,
          group
        )
    )
  }

  private detectDurationPatterns(
    records: ContentPerformance[]
  ): ContentPattern[] {
    const groups = new Map<
      string,
      ContentPerformance[]
    >()

    for (const record of records) {
      if (
        record.durationSeconds === undefined
      ) {
        continue
      }

      const duration =
        record.durationSeconds

      let bucket: string

      if (duration <= 15) {
        bucket = "0-15 seconds"
      } else if (duration <= 30) {
        bucket = "16-30 seconds"
      } else if (duration <= 60) {
        bucket = "31-60 seconds"
      } else {
        bucket = "60+ seconds"
      }

      const group =
        groups.get(bucket) ?? []

      group.push(record)

      groups.set(bucket, group)
    }

    return Array.from(groups.entries()).map(
      ([value, group]) =>
        this.createPattern(
          "duration",
          value,
          group
        )
    )
  }

  private createPattern(
    type: ContentPattern["type"],
    value: string,
    records: ContentPerformance[]
  ): ContentPattern {
    const averageViews =
      records.reduce(
        (total, record) =>
          total + record.views,
        0
      ) / records.length

    const averageEngagementRate =
      records.reduce(
        (total, record) =>
          total +
          this.calculateEngagementRate(
            record
          ),
        0
      ) / records.length

    const averageCompletionRate =
      records.reduce(
        (total, record) =>
          total +
          (record.completionRate ?? 0),
        0
      ) / records.length

    return {
      type,
      value,

      contentIds:
        records.map(
          (record) => record.id
        ),

      sampleSize: records.length,

      averageViews,

      averageEngagementRate,

      averageCompletionRate,
    }
  }

  private calculateEngagementRate(
    record: ContentPerformance
  ): number {
    if (record.views <= 0) {
      return 0
    }

    return (
      ((record.likes +
        record.comments +
        record.shares +
        (record.saves ?? 0)) /
        record.views) *
      100
    )
  }
}
