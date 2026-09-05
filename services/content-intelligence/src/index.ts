/*
 * MBO Content Intelligence
 * Public module exports
 *
 * IMPORTANT:
 * Keep this file explicit and deduplicated.
 * Do not append duplicate exports with `cat >>`.
 */

/* =========================
 * Strategy Engine
 * ========================= */

export {
  StrategyEngine,
} from "./strategy/StrategyEngine"

export type {
  StrategyRecommendation,
} from "./strategy/StrategyEngine"


/* =========================
 * Decision Engine
 * ========================= */

export {
  DecisionEngine,
} from "./decision/DecisionEngine"

export type {
  DecisionUrgency,
  MBODecision,
} from "./decision/DecisionEngine"


/* =========================
 * Action Engine
 * ========================= */

export {
  ActionEngine,
} from "./action/ActionEngine"

export type {
  ActionType,
  MBOAction,
} from "./action/ActionEngine"


/* =========================
 * Action Execution
 * ========================= */

export {
  ActionExecutionEngine,
} from "./execution/ActionExecutionEngine"

export type {
  ExecutionStatus,
  ActionExecution,
} from "./execution/ActionExecutionEngine"


/* =========================
 * Provider Contracts
 * ========================= */

export type {
  ProviderCapability,
  ExecutionRequest,
  ExecutionResult,
  ExecutionProvider,
} from "./provider/ExecutionProvider"


/* =========================
 * Provider Registry
 * ========================= */

export {
  ProviderRegistry,
} from "./provider/ProviderRegistry"


/* =========================
 * Manual Provider
 * ========================= */

export {
  ManualExecutionProvider,
} from "./provider/ManualExecutionProvider"


/* =========================
 * Provider Execution
 * ========================= */

export {
  ProviderExecutionEngine,
} from "./provider/ProviderExecutionEngine"


/* =========================
 * Provider Routing
 * ========================= */

export {
  ProviderRouter,
} from "./provider/ProviderRouter"

export type {
  ProviderRoute,
} from "./provider/ProviderRouter"


/* =========================
 * Provider Selection
 * ========================= */

export {
  ProviderSelectionEngine,
} from "./provider/ProviderSelectionEngine"

export type {
  ProviderSelection,
} from "./provider/ProviderSelectionEngine"


/* =========================
 * Model Execution Orchestration
 * ========================= */

export {
  ExecutionOrchestrator as ModelExecutionOrchestrator,
} from "./orchestration/ExecutionOrchestrator"

export type {
  OrchestrationResult as ModelExecutionOrchestrationResult,
} from "./orchestration/ExecutionOrchestrator"


/* =========================
 * Execution Orchestration
 * ========================= */

export {
  ExecutionOrchestrator,
} from "./execution/ExecutionOrchestrator"

export type {
  OrchestrationResult,
} from "./execution/ExecutionOrchestrator"


/* =========================
 * Execution Policy
 * ========================= */

export {
  ExecutionPolicyEngine,
} from "./policy/ExecutionPolicyEngine"

export type {
  PolicyDecision,
  ExecutionPolicyContext,
  ExecutionPolicyResult,
} from "./policy/ExecutionPolicyEngine"

/* =========================
 * Execution Authorization
 * ========================= */

export {
  ExecutionAuthorizationEngine,
} from "./authorization/ExecutionAuthorizationEngine"

export type {
  AuthorizationStatus,
  ExecutionAuthorizationResult,
} from "./authorization/ExecutionAuthorizationEngine"


/* =========================
 * Provider Failover
 * ========================= */

export {
  ProviderFailoverEngine,
} from "./provider/ProviderFailoverEngine"

export type {
  ProviderFailoverAttempt,
  ProviderFailoverResult,
} from "./provider/ProviderFailoverEngine"


/* =========================
 * Execution Audit
 * ========================= */

export {
  ExecutionAuditEngine,
} from "./audit/ExecutionAuditEngine"

export type {
  AuditEventType,
  ExecutionAuditEvent,
  CreateAuditEventInput,
} from "./audit/ExecutionAuditEngine"
