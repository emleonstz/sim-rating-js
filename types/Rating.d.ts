declare class Rating {
  constructor(ratings: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  }, options?: {
    type?: 'stars' | 'bars';
    color?: string;
    size?: string;
    showAverage?: boolean;
    showTotal?: boolean;
    interactive?: boolean;
    barHeight?: string;
    barSpacing?: string;
    barBorderRadius?: string;
    barShowPercentages?: boolean;
    barPercentagePrecision?: number;
    barPercentageSuffix?: string;
    showSummary?: boolean;
  });

  getAverage(): number;
  getTotal(): number;
  getDistribution(): Record<string, number>;
  render(format?: 'html' | 'svg' | 'json', customOptions?: Record<string, any>): string;
}

export = Rating;