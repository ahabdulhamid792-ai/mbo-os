import {
  ExecutionAuditEngine,
} from "./ExecutionAuditEngine"

export interface ExecutionAuditQuery {
  executionId?: string
  eventType?: string
  providerId?: string
  capability?: string
  status?: string
}

export class ExecutionAuditQueryEngine {
  constructor(
    private readonly audit:
      ExecutionAuditEngine
  ) {}

  query(
    filters: ExecutionAuditQuery = {}
  ) {
    const events =
      filters.executionId
        ? this.audit.getEvents(
            filters.executionId
          )
        : this.audit.getAllEvents()

    return events.filter(
      (event) => {
        if (
          filters.executionId &&
          event.executionId !==
            filters.executionId
        ) {
          return false
        }

        if (
          filters.eventType &&
          event.eventType !==
            filters.eventType
        ) {
          return false
        }

        if (
          filters.providerId &&
          event.providerId !==
            filters.providerId
        ) {
          return false
        }

        if (
          filters.capability &&
          event.capability !==
            filters.capability
        ) {
          return false
        }

        if (
          filters.status &&
          event.status !==
            filters.status
        ) {
          return false
        }

        return true
      }
    )
  }

  latest(
    executionId: string
  ) {
    const events =
      this.audit.getEvents(
        executionId
      )

    return events[
      events.length - 1
    ]
  }

  count(
    executionId: string
  ): number {
    return this.audit
      .getEvents(
        executionId
      ).length
  }
}
