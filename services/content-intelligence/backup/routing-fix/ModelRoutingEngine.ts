import {
  ProviderModelConfiguration,
} from "./ProviderConfiguration"

export type RoutingTaskType =
  | "trend-research"
  | "news-research"
  | "news-summarization"
  | "script-generation"
  | "image-prompt"
  | "video-prompt"
  | "content-generation"
  | "analysis"
  | "rewriting"
  | "strategy"
  | "content-intelligence"
  | "general"

export type ModelRoutingDecision = RoutingPlan

export type RoutingDecision =
  | "route"
  | "prepare"
  | "manual"
  | "reject"

export type CostPreference =
  | "free-first"
  | "low-cost"
  | "balanced"
  | "quality-first"

export type ApprovalRequirement =
  | "automatic"
  | "approval-required"
  | "manual-only"

export interface RoutingTask {
  id: string

  type: RoutingTaskType

  capability: string

  niche?: string

  description?: string

  requiresHighQuality?: boolean

  requiresFreshInformation?: boolean

  requiresReasoning?: boolean

  requiresLongContext?: boolean

  requiresMultimodal?: boolean
}

export interface RoutingPolicy {
  costPreference: CostPreference

  approvalRequirement: ApprovalRequirement

  allowPremiumModels: boolean

  allowPaidModels: boolean

  allowFreeModels: boolean

  maxRetries: number

  allowProviderFallback: boolean

  allowModelFallback: boolean

  allowManualFallback: boolean
}

export interface RoutingCandidate {
  model: ProviderModelConfiguration

  providerId: string

  providerEnabled: boolean

  modelEnabled: boolean

  estimatedCost?: number

  qualityScore?: number

  reliabilityScore?: number

  supportsFreshInformation?: boolean

  supportsReasoning?: boolean

  supportsLongContext?: boolean

  supportsMultimodal?: boolean
}

export interface RoutingAttempt {
  modelId: string

  providerId: string

  attempt: number
}

export interface RoutingPlan {
  taskId: string

  decision: RoutingDecision

  selectedModelId?: string

  selectedProviderId?: string

  fallbackModelIds: string[]

  fallbackProviderIds: string[]

  attempts: RoutingAttempt[]

  reason: string
}

export interface ModelRoutingCatalog {
  getModels(): ProviderModelConfiguration[]

  isProviderEnabled(
    providerId: string
  ): boolean
}

export class ModelRoutingEngine {
  constructor(
    private readonly catalog:
      ModelRoutingCatalog
  ) {}

  route(
    task: RoutingTask,
    policy: RoutingPolicy
  ): RoutingPlan {
    const candidates =
      this.getEligibleCandidates(
        task,
        policy
      )

    if (
      candidates.length === 0
    ) {
      return {
        taskId: task.id,

        decision:
          policy.allowManualFallback
            ? "manual"
            : "reject",

        fallbackModelIds: [],

        fallbackProviderIds: [],

        attempts: [],

        reason:
          policy.allowManualFallback
            ? "No eligible AI model is available. Falling back to manual execution."
            : "No eligible AI model is available and manual fallback is disabled.",
      }
    }

    const ranked =
      this.rankCandidates(
        candidates,
        task,
        policy
      )

    const selected =
      ranked[0]

    const fallbackModels =
      policy.allowModelFallback
        ? ranked
            .slice(1)
            .map(
              (candidate) =>
                candidate.model.id
            )
        : []

    const fallbackProviders =
      policy.allowProviderFallback
        ? this.getProviderFallbacks(
            ranked,
            selected.providerId
          )
        : []

    const decision =
      this.resolveDecision(
        task,
        policy
      )

    return {
      taskId: task.id,

      decision,

      selectedModelId:
        selected.model.id,

      selectedProviderId:
        selected.providerId,

      fallbackModelIds:
        fallbackModels,

      fallbackProviderIds:
        fallbackProviders,

      attempts: [
        {
          modelId:
            selected.model.id,

          providerId:
            selected.providerId,

          attempt: 1,
        },
      ],

      reason:
        this.buildReason(
          selected,
          decision,
          policy
        ),
    }
  }

  private getEligibleCandidates(
    task: RoutingTask,
    policy: RoutingPolicy
  ): RoutingCandidate[] {
    return this.catalog
      .getModels()
      .filter(
        (model) =>
          model.enabled &&
          this.catalog.isProviderEnabled(
            model.providerId
          )
      )
      .filter(
        (model) =>
          model.capabilities.includes(
            task.capability
          )
      )
      .filter(
        (model) =>
          this.costAllowed(
            model,
            policy
          )
      )
      .map(
        (model) => ({
          model,

          providerId:
            model.providerId,

          providerEnabled: true,

          modelEnabled:
            model.enabled,
        })
      )
  }

