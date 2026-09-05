import {
  ExecutionProvider,
} from "./ExecutionProvider"

export class ProviderRegistry {
  private providers:
    Map<string, ExecutionProvider> =
    new Map()

  register(
    provider: ExecutionProvider
  ): void {
    this.providers.set(
      provider.id,
      provider
    )
  }

  get(
    providerId: string
  ): ExecutionProvider | undefined {
    return this.providers.get(
      providerId
    )
  }

  getAll():
    ExecutionProvider[] {
    return Array.from(
      this.providers.values()
    )
  }

  findProvider(
    capability:
      ExecutionProvider["capabilities"][number]
  ):
    ExecutionProvider | undefined {
    return this.getAll().find(
      (provider) =>
        provider.capabilities.includes(
          capability
        )
    )
  }
}
