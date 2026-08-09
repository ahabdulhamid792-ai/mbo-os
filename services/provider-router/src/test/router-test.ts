import { ProviderRouter } from "../router/ProviderRouter";

async function main() {
  const router = new ProviderRouter();

  const providers = await router.getAvailableProviders();

  console.log(
    "Available providers:",
    providers.map((provider) => provider.name)
  );

  // Test 1: Normal AI request
  const response = await router.generate({
    prompt: "Explain what a CRM is in one short sentence.",
  });

  console.log("\nMBO AI RESPONSE:");
  console.log(response);

  // Test 2: Vision requirement
  try {
    await router.generate({
      prompt: "Analyze this image.",
      requiresVision: true,
    });

    console.log("\nERROR: Vision request should not have succeeded.");
  } catch (error) {
    console.log("\nVision routing test:");
    console.log(
      "Correctly rejected:",
      (error as Error).message
    );
  }
}

main().catch((error) => {
  console.error("\nTEST FAILED:");
  console.error(error);
  throw error;
});
