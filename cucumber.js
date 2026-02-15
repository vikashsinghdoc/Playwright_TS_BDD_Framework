module.exports = {
  default: {
    requireModule: ["ts-node/register"],

    require: [
      "src/world/**/*.ts",
      "src/hooks/**/*.ts",
      "features/step-definitions/**/*.ts"
    ],

    paths: ["features/**/*.feature"],

    format: [
      "progress",
      "json:test-results/cucumber-report.json",
      "allure-cucumberjs/reporter"
    ],

    formatOptions: {
      resultsDir: "allure-results",
      snippetInterface: "async-await"
    },

    parallel: process.env.PARALLEL
      ? parseInt(process.env.PARALLEL)
      : 1,

    retry: process.env.RETRIES
      ? parseInt(process.env.RETRIES)
      : 0,

    publishQuiet: true
  }
};
