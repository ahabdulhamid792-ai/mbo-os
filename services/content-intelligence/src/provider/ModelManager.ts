import {
  ProviderModelConfiguration,
} from "./ProviderConfiguration"

export class ModelManager {
  private readonly models:
    Map<string, ProviderModelConfiguration> =
    new Map()

  register(
    model: ProviderModelConfiguration
  ): ProviderModelConfiguration {
    this.models.set(
      model.id,
      model
    )

    return model
  }

  remove(
    modelId: string
  ): boolean {
    return this.models.delete(
      modelId
    )
  }

  get(
    modelId: string
  ): ProviderModelConfiguration | undefined {
    return this.models.get(
      modelId
    )
  }

  getAll(): ProviderModelConfiguration[] {
    return Array.from(
      this.models.values()
    )
  }

  getEnabled(): ProviderModelConfiguration[] {
    return this.getAll().filter(
      (model) =>
        model.enabled
    )
  }

  getByProvider(
    providerId: string
  ): ProviderModelConfiguration[] {
    return this.getAll().filter(
      (model) =>
        model.providerId ===
        providerId
    )
  }

  getByCapability(
    capability: string
  ): ProviderModelConfiguration[] {
    return this.getEnabled()
      .filter(
        (model) =>
          model.capabilities.includes(
            capability
          )
      )
      .sort(
        (a, b) =>
          a.priority -
          b.priority
      )
  }

  enable(
    modelId: string
  ): boolean {
    const model =
      this.models.get(
        modelId
      )

    if (!model) {
      return false
    }

    model.enabled = true

    return true
  }

  disable(
    modelId: string
  ): boolean {
    const model =
      this.models.get(
        modelId
      )

    if (!model) {
      return false
    }

    model.enabled = false

    return true
  }

  setRole(
    modelId: string,
    role:
      | "primary"
      | "fallback"
      | "backup"
  ): boolean {
    const model =
      this.models.get(
        modelId
      )

    if (!model) {
      return false
    }

    model.role =
      role

    return true
  }

  setPriority(
    modelId: string,
    priority: number
  ): boolean {
    const model =
      this.models.get(
        modelId
      )

    if (
      !model ||
      !Number.isFinite(
        priority
      )
    ) {
      return false
    }

    model.priority =
      priority

    return true
  }
}
