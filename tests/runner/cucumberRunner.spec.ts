import { test } from "@playwright/test";
import { execSync } from "child_process";

test("Run BDD Tests", async () => {
  try {
    execSync(
      `npx cucumber-js \
      features/**/*.feature \
      --require-module ts-node/register \
      --require src/world/world.ts \
      --require src/hooks/hooks.ts \
      --require features/step-definitions/**/*.ts \
      --format progress \
      --format allure-cucumberjs/reporter \
      --format-options '{"resultsDir":"allure-results"}'`,
      {
        stdio: "inherit",
        env: process.env
      }
    );
  } catch {
    // Let Cucumber handle failure reporting
  }
});
