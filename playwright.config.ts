import { defineConfig, devices } from "@playwright/test";

const browsers = [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
  { name: "edge", use: { ...devices["Desktop Chrome"], channel: "msedge" } },
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
] as const;

const viewports = [
  { name: "mobile-small", viewport: { width: 320, height: 568 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
  { name: "tablet", viewport: { width: 768, height: 1024 } },
  { name: "laptop", viewport: { width: 1366, height: 768 } },
  { name: "desktop", viewport: { width: 1920, height: 1080 } },
] as const;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 4,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  outputDir: "test-results",
  use: {
    baseURL: "http://127.0.0.1:4173",
    colorScheme: "dark",
    locale: "en-IN",
    timezoneId: "Asia/Kolkata",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: browsers.flatMap((browser) =>
    viewports.map(({ name, viewport }) => ({
      name: `${browser.name}-${name}`,
      use: {
        ...browser.use,
        viewport,
      },
    })),
  ),
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
