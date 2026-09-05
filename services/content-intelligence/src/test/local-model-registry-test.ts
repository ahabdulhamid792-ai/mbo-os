import {
  ProviderRegistry,
} from "../provider/ProviderRegistry"

import {
  LocalModelExecutionProvider,
} from "../provider/LocalModelExecutionProvider"

async function main() {
  console.log(
    "MBO LOCAL MODEL REGISTRY TEST"
  )

  const registry =
    new ProviderRegistry()

  const ollama =
    new LocalModelExecutionProvider()

  console.log(
    "\n1. REGISTERING OLLAMA"
  )

  registry.register(
    ollama
  )

  console.log(
    "\n2. GET PROVIDER"
  )

  const provider =
    registry.get("ollama")

  console.dir(
    provider,
    {
      depth: null,
    }
  )

  console.log(
    "\n3. ALL PROVIDERS"
  )

  console.dir(
    registry.getAll(),
    {
      depth: null,
    }
  )

  console.log(
    "\n4. FIND CONTENT-GENERATION PROVIDER"
  )

  const contentProvider =
    registry.findProvider(
      "content-generation"
    )

  console.dir(
    contentProvider,
    {
      depth: null,
    }
  )

  if (
    !provider ||
    provider.id !== "ollama"
  ) {
    throw new Error(
      "Ollama provider was not found in the registry."
    )
  }

  if (
    !contentProvider ||
    contentProvider.id !== "ollama"
  ) {
    throw new Error(
      "Ollama was not discovered as a content-generation provider."
    )
  }

  console.log(
    "\nLOCAL MODEL REGISTRY TEST PASSED"
  )
}

main().catch(
  (error) => {
    console.error(
      "\nLOCAL MODEL REGISTRY TEST FAILED"
    )

    console.error(
      error
    )

    process.exitCode = 1
  }
)