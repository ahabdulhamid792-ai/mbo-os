import {
  ExecutionRequest,
  ProviderCapability,
} from "./ExecutionProvider"

import {
  ProviderRegistry,
} from "./ProviderRegistry"

import {
  ProviderRoutingConfiguration,
} from "./ProviderConfiguration"

export interface ProviderSelection {
  providerId: string
  capability: ProviderCapability
  reason: string
}

export class ProviderSelectionEngine {
  constructor(
    private readonly providers:
      ProviderRegistry,

    private readonly routing:
      ProviderRoutingConfiguration
  ) {}

  select(
    capability: ProviderCapability,
    request: ExecutionRequest,
    preferredProviderId?: string
  ): string[] {
    const available =
      this.providers
        .getAll()
        .filter(
          (provider) =>
            provider.capabilities.includes(
              capability
            ) &&
            provider.canExecute(
              request
            )
        )
        .map(
          (provider) =>
            provider.id
        )

    const preferred =
      preferredProviderId ??
      this.routing.primaryProviderId

    const ordered: string[] = []

    if (
      preferred &&
      available.includes(preferred)
    ) {
      ordered.push(preferred)
    }

    for (
      const providerId of
        this.routing.fallbackProviderIds
    ) {
      if (
        available.includes(
          providerId
        ) &&
        !ordered.includes(
          providerId
        )
      ) {
        ordered.push(providerId)
      }
    }

    for (
      const providerId of available
    ) {
      if (
        !ordered.includes(
          providerId
        )
      ) {
        ordered.push(providerId)
      }
    }

    return ordered
  }

  selectPrimary(
    capability: ProviderCapability,
    request: ExecutionRequest
  ): ProviderSelection | undefined {
    const providers =
      this.select(
        capability,
        request
      )

    const providerId =
      providers[0]

    if (!providerId) {
      return undefined
    }

    return {
      providerId,
      capability,
      reason:
        providerId ===
        this.routing.primaryProviderId
          ? "Configured primary provider."
          : "First available provider matching the requested capability.",
    }
  }
}
