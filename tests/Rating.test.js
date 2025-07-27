const Rating = require('../src/Rating.js');

describe('Rating Class', () => {
  const sampleRatings = {
    fiveStar: 42,
    fourStar: 27,
    threeStar: 15,
    twoStar: 8,
    oneStar: 4
  };

  test('should initialize with valid ratings', () => {
    const rating = new Rating(sampleRatings);
    expect(rating).toBeInstanceOf(Rating);
  });

  test('should throw error for missing rating keys', () => {
    expect(() => new Rating({})).toThrow('Missing required rating keys');
  });

  test('should calculate correct average', () => {
    const rating = new Rating(sampleRatings);
    expect(rating.getAverage()).toBeCloseTo(3.93, 2);
  });

  test('should calculate correct total', () => {
    const rating = new Rating(sampleRatings);
    expect(rating.getTotal()).toBe(96);
  });

  test('should generate correct distribution', () => {
    const rating = new Rating(sampleRatings);
    const distribution = rating.getDistribution();
    expect(distribution.fiveStar).toBeCloseTo(43.75, 2);
    expect(distribution.oneStar).toBeCloseTo(4.17, 2);
  });

  test('should render HTML stars output', () => {
    const rating = new Rating(sampleRatings);
    const html = rating.render('html');
    expect(html).toContain('sim-rating');
    expect(html).toContain('★');
  });

  test('should render SVG output', () => {
    const rating = new Rating(sampleRatings);
    const svg = rating.render('svg');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  test('should render JSON output', () => {
    const rating = new Rating(sampleRatings);
    const json = rating.render('json');
    expect(() => JSON.parse(json)).not.toThrow();
    expect(JSON.parse(json).toHaveProperty('average'));
  });
});