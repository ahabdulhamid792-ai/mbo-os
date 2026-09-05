import {
  ExecutionStatus,
} from "../execution/ActionExecutionEngine"

export type AuditEventType =
  | "execution-created"
  | "policy-evaluated"
  | "execution-approved"
  | "execution-started"
  | "provider-selected"
  | "provider-attempted"
  | "provider-failed"
  | "provider-succeeded"
  | "failover-started"
  | "execution-completed"
  | "execution-failed"
  | "execution-cancelled"

export interface ExecutionAuditEvent {
  id: string

  executionId: string

  eventType: AuditEventType

  status?: ExecutionStatus

  providerId?: string

  capability?: string

  message: string

  metadata?: Record<
    string,
    unknown
  >

  timestamp: string
}

export interface CreateAuditEventInput {
  executionId: string

  eventType: AuditEventType

  status?: ExecutionStatus

  providerId?: string

  capability?: string

  message: string

  metadata?: Record<
    string,
    unknown
  >
}

export class ExecutionAuditEngine {
  private readonly events:
    Map<
      string,
      ExecutionAuditEvent[]
    > = new Map()

  record(
    input: CreateAuditEventInput
  ): ExecutionAuditEvent {
    const event: ExecutionAuditEvent = {
      id:
        this.createEventId(
          input.executionId,
          input.eventType
        ),

      executionId:
        input.executionId,

      eventType:
        input.eventType,

      status:
        input.status,

      providerId:
        input.providerId,

      capability:
        input.capability,

      message:
        input.message,

      metadata:
        input.metadata,

      timestamp:
        new Date().toISOString(),
    }

    const existing =
      this.events.get(
        input.executionId
      ) ?? []

    existing.push(event)

    this.events.set(
      input.executionId,
      existing
    )

    return event
  }

  getEvents(
    executionId: string
  ): ExecutionAuditEvent[] {
    return [
      ...(this.events.get(
        executionId
      ) ?? []),
    ]
  }

  getLatestEvent(
    executionId: string
  ): ExecutionAuditEvent | undefined {
    const events =
      this.events.get(
        executionId
      )

    if (
      !events ||
      events.length === 0
    ) {
      return undefined
    }

    return events[
      events.length - 1
    ]
  }

  getAllEvents():
    ExecutionAuditEvent[] {
    return Array.from(
      this.events.values()
    )
      .flat()
      .sort(
        (a, b) =>
          a.timestamp.localeCompare(
            b.timestamp
          )
      )
  }

  hasEvents(
    executionId: string
  ): boolean {
    return (
      this.events.has(
        executionId
      ) &&
      (
        this.events.get(
          executionId
        )?.length ?? 0
      ) > 0
    )
  }

  clear(
    executionId: string
  ): void {
    this.events.delete(
      executionId
    )
  }

  private createEventId(
    executionId: string,
    eventType: AuditEventType
  ): string {
    return [
      "audit",
      executionId,
      eventType,
      Date.now().toString(),
      Math.random()
        .toString(36)
        .slice(2, 8),
    ].join(":")
  }
}
