// Browser-Tests gegen dist/ (vorher: npm run build), ausgeliefert über einen lokalen Server wie auf GitHub Pages:
// mit Service Worker, eigenem Speicher je Test und echtem Neuladen. Handygröße wie ein typisches Android-Gerät.
// Eigenes Chromium: CHROMIUM_PATH=/pfad/zu/chrome npm run test:e2e
// Zusätzlich Firefox: PW_FIREFOX=1 npx playwright test --project=firefox (vorher: npx playwright install firefox)
const { defineConfig } = require('@playwright/test');
const chromium = { name:'chromium', use:{ browserName:'chromium', launchOptions:process.env.CHROMIUM_PATH ? { executablePath:process.env.CHROMIUM_PATH } : {} } };
const firefox = { name:'firefox', use:{ browserName:'firefox' } };
module.exports = defineConfig({
  testDir:'tests/e2e',
  timeout:60000,
  fullyParallel:true,
  reporter:process.env.CI ? 'github' : 'list',
  webServer:{ command:'node tools/serve.js 4173', url:'http://127.0.0.1:4173/', reuseExistingServer:!process.env.CI, timeout:20000 },
  use:{
    viewport:{ width:412, height:860 },
    deviceScaleFactor:2,
    colorScheme:'dark',
    actionTimeout:5000
  },
  projects:process.env.PW_FIREFOX ? [chromium, firefox] : [chromium]
});
