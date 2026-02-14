module.exports = {
  default: {
    require: ['features/**/*.ts'],
    requireModule: ['ts-node/register'],

    format: [
      'progress',
      'allure-cucumberjs/reporter'
    ],

    formatOptions: {
      resultsDir: 'allure-results'
    }
  }
};