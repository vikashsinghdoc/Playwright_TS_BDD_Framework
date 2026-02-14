module.exports = {
  default: {
    require: [
      'features/step-definitions/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'json:test-results/cucumber-report.json',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    timeout: 30000,
    publishQuiet: true
  }
};
