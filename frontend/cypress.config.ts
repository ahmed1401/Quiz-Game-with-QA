import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: '../QA_Bundle/05_Reports/automation-reports/cypress-results.xml',
    toConsole: false,
    overwrite: true
  },
  e2e: {
    baseUrl: 'http://localhost:4300',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    screenshotOnRunFailure: true,
  },
});
