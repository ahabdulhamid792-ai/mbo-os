import {
  LocalModelExecutionProvider,
} from "../provider/LocalModelExecutionProvider"

import {
  ExecutionRequest,
} from "../provider/ExecutionProvider"

async function main() {
  console.log(
    "MBO LOCAL MODEL PROVIDER TEST"
  )

  const provider =
    new LocalModelExecutionProvider()

  const request:
    ExecutionRequest = {
      executionId:
        "execution:test:local-model",

      actionId:
        "action:test:local-model",

      patternType:
        "local-model-test",

      patternValue:
        "Test local AI execution.",

      title:
        "Local Model Test",

      objective:
        "Generate a short explanation of why execution providers are useful in an AI operating system.",

      steps: [
        "Explain the role of an execution provider.",
        "Explain how provider abstraction helps MBO.",
        "Keep the response concise.",
      ],

      successMetrics: [
        "Clear explanation",
        "Correct reasoning",
        "Concise output",
      ],
    }

  console.log(
    "\n1. PROVIDER"
  )

  console.log({
    id: provider.id,
    name: provider.name,
    capabilities:
      provider.capabilities,
  })

  console.log(
    "\n2. CAN EXECUTE"
  )

  console.log(
    provider.canExecute(
      request
    )
  )

  console.log(
    "\n3. EXECUTING LOCAL MODEL"
  )

  const result =
    await provider.execute(
      request
    )

  console.log(
    "\n4. EXECUTION RESULT"
  )

  console.dir(
    result,
    {
      depth: null,
    }
  )

  if (!result.success) {
    console.error(
      "\nLOCAL MODEL PROVIDER TEST FAILED"
    )

    process.exitCode = 1

    return
  }

  console.log(
    "\n5. MODEL OUTPUT"
  )

  console.log(
    result.output
  )

  console.log(
    "\nLOCAL MODEL PROVIDER TEST COMPLETE"
  )
}

main().catch(
  (error) => {
    console.error(
      "\nLOCAL MODEL PROVIDER TEST FAILED"
    )

    console.error(error)

    process.exitCode = 1
  }
)