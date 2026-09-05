import {
  ExecutionRequest,
  ProviderCapability,
} from "../provider/ExecutionProvider"

import {
  MBOAction,
} from "../action/ActionEngine"

export type PolicyDecision =
  | "allow"
  | "deny"
  | "approval-required"

export interface ExecutionPolicyContext {
  executionId: string

  action: MBOAction

  capability: ProviderCapability

  request: ExecutionRequest
}

export interface ExecutionPolicyResult {
  decision: PolicyDecision

  allowed: boolean

  requiresApproval: boolean

  reason: string

  restrictions: string[]
}

export class ExecutionPolicyEngine {
  evaluate(
    context: ExecutionPolicyContext
  ): ExecutionPolicyResult {
    const {
      action,
      capability,
    } = context

    /*
     * Safety rule:
     * Actions that can create or publish
     * external-facing content require approval.
     */
    if (
      capability ===
        "social-publishing"
    ) {
      return {
        decision:
          "approval-required",

        allowed:
          false,

        requiresApproval:
          true,

        reason:
          "Social publishing can create an external business action and requires explicit approval.",

        restrictions: [
          "Do not publish automatically.",
          "Require explicit approval before execution.",
          "Preserve an execution record.",
        ],
      }
    }

    /*
     * High-priority strategic actions
     * should remain approval-gated.
     */
    if (
      action.priority ===
        "critical" ||
      action.priority ===
        "high"
    ) {
      return {
        decision:
          "approval-required",

        allowed:
          false,

        requiresApproval:
          true,

        reason:
          `The "${action.priority}" priority action requires human approval before execution.`,

        restrictions: [
          "Require explicit approval.",
          "Do not modify the strategic decision automatically.",
          "Record the execution outcome.",
        ],
      }
    }

   /*
 * Analytics is read-only.
 */
if (
  capability ===
    "analytics"
) {
  return {
    decision:
      "allow",

    allowed:
      true,

    requiresApproval:
      false,

    reason:
      "Analytics is a read-only capability.",

    restrictions: [],
  }
}

/*
 * Monitoring actions are safe because
 * they do not perform external changes.
 */
if (
  action.actionType ===
    "monitor"
) {
  return {
    decision:
      "allow",

    allowed:
      true,

    requiresApproval:
      false,

    reason:
      "Monitoring does not perform an external business action.",

    restrictions: [],
  }
}
    /*
     * Default:
     * Allow execution but preserve
     * the execution audit trail.
     */
    return {
      decision:
        "allow",

      allowed:
        true,

      requiresApproval:
        false,

      reason:
        "The requested action is permitted under the current execution policy.",

      restrictions: [
        "Record the execution.",
        "Preserve the provider result.",
      ],
    }
  }
}
