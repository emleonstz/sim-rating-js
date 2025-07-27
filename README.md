# in development
<p align="center">
  <img src="src/img/banner-min.png" alt="sim-rating" width="800">
</p>

# Sim-Rating - A Simple 5-Star Rating System for JavaScript

[![npm version](https://img.shields.io/npm/v/sim-rating-js.svg)](https://www.npmjs.com/package/sim-rating-js)
[![Build Status](https://github.com/emleonstz/sim-rating-js/actions/workflows/tests.yml/badge.svg)](https://github.com/emleonstz/sim-rating-js/actions)
[![License](https://img.shields.io/github/license/emleonstz/sim-rating-js.svg)](https://github.com/emleonstz/sim-rating-js/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/sim-rating-js)](https://bundlephobia.com/package/sim-rating-js)

Sim-Rating is a lightweight JavaScript library for displaying and calculating 5-star ratings. It supports multiple display formats (stars, bars, JSON, SVG) and works in both browser and Node.js environments.

<div align="center">

### Default Star Rating
<img src="src/img/s2.png" alt="5-star rating display" width="600">

---

### Custom Bar Rating  
<img src="src/img/s1.png" alt="Bar rating display" width="600">

</div>

## Features

- ⭐ Multiple output formats (HTML, SVG, JSON)
- 🎨 Customizable colors, sizes and styles
- 📊 Calculate averages, totals and distributions
- 🖥️ Works in browsers and Node.js
- 📱 Responsive and mobile-friendly
- ✅ 100% unit tested

## Installation

### Via NPM:
```bash
npm install sim-rating-js
```

### Via CDN:
```html
<script src="https://unpkg.com/sim-rating-js@latest/dist/Rating.js"></script>
```

## Usage

### Basic Implementation
```javascript
// ES Module
import Rating from 'sim-rating-js';

// CommonJS
// const Rating = require('sim-rating-js');

// Initialize with rating counts
const ratings = {
    oneStar: 10,
    twoStar: 20,
    threeStar: 15,
    fourStar: 30,
    fiveStar: 50
};

const rating = new Rating(ratings);

// Display 5-star rating
document.getElementById('rating-container').innerHTML = rating.render();
```

### Output Formats
```javascript
// As interactive HTML stars
rating.render('html', {
    interactive: true
});

// As SVG
const svgOutput = rating.render('svg');

// As JSON
const jsonOutput = rating.render('json');
// {
//   "average": 3.67,
//   "total": 125,
//   "distribution": {
//     "fiveStar": 40,
//     "fourStar": 24,
//     ...
//   }
// }

// As percentage bars
rating.render('html', {
    type: 'bars',
    barHeight: '25px'
});
```

### Customization Options
#### Star Display Options
```javascript
new Rating(ratings, {
    type: 'stars',       // Display type
    color: '#6a5acd',    // Star color
    size: '1.5rem',      // Size
    showAverage: false,  // Hide average
    showTotal: true      // Show count
});
```

#### Bar Display Options
```javascript
new Rating(ratings, {
    type: 'bars',
    color: '#4a90e2',             // Bar color
    barHeight: '20px',            // Bar thickness
    barShowPercentages: true,     // Show percentages
    showSummary: true             // Show summary
});
```

### Interactive Ratings
```javascript
const interactiveRating = new Rating(ratings, {
    interactive: true
});

document.getElementById('interactive-rating').innerHTML = 
    interactiveRating.render('html');

document.addEventListener('rating-change', (e) => {
    console.log('User rated:', e.detail.rating);
});
```

## Framework Integration

### React Component Example
```jsx
import { useEffect, useRef } from 'react';
import Rating from 'sim-rating-js';

function StarRating({ ratings }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const rating = new Rating(ratings, {
      interactive: true,
      size: '24px'
    });
    
    if (containerRef.current) {
      containerRef.current.innerHTML = rating.render('html');
    }
  }, [ratings]);

  return <div ref={containerRef} />;
}
```

### Vue Component Example
```vue
<template>
  <div ref="ratingContainer"></div>
</template>

<script>
import Rating from 'sim-rating-js';

export default {
  props: ['ratings'],
  mounted() {
    const rating = new Rating(this.ratings, {
      interactive: true
    });
    this.$refs.ratingContainer.innerHTML = rating.render('html');
    
    this.$refs.ratingContainer.addEventListener('rating-change', (e) => {
      this.$emit('rated', e.detail.rating);
    });
  }
};
</script>
```

## API Reference

### `new Rating(ratings, options)`
Creates a new rating instance.

**Parameters:**
- `ratings`: Object with required keys: `oneStar`, `twoStar`, `threeStar`, `fourStar`, `fiveStar`
- `options`: Configuration object (see below)

### Methods
- `.render(format = 'html', customOptions = {})`: Renders the rating
- `.getAverage()`: Returns the average rating
- `.getTotal()`: Returns total number of ratings
- `.getDistribution()`: Returns rating distribution percentages

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | `stars` | `stars` or `bars` |
| `color` | string | `#ffc107` | Main color |
| `size` | string | `1em` | Display size |
| `showAverage` | boolean | `true` | Show average rating |
| `showTotal` | boolean | `true` | Show total ratings |
| `interactive` | boolean | `false` | Make ratings clickable |
| `barHeight` | string | `20px` | Bar thickness |
| `barSpacing` | string | `8px` | Space between bars |
| `barBorderRadius` | string | `4px` | Bar corner radius |
| `barShowPercentages` | boolean | `true` | Show percentages |
| `barPercentagePrecision` | number | `1` | Decimal places for percentages |
| `barPercentageSuffix` | string | `%` | Percentage suffix |
| `showSummary` | boolean | `true` | Show summary text |

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License. See [LICENSE](LICENSE) for more information.

