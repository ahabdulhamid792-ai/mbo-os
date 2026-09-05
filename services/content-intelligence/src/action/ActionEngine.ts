import {
  MBODecision,
} from "../decision/DecisionEngine"

export type ActionType =
  | "create"
  | "reduce"
  | "test"
  | "monitor"

export interface MBOAction {
  id: string

  decisionId: string

  patternType: string

  patternValue: string

  actionType: ActionType

  priority:
    | "critical"
    | "high"
    | "medium"
    | "low"

  urgency:
    | "immediate"
    | "next"
    | "monitor"

  title: string

  objective: string

  steps: string[]

  successMetrics: string[]

  requiresApproval: boolean
}

export class ActionEngine {
  generate(
    decisions: MBODecision[]
  ): MBOAction[] {
    return decisions.map(
      (decision) =>
        this.createAction(
          decision
        )
    )
  }

  private createAction(
    decision: MBODecision
  ): MBOAction {
    if (
      decision.action ===
      "scale"
    ) {
      return {
        id:
          `action:${decision.id}`,

        decisionId:
          decision.id,

        patternType:
          decision.patternType,

        patternValue:
          decision.patternValue,

        actionType:
          "create",

        priority:
          decision.priority,

        urgency:
          decision.urgency,

        title:
          `Scale "${decision.patternValue}"`,

        objective:
          `Increase the use of "${decision.patternValue}" ` +
          `while preserving measurement and business-outcome tracking.`,

        steps: [
          `Create 3 controlled variations of "${decision.patternValue}".`,
          "Keep the winning element consistent.",
          "Change only one major variable in each variation.",
          "Publish the variations according to the normal content schedule.",
          "Compare performance against the established baseline.",
        ],

        successMetrics: [
          "Views",
          "Engagement rate",
          "Completion rate",
          "Leads",
          "Conversions",
          "Revenue",
        ],

        requiresApproval:
          true,
      }
    }

    if (
      decision.action ===
      "reduce"
    ) {
      return {
        id:
          `action:${decision.id}`,

        decisionId:
          decision.id,

        patternType:
          decision.patternType,

        patternValue:
          decision.patternValue,

        actionType:
          "reduce",

        priority:
          decision.priority,

        urgency:
          decision.urgency,

        title:
          `Reduce "${decision.patternValue}"`,

        objective:
          `Reduce reliance on "${decision.patternValue}" ` +
          `because repeated evidence indicates declining performance.`,

        steps: [
          `Reduce production using "${decision.patternValue}".`,
          "Identify stronger established patterns.",
          "Create alternative executions.",
          "Compare the alternatives against the current baseline.",
          "Continue monitoring the declining pattern.",
        ],

        successMetrics: [
          "Views",
          "Engagement rate",
          "Completion rate",
          "Leads",
          "Conversions",
          "Revenue",
        ],

        requiresApproval:
          true,
      }
    }

    if (
      decision.action ===
      "test"
    ) {
      return {
        id:
          `action:${decision.id}`,

        decisionId:
          decision.id,

        patternType:
          decision.patternType,

        patternValue:
          decision.patternValue,

        actionType:
          "test",

        priority:
          decision.priority,

        urgency:
          decision.urgency,

        title:
          `Test "${decision.patternValue}"`,

        objective:
          `Collect stronger evidence before MBO recommends scaling or reducing "${decision.patternValue}".`,

        steps: [
          `Create 3 controlled variations of "${decision.patternValue}".`,
          "Change one major variable at a time.",
          "Keep the measurement period consistent.",
          "Compare results against the current baseline.",
          "Record the experiment outcome in MBO.",
        ],

        successMetrics: [
          "Views lift",
          "Engagement lift",
          "Completion lift",
          "Business value",
        ],

        requiresApproval:
          true,
      }
    }

    return {
      id:
        `action:${decision.id}`,

      decisionId:
        decision.id,

      patternType:
        decision.patternType,

      patternValue:
        decision.patternValue,

      actionType:
        "monitor",

      priority:
        decision.priority,

      urgency:
        decision.urgency,

      title:
        `Monitor "${decision.patternValue}"`,

      objective:
        `Continue collecting evidence without making a permanent strategic change.`,

      steps: [
        "Continue normal production.",
        "Track the relevant performance metrics.",
        "Record new experiments and outcomes.",
        "Re-evaluate when sufficient evidence accumulates.",
      ],

      successMetrics: [
        "New observations",
        "Performance trend",
        "Engagement trend",
        "Business outcome",
      ],

      requiresApproval:
        false,
    }
  }
}
