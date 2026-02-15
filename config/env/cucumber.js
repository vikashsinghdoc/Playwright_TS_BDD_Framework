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
      "allure-cucumberjs/reporter"
    ],

    formatOptions: {
      resultsDir: "allure-results"
    }
  }
};
