import { test } from 'node:test';
import assert from 'node:assert';
import Rating from './src/Rating.js';

// Test data
const sampleRatings = {
  oneStar: 10,
  twoStar: 20,
  threeStar: 15,
  fourStar: 30,
  fiveStar: 50
};

test('Rating Class', async (t) => {
  await t.test('should initialize with valid ratings', () => {
    const rating = new Rating(sampleRatings);
    assert.ok(rating instanceof Rating);
  });

  await t.test('should throw error for missing rating keys', () => {
    assert.throws(
      () => new Rating({}),
      Error,
      'Missing required rating keys'
    );
  });

  await t.test('should calculate correct average within expected range', () => {
    const rating = new Rating(sampleRatings);
    const average = rating.getAverage();
    assert.ok(average >= 1 && average <= 5, 'Average should be between 1 and 5');
    assert.ok(!isNaN(average), 'Average should be a number');
  });

  await t.test('should calculate correct total', () => {
    const rating = new Rating(sampleRatings);
    assert.strictEqual(rating.getTotal(), 125);
  });

  await t.test('should generate correct distribution percentages', () => {
    const rating = new Rating(sampleRatings);
    const distribution = rating.getDistribution();
    assert.strictEqual(distribution.fiveStar, 40);
    assert.strictEqual(distribution.oneStar, 8);
  });

  await t.test('should render HTML stars output', () => {
    const rating = new Rating(sampleRatings);
    const html = rating.render('html');
    assert.match(html, /class="sim-rating"/);
    assert.match(html, /★/);
  });

  await t.test('should render SVG output', () => {
    const rating = new Rating(sampleRatings);
    const svg = rating.render('svg');
    assert.match(svg, /<svg/);
    assert.match(svg, /<\/svg>/);
  });

  await t.test('should render valid JSON output', () => {
    const rating = new Rating(sampleRatings);
    const json = rating.render('json');
    assert.doesNotThrow(() => JSON.parse(json));
    const data = JSON.parse(json);
    assert.ok(data.average >= 1 && data.average <= 5, 'Average should be between 1 and 5');
  });

  await t.test('should normalize snake_case keys', () => {
    const rating = new Rating({
      one_star: 10,
      two_star: 20,
      three_star: 15,
      four_star: 30,
      five_star: 50
    });
    const average = rating.getAverage();
    assert.ok(average >= 1 && average <= 5, 'Average should be between 1 and 5');
  });

  await t.test('should handle interactive mode', () => {
    const rating = new Rating(sampleRatings, { interactive: true });
    const html = rating.render('html');
    assert.match(html, /rating-change/);
  });

  await t.test('should handle bar chart mode', () => {
    const rating = new Rating(sampleRatings, { type: 'bars' });
    const html = rating.render('html');
    assert.match(html, /sim-rating-bars/);
    assert.match(html, /5-star/);
  });
});