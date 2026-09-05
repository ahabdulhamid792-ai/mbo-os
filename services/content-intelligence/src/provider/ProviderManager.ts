import {
  ProviderConfiguration,
  ProviderRoutingConfiguration,
} from "./ProviderConfiguration"

export class ProviderManager {
  private readonly providers:
    Map<string, ProviderConfiguration> =
    new Map()

  private routing:
    ProviderRoutingConfiguration = {
      primaryProviderId: undefined,
      fallbackProviderIds: [],
    }

  register(
    provider: ProviderConfiguration
  ): ProviderConfiguration {
    this.providers.set(
      provider.id,
      provider
    )

    return provider
  }

  remove(
    providerId: string
  ): boolean {
    const removed =
      this.providers.delete(
        providerId
      )

    if (
      this.routing.primaryProviderId ===
      providerId
    ) {
      this.routing.primaryProviderId =
        undefined
    }

    this.routing.fallbackProviderIds =
      this.routing.fallbackProviderIds.filter(
        (id) =>
          id !== providerId
      )

    return removed
  }

  get(
    providerId: string
  ): ProviderConfiguration | undefined {
    return this.providers.get(
      providerId
    )
  }

  getAll(): ProviderConfiguration[] {
    return Array.from(
      this.providers.values()
    )
  }

  getEnabled(): ProviderConfiguration[] {
    return this.getAll().filter(
      (provider) =>
        provider.enabled
    )
  }

  enable(
    providerId: string
  ): boolean {
    const provider =
      this.providers.get(
        providerId
      )

    if (!provider) {
      return false
    }

    provider.enabled = true

    return true
  }

  disable(
    providerId: string
  ): boolean {
    const provider =
      this.providers.get(
        providerId
      )

    if (!provider) {
      return false
    }

    provider.enabled = false

    if (
      this.routing.primaryProviderId ===
      providerId
    ) {
      this.routing.primaryProviderId =
        undefined
    }

    this.routing.fallbackProviderIds =
      this.routing.fallbackProviderIds.filter(
        (id) =>
          id !== providerId
      )

    return true
  }

  setPrimary(
    providerId: string
  ): boolean {
    const provider =
      this.providers.get(
        providerId
      )

    if (
      !provider ||
      !provider.enabled
    ) {
      return false
    }

    this.routing.primaryProviderId =
      providerId

    this.routing.fallbackProviderIds =
      this.routing.fallbackProviderIds.filter(
        (id) =>
          id !== providerId
      )

    return true
  }

  setFallbacks(
    providerIds: string[]
  ): boolean {
    const uniqueIds =
      Array.from(
        new Set(providerIds)
      )

    for (
      const providerId of uniqueIds
    ) {
      const provider =
        this.providers.get(
          providerId
        )

      if (
        !provider ||
        !provider.enabled
      ) {
        return false
      }
    }

    this.routing.fallbackProviderIds =
      uniqueIds.filter(
        (id) =>
          id !==
          this.routing.primaryProviderId
      )

    return true
  }

  getRouting():
    ProviderRoutingConfiguration {
    return {
      primaryProviderId:
        this.routing.primaryProviderId,

      fallbackProviderIds: [
        ...this.routing
          .fallbackProviderIds,
      ],
    }
  }
}
