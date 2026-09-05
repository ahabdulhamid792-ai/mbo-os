import {
  ModelRoutingEngine,
  RoutingPolicy,
  RoutingTask,
  ModelRoutingCatalog,
} from "../provider/ModelRoutingEngine"

import {
  ProviderModelConfiguration,
} from "../provider/ProviderConfiguration"

const models:
  ProviderModelConfiguration[] = [
    {
      id: "openrouter:free-model",
      providerId: "openrouter",
      name: "Free Research Model",
      enabled: true,
      capabilities: [
        "trend-research",
        "free",
        "fresh-information",
      ],
      role: "primary",
      priority: 10,
    },

    {
      id: "openrouter:premium-model",
      providerId: "openrouter",
      name: "Premium Reasoning Model",
      enabled: true,
      capabilities: [
        "trend-research",
        "analysis",
        "reasoning",
        "high-quality",
        "premium",
      ],
      role: "fallback",
      priority: 20,
    },

    {
      id: "minimax:free-model",
      providerId: "minimax",
      name: "MiniMax Free Model",
      enabled: true,
      capabilities: [
        "trend-research",
        "free",
      ],
      role: "backup",
      priority: 30,
    },

    {
      id: "openai:analysis-model",
      providerId: "openai",
      name: "Analysis Model",
      enabled: true,
      capabilities: [
        "analysis",
        "reasoning",
        "high-quality",
      ],
      role: "backup",
      priority: 40,
    },
  ]

const catalog:
  ModelRoutingCatalog = {
    getModels() {
      return models
    },

    isProviderEnabled(
      providerId: string
    ) {
      return [
        "openrouter",
        "minimax",
        "openai",
      ].includes(providerId)
    },
  }

const router =
  new ModelRoutingEngine(
    catalog
  )

console.log(
  "MBO MODEL ROUTING TEST"
)

console.log(
  "\n1. TREND RESEARCH"
)

const trendTask:
  RoutingTask = {
    id: "task:trend-research",
    type: "trend-research",
    capability: "trend-research",
    niche: "football",
    requiresFreshInformation: true,
  }

const freePolicy:
  RoutingPolicy = {
    costPreference: "free-first",

    approvalRequirement:
      "automatic",

    allowPremiumModels: false,

    allowPaidModels: false,

    allowFreeModels: true,

    maxRetries: 2,

    allowProviderFallback: true,

    allowModelFallback: true,

    allowManualFallback: true,
  }

console.log(
  router.route(
    trendTask,
    freePolicy
  )
)

console.log(
  "\n2. HIGH QUALITY ANALYSIS"
)

const analysisTask:
  RoutingTask = {
    id: "task:analysis",
    type: "analysis",
    capability: "analysis",
    requiresReasoning: true,
    requiresHighQuality: true,
  }

const qualityPolicy:
  RoutingPolicy = {
    costPreference:
      "quality-first",

    approvalRequirement:
      "automatic",

    allowPremiumModels: true,

    allowPaidModels: true,

    allowFreeModels: true,

    maxRetries: 3,

    allowProviderFallback: true,

    allowModelFallback: true,

    allowManualFallback: true,
  }

console.log(
  router.route(
    analysisTask,
    qualityPolicy
  )
)

console.log(
  "\n3. APPROVAL REQUIRED"
)

console.log(
  router.route(
    trendTask,
    {
      ...freePolicy,
      approvalRequirement:
        "approval-required",
    }
  )
)

console.log(
  "\n4. NO AI MODEL AVAILABLE"
)

const disabledModels =
  models.map(
    (model) => ({
      ...model,
      enabled: false,
    })
  )

const disabledCatalog:
  ModelRoutingCatalog = {
    getModels() {
      return disabledModels
    },

    isProviderEnabled() {
      return true
    },
  }

const disabledRouter =
  new ModelRoutingEngine(
    disabledCatalog
  )

console.log(
  disabledRouter.route(
    trendTask,
    freePolicy
  )
)
