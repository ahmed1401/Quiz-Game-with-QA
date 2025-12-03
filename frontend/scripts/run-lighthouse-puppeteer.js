#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? 'http://localhost:4300';
const auditCategories = process.env.LIGHTHOUSE_CATEGORIES ?? 'performance,accessibility,best-practices,seo';
const auditCategoryList = auditCategories.split(',').map((entry) => entry.trim()).filter(Boolean);
const userEmail = process.env.LIGHTHOUSE_USER_EMAIL ?? 'ahmed@ahmed.com';
const userPassword = process.env.LIGHTHOUSE_USER_PASSWORD ?? 'Ahmed@14';
const quizCategory = process.env.LIGHTHOUSE_CATEGORY ?? 'Computer Science';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportsDir = path.join(__dirname, '..', 'lighthouse-reports', `${timestamp}-auth`);
fs.mkdirSync(reportsDir, { recursive: true });

let lighthouseModule;

const routes = [
  { slug: 'register', path: '/register' },
  { slug: 'login', path: '/login' },
  { slug: 'welcome', path: '/welcome' },
  { slug: 'quiz', path: '/quiz' },
  { slug: 'leaderboard', path: '/leaderboard' }
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--remote-debugging-port=0', '--disable-gpu', '--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    page.on('dialog', (dialog) => dialog.accept().catch(() => undefined));

    await registerUser(page);
    await loginUser(page);
    await seedQuizCategory(page);

    const port = extractPort(browser.wsEndpoint());

    for (const route of routes) {
      await runLighthouseAudit(route, port);
    }

    console.log('All authenticated Lighthouse audits completed.');
  } catch (error) {
    console.error('Authenticated Lighthouse run failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();

async function registerUser(page) {
  console.log('Registering user (will ignore errors if already exists)...');
  try {
    await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle0' });
    await clearAndType(page, 'input[name="email"]', userEmail);
    await clearAndType(page, 'input[name="username"]', userEmail.split('@')[0]);
    await clearAndType(page, 'input[name="password"]', userPassword);
    await clearAndType(page, 'input[name="confirmPassword"]', userPassword);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 7000 }).catch(() => undefined),
      page.click('button[type="submit"]'),
    ]);
  } catch (error) {
    console.warn('Registration step encountered an error (likely already registered):', error.message);
  }
}

async function loginUser(page) {
  console.log('Logging in user...');
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle0' });
  await clearAndType(page, 'input[name="email"]', userEmail);
  await clearAndType(page, 'input[name="password"]', userPassword);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }),
    page.click('button[type="submit"]'),
  ]);

  if (!page.url().includes('/welcome')) {
    throw new Error('Login did not navigate to /welcome.');
  }

  console.log('Login successful.');
}

async function seedQuizCategory(page) {
  await page.evaluate((category) => {
    localStorage.setItem('quizCategory', category);
  }, quizCategory);
}

async function runLighthouseAudit(route, port) {
  const url = new URL(route.path, baseUrl).toString();
  console.log(`Running Lighthouse for ${url}`);

  const lighthouse = await loadLighthouse();
  const result = await lighthouse(url, {
    port,
    disableStorageReset: true,
    logLevel: 'error',
    output: ['html', 'json'],
    onlyCategories: auditCategoryList,
  }, {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'desktop',
      screenEmulation: { disabled: true },
      emulatedUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
    },
  });

  const htmlReportPath = path.join(reportsDir, `${route.slug}.report.html`);
  const jsonReportPath = path.join(reportsDir, `${route.slug}.report.json`);
  fs.writeFileSync(htmlReportPath, result.report[0]);
  fs.writeFileSync(jsonReportPath, result.report[1]);
  console.log(`Saved reports for ${route.slug} -> ${htmlReportPath}`);
}

function extractPort(wsEndpoint) {
  const { port } = new URL(wsEndpoint);
  return Number(port);
}

async function loadLighthouse() {
  if (!lighthouseModule) {
    ({ default: lighthouseModule } = await import('lighthouse'));
  }
  return lighthouseModule;
}

async function clearAndType(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 7000 });
  await page.focus(selector);
  await page.evaluate((sel) => {
    const input = document.querySelector(sel);
    if (input) input.value = '';
  }, selector);
  await page.type(selector, value);
}
