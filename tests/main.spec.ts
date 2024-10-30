// Disabled due to working with JSON objects:
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { test, expect } from '@playwright/test';

test('Webpage has title', async ({ page }) => {
  await page.goto('http://localhost:8080/');

  // Basic smoke test - expect the page to have a title
  await expect(page).toHaveTitle(/EpiVis/);
});

test('Shepherd tour steps are successfully loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  // Expect various Shepherd tour steps to be correctly loaded
  await expect(page.getByLabel('Welcome to EpiVis')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Main Chart')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Mouse Panning')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Mouse Cropping')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Mouse Zooming')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Chart Menu')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Toggle between Navigation')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Randomize Colors')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Toggle Point Rendering')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Dataset Scaling')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Download Screenshot')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Create Shareable Link')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Data Browser')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Load CSV File')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Load Data from EpiData API')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Draw a custom line (Advanced)')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Derive via a kernel function')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByLabel('Finish')).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();
  // Also test finish button to close
  await expect(page.getByLabel('Welcome to EpiVis')).toBeHidden();
  await page.locator('div:nth-child(5) > .uk-button').click();
  await expect(page.getByLabel('Welcome to EpiVis')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByLabel('Welcome to EpiVis')).toBeHidden();
});

test('FluSurv Import is successfully loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input FluSurv Import
  await page.getByLabel('FluSurv (source:').check();
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] FluSurv: Entire Network' })).toBeVisible();
});

test('Google Flu Trends Import is successfully loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input FluSurv Import
  await page.getByLabel('Google Flu Trends (source:').check();
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] GFT: U.S. National' })).toBeVisible();
});

test('Wikipedia Import is successfully loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input FluSurv Import
  await page.getByLabel('Wikipedia Access (source:').check();
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded (30s timeout due to loading speed - typically loads within 10s though)
  await expect(page.getByRole('button', { name: '[API] Wiki: amantadine, Daily' })).toBeVisible({ timeout: 30000 });
});

test('NIDSS Influenza Import is successfully loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input Dengue Import
  await page.getByLabel('NIDSS - Influenza (source:').check();
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] NIDSS-influenza: Taiwan National' })).toBeVisible();
});

test('NIDSS Dengue Import is successfully loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input Dengue Import
  await page.getByLabel('NIDSS - Dengue (source:').check();
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] NIDSS-Dengue: Taiwan National' })).toBeVisible();
});

test('Nowcast Import is successfully loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input Dengue Import
  await page.getByLabel('Nowcast (source:').check();
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] Delphi Nowcast: U.S. National' })).toBeVisible();
});

test('COVIDCast Import is successfully loaded #1', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input COVIDCast Import parameters
  await page.getByLabel('Delphi COVIDcast (source:').check();
  await page.getByLabel('Data Source').selectOption('chng');
  await page.locator('select[name="signal"]').selectOption('7dav_inpatient_covid');
  await page.getByLabel('Geographic Type').selectOption('state');
  await page.getByPlaceholder('e.g., PA or').click();
  await page.getByPlaceholder('e.g., PA or').fill('pa');
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] COVIDcast: chng:' })).toBeVisible();
  // Also test selection and deselection
  await expect(page.getByRole('button', { name: 'value' })).toBeVisible();
  await page.getByRole('button', { name: '[API] COVIDcast: chng:' }).click();
  await expect(page.getByRole('button', { name: 'value' })).toBeHidden();
  await page.getByRole('button', { name: '[API] COVIDcast: chng:' }).click();
  await expect(page.getByRole('button', { name: 'value' })).toBeVisible();
});

test('COVIDCast Import is successfully loaded #2', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input COVIDCast Import parameters
  await page.getByLabel('Delphi COVIDcast (source:').check();
  await page.getByLabel('Data Source').selectOption('jhu-csse');
  await page.locator('select[name="signal"]').selectOption('confirmed_7dav_cumulative_num');
  await page.getByLabel('Geographic Type').selectOption('county');
  await page.getByPlaceholder('e.g., PA or').click();
  await page.getByPlaceholder('e.g., PA or').fill('42003');
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] COVIDcast: jhu-csse:' })).toBeVisible();
});

