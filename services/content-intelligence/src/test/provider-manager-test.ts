import {
  ProviderManager,
} from "../provider/ProviderManager"

import {
  ProviderConfiguration,
} from "../provider/ProviderConfiguration"

function createProvider(
  id: string,
  name: string
): ProviderConfiguration {
  return {
    id,
    name,

    enabled: true,

    capabilities: [
      "content-generation",
    ],

    models: [
      {
        id: `${id}:model-1`,

        providerId: id,

        name:
          `${name} Model`,

        enabled: true,

        capabilities: [
          "content-generation",
        ],

        role: "fallback",

        priority: 100,
      },
    ],
  }
}

function main() {
  const manager =
    new ProviderManager()

  const openrouter =
    createProvider(
      "openrouter",
      "OpenRouter"
    )

  const minimax =
    createProvider(
      "minimax",
      "MiniMax"
    )

  const openai =
    createProvider(
      "openai",
      "OpenAI"
    )

  console.log(
    "MBO PROVIDER MANAGER TEST"
  )

  console.log(
    "\n1. REGISTERING PROVIDERS"
  )

  manager.register(
    openrouter
  )

  manager.register(
    minimax
  )

  manager.register(
    openai
  )

  console.table(
    manager.getAll().map(
      (provider) => ({
        id:
          provider.id,

        name:
          provider.name,

        enabled:
          provider.enabled,
      })
    )
  )

  console.log(
    "\n2. SETTING PRIMARY PROVIDER"
  )

  console.log(
    manager.setPrimary(
      "openrouter"
    )
  )

  console.log(
    manager.getRouting()
  )

  console.log(
    "\n3. SETTING FALLBACK PROVIDERS"
  )

  console.log(
    manager.setFallbacks([
      "minimax",
      "openai",
    ])
  )

  console.log(
    manager.getRouting()
  )

  console.log(
    "\n4. DISABLING PRIMARY PROVIDER"
  )

  console.log(
    manager.disable(
      "openrouter"
    )
  )

  console.log(
    manager.get(
      "openrouter"
    )
  )

  console.log(
    "\n5. CURRENT ROUTING"
  )

  console.log(
    manager.getRouting()
  )

  console.log(
    "\n6. RE-ENABLING OPENROUTER"
  )

  console.log(
    manager.enable(
      "openrouter"
    )
  )

  console.log(
    "\n7. REMOVING OPENAI"
  )

  console.log(
    manager.remove(
      "openai"
    )
  )

  console.log(
    "\n8. FINAL PROVIDERS"
  )

  console.table(
    manager.getAll().map(
      (provider) => ({
        id:
          provider.id,

        name:
          provider.name,

        enabled:
          provider.enabled,
      })
    )
  )

  console.log(
    "\n9. FINAL ROUTING"
  )

  console.log(
    manager.getRouting()
  )
}

main()
