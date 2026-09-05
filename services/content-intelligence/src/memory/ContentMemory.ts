import { ContentPerformance } from "../interfaces/ContentPerformance"

export class ContentMemory {
  private records: ContentPerformance[] = []

  store(record: ContentPerformance): void {
    this.records.push(record)
  }

  get(id: string): ContentPerformance | undefined {
    return this.records.find(
      (record) => record.id === id
    )
  }

  getAll(): ContentPerformance[] {
    return [...this.records]
  }

  getByBusiness(
    businessId: string
  ): ContentPerformance[] {
    return this.records.filter(
      (record) => record.businessId === businessId
    )
  }

  getByPlatform(
    platform: string
  ): ContentPerformance[] {
    return this.records.filter(
      (record) => record.platform === platform
    )
  }

  clear(): void {
    this.records = []
  }
}
