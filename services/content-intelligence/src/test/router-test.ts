import {
  ProviderRegistry,
} from "../provider/ProviderRegistry"

import {
  ManualExecutionProvider,
} from "../provider/ManualExecutionProvider"

import {
  ProviderRouter,
} from "../provider/ProviderRouter"

const providers =
  new ProviderRegistry()

providers.register(
  new ManualExecutionProvider()
)

const router =
  new ProviderRouter(
    providers
  )

const request = {
  executionId:
    "execution:test-router",

  actionId:
    "action:test-router",

  patternType:
    "hook",

  patternValue:
    "You're wasting hours every week",

  title:
    'Scale "You\'re wasting hours every week"',

  objective:
    "Create controlled variations.",

  steps: [
    "Create 3 variations.",
    "Publish them.",
    "Compare results.",
  ],

  successMetrics: [
    "Views",
    "Engagement",
    "Conversions",
  ],
}

console.log(
  "MBO PROVIDER ROUTER TEST"
)

const route =
  router.route(
    "content-generation",
    request
  )

console.log(
  "\nCONTENT GENERATION ROUTE:"
)

console.log(route)

const imageRoute =
  router.route(
    "image-generation",
    request
  )

console.log(
  "\nIMAGE GENERATION ROUTE:"
)

console.log(imageRoute)

const analyticsRoute =
  router.route(
    "analytics",
    request
  )

console.log(
  "\nANALYTICS ROUTE:"
)

console.log(analyticsRoute)