  private costAllowed(
    model: ProviderModelConfiguration,
    policy: RoutingPolicy
  ): boolean {
    if (
      model.capabilities.includes(
        "paid-only"
      ) &&
      !policy.allowPaidModels
    ) {
      return false
    }

    if (
      model.capabilities.includes(
        "premium"
      ) &&
      !policy.allowPremiumModels
    ) {
      return false
    }

    if (
      model.capabilities.includes(
        "free"
      ) &&
      !policy.allowFreeModels
    ) {
      return false
    }

    return true
  }

  private rankCandidates(
    candidates: RoutingCandidate[],
    task: RoutingTask,
    policy: RoutingPolicy
  ): RoutingCandidate[] {
    return [...candidates].sort(
      (a, b) => {
        const scoreA =
          this.calculateScore(
            a,
            task,
            policy
          )

        const scoreB =
          this.calculateScore(
            b,
            task,
            policy
          )

        return scoreB - scoreA
      }
    )
  }

  private calculateScore(
    candidate: RoutingCandidate,
    task: RoutingTask,
    policy: RoutingPolicy
  ): number {
    let score = 0

    /*
     * Lower priority number means
     * higher configured priority.
     */
    score +=
      Math.max(
        0,
        100 -
          candidate.model.priority
      )

    if (
      candidate.model.role ===
      "primary"
    ) {
      score += 30
    }

    if (
      candidate.model.role ===
      "fallback"
    ) {
      score += 20
    }

    if (
      candidate.model.role ===
      "backup"
    ) {
      score += 10
    }

    if (
      policy.costPreference ===
      "free-first"
    ) {
      if (
        candidate.model.capabilities.includes(
          "free"
        )
      ) {
        score += 40
      }
    }

    if (
      policy.costPreference ===
      "low-cost"
    ) {
      if (
        candidate.model.capabilities.includes(
          "low-cost"
        )
      ) {
        score += 30
      }

      if (
        candidate.model.capabilities.includes(
          "free"
        )
      ) {
        score += 20
      }
    }

    if (
      policy.costPreference ===
      "quality-first"
    ) {
      if (
        candidate.model.capabilities.includes(
          "premium"
        )
      ) {
        score += 40
      }
    }

    if (
      task.requiresReasoning &&
      candidate.model.capabilities.includes(
        "reasoning"
      )
    ) {
      score += 30
    }

    if (
      task.requiresFreshInformation &&
      candidate.model.capabilities.includes(
        "fresh-information"
      )
    ) {
      score += 30
    }

    if (
      task.requiresLongContext &&
      candidate.model.capabilities.includes(
        "long-context"
      )
    ) {
      score += 30
    }

    if (
      task.requiresMultimodal &&
      candidate.model.capabilities.includes(
        "multimodal"
      )
    ) {
      score += 30
    }

    if (
      task.requiresHighQuality &&
      candidate.model.capabilities.includes(
        "high-quality"
      )
    ) {
      score += 30
    }

    return score
  }

  private getProviderFallbacks(
    candidates: RoutingCandidate[],
    selectedProviderId: string
  ): string[] {
    return Array.from(
      new Set(
        candidates
          .map(
            (candidate) =>
              candidate.providerId
          )
          .filter(
            (providerId) =>
              providerId !==
              selectedProviderId
          )
      )
    )
  }

  private resolveDecision(
    task: RoutingTask,
    policy: RoutingPolicy
  ): RoutingDecision {
    if (
      policy.approvalRequirement ===
      "manual-only"
    ) {
      return "manual"
    }

    if (
      policy.approvalRequirement ===
      "approval-required"
    ) {
      return "prepare"
    }

    if (
      task.requiresHighQuality &&
      !policy.allowPremiumModels
    ) {
      return "prepare"
    }

    return "route"
  }

  private buildReason(
    candidate: RoutingCandidate,
    decision: RoutingDecision,
    policy: RoutingPolicy
  ): string {
    return (
      `Selected model "${candidate.model.name}" ` +
      `from provider "${candidate.providerId}" ` +
      `using role "${candidate.model.role}" ` +
      `and priority ${candidate.model.priority}. ` +
      `Decision: ${decision}. ` +
      `Cost policy: ${policy.costPreference}.`
    )
  }
}
