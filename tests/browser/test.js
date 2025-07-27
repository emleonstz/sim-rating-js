const puppeteer = require('puppeteer');
const path = require('path');

describe('Browser Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Vanilla JS rating renders correctly', async () => {
    const content = await page.$eval('#vanilla-rating', el => el.innerHTML);
    expect(content).toContain('sim-rating');
    expect(content).toContain('★');
  });

  test('Module rating renders bars correctly', async () => {
    const content = await page.$eval('#module-rating', el => el.innerHTML);
    expect(content).toContain('sim-rating-bars');
    expect(content).toContain('5-star');
  });

  test('Interactive rating emits events', async () => {
    // Click the 4th star
    await page.click('#interactive-rating [data-rating-value="4"]');
    const output = await page.$eval('#interactive-output', el => el.textContent);
    expect(output).toContain('User rated: 4 stars');
  });
});