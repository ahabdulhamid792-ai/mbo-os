import { ProviderRouter } from "../router/ProviderRouter";

async function main() {
  const router = new ProviderRouter();

  const providers = await router.getAvailableProviders();

  console.log(
    "Available providers:",
    providers.map((provider) => provider.name)
  );

  const response = await router.generate(
    "Explain what a CRM is in one short sentence."
  );

  console.log("\nMBO AI RESPONSE:");
  console.log(response);
}

main().catch((error) => {
  console.error("\nTEST FAILED:");
  console.error(error);
  throw error;
});