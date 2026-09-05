export type ProviderRole =
  | "primary"
  | "fallback"
  | "backup"

export interface ProviderModelConfiguration {
  id: string
  providerId: string
  name: string

  enabled: boolean

  capabilities: string[]

  role: ProviderRole

  priority: number
}

export interface ProviderConfiguration {
  id: string
  name: string

  enabled: boolean

  capabilities: string[]

  models: ProviderModelConfiguration[]
}

export interface ProviderRoutingConfiguration {
  primaryProviderId?: string

  fallbackProviderIds: string[]
}
