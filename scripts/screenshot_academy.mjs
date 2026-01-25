import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const base = process.env.STAGING_SITE || 'https://staging.eastgrinsteadac.co.uk';
  const url = `${base}/admin/members?token=dev`;
  console.log('Loading', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait for login flow to hide and admin portal show
  await page.waitForSelector('#admin-portal', { timeout: 15000 });

  // Open Academy tab
  await page.evaluate(() => {
    const btn = document.querySelector('#tab-btn-academy');
    if (btn) btn.click();
  });
  await page.waitForSelector('#academy-list .card', { timeout: 15000 });

  // Screenshot the list
  const listShot = '/tmp/academy_list.png';
  await page.screenshot({ path: listShot, fullPage: false });
  console.log('Saved', listShot);

  // Click preview on first card
  const previewButton = await page.$('#academy-list button[onclick^="previewAcademyInvitation"]');
  if (previewButton) {
    await previewButton.click();
    // Wait for modal
    await page.waitForSelector('#academy-preview-modal[style*="display:flex"]', { timeout: 10000 });
    const modalShot = '/tmp/academy_preview_modal.png';
    await page.screenshot({ path: modalShot, fullPage: false });
    console.log('Saved', modalShot);
  } else {
    console.log('Preview button not found');
  }

  await browser.close();
})();