export interface ContentPerformance {
  id: string

  businessId: string

  platform: string

  contentType: string

  title?: string

  hook?: string

  topic?: string

  format?: string

  durationSeconds?: number

  publishedAt?: string

  views: number

  likes: number

  comments: number

  shares: number

  saves?: number

  watchTimeSeconds?: number

  averageViewDurationSeconds?: number

  completionRate?: number

  engagementRate?: number
}
