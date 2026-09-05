import {
  ExecutionProvider,
  ExecutionRequest,
  ExecutionResult,
} from "./ExecutionProvider"

export class LocalModelExecutionProvider
  implements ExecutionProvider {

  readonly id = "ollama"

  readonly name =
    "Ollama Local Model"

  readonly capabilities =
    [
      "content-generation",
    ] as const

  private readonly baseUrl =
    "http://localhost:11434"

  private readonly model =
    "qwen2.5-coder:3b"

  canExecute(
    request: ExecutionRequest
  ): boolean {
    return Boolean(
      request.executionId &&
      request.actionId &&
      request.objective
    )
  }

  async execute(
    request: ExecutionRequest
  ): Promise<ExecutionResult> {

    const prompt =
      this.buildPrompt(request)

    try {
      const response =
        await fetch(
          `${this.baseUrl}/api/generate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              model:
                this.model,

              prompt,

              stream: false,
            }),
          }
        )

      if (!response.ok) {
        const error =
          `Ollama returned HTTP ${response.status}.`

        return {
          success: false,
          providerId: this.id,
          executionId:
            request.executionId,
          message: error,
          error,
        }
      }

      const data =
        await response.json() as {
          response?: string
          error?: string
        }

      if (data.error) {
        return {
          success: false,
          providerId: this.id,
          executionId:
            request.executionId,
          message:
            data.error,
          error:
            data.error,
        }
      }

      const output =
        data.response?.trim()

      if (!output) {
        return {
          success: false,
          providerId: this.id,
          executionId:
            request.executionId,
          message:
            "Local model returned an empty response.",
          error:
            "EMPTY_MODEL_RESPONSE",
        }
      }

      return {
        success: true,
        providerId: this.id,
        executionId:
          request.executionId,
        message:
          "Local model execution completed successfully.",
        output,
      }

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : String(error)

      return {
        success: false,
        providerId: this.id,
        executionId:
          request.executionId,
        message:
          "Local model execution failed.",
        error:
          message,
      }
    }
  }

  private buildPrompt(
    request: ExecutionRequest
  ): string {

    return [
      "You are the local execution model for MBO.",

      "",

      "Execute the following MBO action.",

      "",

      `Title: ${request.title}`,

      `Pattern type: ${request.patternType}`,

      `Pattern value: ${request.patternValue}`,

      "",

      "Objective:",

      request.objective,

      "",

      "Steps:",

      ...request.steps.map(
        (step, index) =>
          `${index + 1}. ${step}`
      ),

      "",

      "Success metrics:",

      ...request.successMetrics.map(
        (metric) =>
          `- ${metric}`
      ),

      "",

      "Return the completed execution output.",
    ].join("\n")
  }
}