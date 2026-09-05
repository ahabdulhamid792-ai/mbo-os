export interface UserRequest {
  input: string
  source: "dashboard" | "telegram" | "api"
}

export interface ExecutiveResponse {
  answer: string
  actions: string[]
}