test('COVIDCast Import is successfully loaded #3', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input COVIDCast Import parameters
  await page.getByLabel('Delphi COVIDcast (source:').check();
  await page.getByLabel('Data Source').selectOption('google-symptoms');
  await page.locator('select[name="signal"]').selectOption('ageusia_raw_search');
  await page.getByLabel('Geographic Type').selectOption('nation');
  await page.getByPlaceholder('e.g., PA or').click();
  await page.getByPlaceholder('e.g., PA or').fill('us');
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] COVIDcast: google-symptoms:' })).toBeVisible();
});

test('COVID Hospitalization Import is successfully loaded', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('side button').nth(1).click();
  // Input Dengue Import
  await page.getByLabel('COVID Hospitalization (source:').check();
  await page.getByRole('button', { name: 'Fetch Data' }).click();
  // Expect it to be loaded
  await expect(page.getByRole('button', { name: '[API] COVID Hospitalization: AK' })).toBeVisible();
});

test('Default dataset converts into a shareable link', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  // Expect initial dataset to be loaded
  await expect(page.getByRole('button', { name: '%ILI' })).toBeVisible();
  // Get shareable link, convert to base64
  await page.locator('div:nth-child(4) > button:nth-child(2)').click();
  const shareableLink = await page.getByRole('textbox').inputValue();
  expect(shareableLink).toContain('http://localhost:8080/#');
  const base64 = shareableLink.split('#')[1];
  const decoded = Buffer.from(base64, 'base64').toString('binary');
  const json = JSON.parse(decoded);
  // Expect elements from the initial dataset to be present
  expect(json['datasets'][0]['title']).toEqual('%wILI');
  expect(json['datasets'][0]['params']).toEqual({ _endpoint: 'fluview', regions: 'nat' });
});

test('Data is autofitted, but only when that mode is selected', async ({ page }) => {
  function getViewport(shareableLink: string) {
    const base64 = shareableLink.split('#')[1];
    const decoded = Buffer.from(base64, 'base64').toString('binary');
    const json = JSON.parse(decoded);
    return json['chart']['viewport'];
  }

  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  // Get initial viewport
  await page.locator('div:nth-child(4) > button:nth-child(2)').click();
  const viewport1 = getViewport(await page.getByRole('textbox').inputValue());
  await page.getByLabel('Close').click();
  // Select num_patients, expect viewport to change
  await page.getByRole('button', { name: 'num_patients' }).click();
  await page.waitForTimeout(3000); // viewport change animation
  await page.locator('div:nth-child(4) > button:nth-child(2)').click();
  const viewport2 = getViewport(await page.getByRole('textbox').inputValue());
  expect(viewport1).not.toEqual(viewport2);
  await page.getByLabel('Close').click();
  // Unselect autofit mode, expect viewport not to change
  await page.locator('button:nth-child(2)').first().click();
  await page.getByRole('button', { name: 'num_patients' }).click();
  await page.locator('div:nth-child(4) > button:nth-child(2)').click();
  const viewport3 = getViewport(await page.getByRole('textbox').inputValue());
  expect(viewport3).toEqual(viewport2);
  await page.getByLabel('Close').click();
});

test('Colors are randomized', async ({ page }) => {
  function getColor(shareableLink: string) {
    const base64 = shareableLink.split('#')[1];
    const decoded = Buffer.from(base64, 'base64').toString('binary');
    const json = JSON.parse(decoded);
    return json['datasets'][0]['color'];
  }

  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: 'Cancel' }).click();
  // Expect initial dataset to be loaded
  await expect(page.getByRole('button', { name: '%ILI' })).toBeVisible();
  // Get initial color
  await page.locator('div:nth-child(4) > button:nth-child(2)').click();
  const color1 = getColor(await page.getByRole('textbox').inputValue());
  await page.getByLabel('Close').click();
  // Randomize color, expect it to change
  await page.locator('div:nth-child(2) > button:nth-child(1)').click();
  await page.locator('div:nth-child(4) > button:nth-child(2)').click();
  const color2 = getColor(await page.getByRole('textbox').inputValue());
  expect(color2).not.toEqual(color1);
});
