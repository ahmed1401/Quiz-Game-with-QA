import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4300',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: true,
  },
});
