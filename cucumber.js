/**
 * Cucumber Configuration for PipelineCraft-R3
 * BDD Test Execution Settings
 */

const common = {
  require: [
    'tests/e2e/step-definitions/**/*.ts'
  ],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'junit:reports/cucumber-junit.xml',
    '@cucumber/pretty-formatter'
  ],
  formatOptions: {
    snippetInterface: 'async-await',
    colorsEnabled: true
  },
  publishQuiet: true,
};

module.exports = {
  default: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    parallel: 2,
    retry: 1,
    retryTagFilter: '@flaky',
    tags: 'not @skip and not @wip',
  },

  // Configuration for running only smoke tests
  smoke: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    tags: '@smoke',
  },

  // Configuration for running regression tests
  regression: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    tags: '@regression',
    parallel: 3,
  },

  // Configuration for CI/CD pipeline
  ci: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    parallel: 2,
    retry: 2,
    tags: 'not @skip and not @wip and not @manual',
    format: [
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'junit:reports/cucumber-junit.xml'
    ],
  },
};
