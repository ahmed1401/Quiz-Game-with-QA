const path = require('path');

const automationReportsDir = path.resolve(__dirname, '../QA_Bundle/05_Reports/automation-reports');

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: automationReportsDir,
      outputName: 'backend-jest-report.xml',
      suiteName: 'backend-jest-suite'
    }],
    ['jest-html-reporters', {
      publicPath: automationReportsDir,
      filename: 'backend-jest-report.html',
      pageTitle: 'Backend Jest Report',
      openReport: false
    }]
  ]
};
