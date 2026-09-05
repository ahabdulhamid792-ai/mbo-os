import {
  ExecutionProvider,
  ExecutionRequest,
  ProviderCapability,
} from "./ExecutionProvider"

import {
  ProviderRegistry,
} from "./ProviderRegistry"

export interface ProviderRoute {
  providerId: string
  capability: ProviderCapability
  reason: string
}

export class ProviderRouter {
  private readonly providers: ProviderRegistry

  constructor(
    providers: ProviderRegistry
  ) {
    this.providers = providers
  }

  route(
    capability: ProviderCapability,
    request: ExecutionRequest
  ): ProviderRoute | undefined {
    const provider =
      this.providers
        .getAll()
        .find(
          (candidate) =>
            candidate.capabilities.includes(
              capability
            ) &&
            candidate.canExecute(
              request
            )
        )

    if (!provider) {
      return undefined
    }

    return {
      providerId:
        provider.id,

      capability,

      reason:
        `Provider "${provider.name}" ` +
        `supports "${capability}" ` +
        `and can execute this request.`,
    }
  }
}
