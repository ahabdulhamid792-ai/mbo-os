import {
  ExecutionPolicyEngine,
  ExecutionPolicyContext,
  ExecutionPolicyResult,
} from "../policy/ExecutionPolicyEngine"

export type AuthorizationStatus =
  | "authorized"
  | "approval-required"
  | "denied"

export interface ExecutionAuthorizationResult {
  status: AuthorizationStatus
  allowed: boolean
  requiresApproval: boolean
  reason: string
  restrictions: string[]
  policy: ExecutionPolicyResult
}

export class ExecutionAuthorizationEngine {
  constructor(
    private readonly policy:
      ExecutionPolicyEngine
  ) {}

  authorize(
    context: ExecutionPolicyContext
  ): ExecutionAuthorizationResult {
    const result =
      this.policy.evaluate(
        context
      )

    if (
      result.decision ===
      "deny"
    ) {
      return {
        status:
          "denied",

        allowed:
          false,

        requiresApproval:
          false,

        reason:
          result.reason,

        restrictions:
          result.restrictions,

        policy:
          result,
      }
    }

    if (
      result.decision ===
      "approval-required"
    ) {
      return {
        status:
          "approval-required",

        allowed:
          false,

        requiresApproval:
          true,

        reason:
          result.reason,

        restrictions:
          result.restrictions,

        policy:
          result,
      }
    }

    return {
      status:
        "authorized",

      allowed:
        true,

      requiresApproval:
        false,

      reason:
        result.reason,

      restrictions:
        result.restrictions,

      policy:
        result,
    }
  }
}