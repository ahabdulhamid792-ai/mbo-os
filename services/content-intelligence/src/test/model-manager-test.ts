import {
  ModelManager,
} from "../provider/ModelManager"

import {
  ProviderModelConfiguration,
} from "../provider/ProviderConfiguration"

function createModel(
  id: string,
  providerId: string,
  name: string,
  role:
    | "primary"
    | "fallback"
    | "backup",
  priority: number
): ProviderModelConfiguration {
  return {
    id,
    providerId,
    name,

    enabled: true,

    capabilities: [
      "content-generation",
    ],

    role,

    priority,
  }
}

function main() {
  const manager =
    new ModelManager()

  console.log(
    "MBO MODEL MANAGER TEST"
  )

  console.log(
    "\n1. REGISTERING MODELS"
  )

  manager.register(
    createModel(
      "openrouter:model-a",
      "openrouter",
      "Model A",
      "primary",
      10
    )
  )

  manager.register(
    createModel(
      "openrouter:model-b",
      "openrouter",
      "Model B",
      "fallback",
      20
    )
  )

  manager.register(
    createModel(
      "openrouter:model-c",
      "openrouter",
      "Model C",
      "backup",
      30
    )
  )

  manager.register(
    createModel(
      "minimax:model-d",
      "minimax",
      "Model D",
      "fallback",
      40
    )
  )

  manager.register(
    createModel(
      "minimax:model-e",
      "minimax",
      "Model E",
      "backup",
      50
    )
  )

  manager.register(
    createModel(
      "openai:model-f",
      "openai",
      "Model F",
      "backup",
      60
    )
  )

  console.table(
    manager.getAll().map(
      (model) => ({
        id:
          model.id,

        provider:
          model.providerId,

        name:
          model.name,

        role:
          model.role,

        priority:
          model.priority,

        enabled:
          model.enabled,
      })
    )
  )

  console.log(
    "\n2. MODELS FOR OPENROUTER"
  )

  console.table(
    manager
      .getByProvider(
        "openrouter"
      )
      .map(
        (model) => ({
          id:
            model.id,

          role:
            model.role,

          priority:
            model.priority,
        })
      )
  )

  console.log(
    "\n3. CONTENT-GENERATION MODELS ORDERED BY PRIORITY"
  )

  console.table(
    manager
      .getByCapability(
        "content-generation"
      )
      .map(
        (model) => ({
          id:
            model.id,

          provider:
            model.providerId,

          role:
            model.role,

          priority:
            model.priority,
        })
      )
  )

  console.log(
    "\n4. DISABLING PRIMARY MODEL"
  )

  console.log(
    manager.disable(
      "openrouter:model-a"
    )
  )

  console.table(
    manager
      .getByCapability(
        "content-generation"
      )
      .map(
        (model) => ({
          id:
            model.id,

          role:
            model.role,

          priority:
            model.priority,

          enabled:
            model.enabled,
        })
      )
  )

  console.log(
    "\n5. CHANGING MODEL ROLE"
  )

  console.log(
    manager.setRole(
      "minimax:model-d",
      "primary"
    )
  )

  console.log(
    manager.get(
      "minimax:model-d"
    )
  )

  console.log(
    "\n6. CHANGING MODEL PRIORITY"
  )

  console.log(
    manager.setPriority(
      "minimax:model-d",
      5
    )
  )

  console.log(
    manager.get(
      "minimax:model-d"
    )
  )

  console.log(
    "\n7. REMOVING MODEL"
  )

  console.log(
    manager.remove(
      "openai:model-f"
    )
  )

  console.log(
    "\n8. FINAL MODELS"
  )

  console.table(
    manager.getAll().map(
      (model) => ({
        id:
          model.id,

        provider:
          model.providerId,

        role:
          model.role,

        priority:
          model.priority,

        enabled:
          model.enabled,
      })
    )
  )
}

main()
