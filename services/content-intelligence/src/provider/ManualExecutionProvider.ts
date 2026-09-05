import {
  ExecutionProvider,
  ExecutionRequest,
  ExecutionResult,
} from "./ExecutionProvider"

export class ManualExecutionProvider
  implements ExecutionProvider {

  readonly id =
    "manual"

  readonly name =
    "Manual Execution Provider"

  readonly capabilities = [
    "content-generation",
    "image-generation",
    "video-generation",
    "voice-generation",
    "social-publishing",
    "analytics",
  ] as const

  canExecute(
    request: ExecutionRequest
  ): boolean {
    return Boolean(
      request.executionId &&
      request.actionId
    )
  }

  async execute(
    request: ExecutionRequest
  ): Promise<ExecutionResult> {
    return {
      success: true,

      providerId:
        this.id,

      executionId:
        request.executionId,

      message:
        `Execution prepared for "${request.title}". ` +
        `Manual provider does not perform external actions.`,

      output: {
        mode: "manual",
        executionId:
          request.executionId,
        actionId:
          request.actionId,
        objective:
          request.objective,
        steps:
          request.steps,
      },
    }
  }
}
