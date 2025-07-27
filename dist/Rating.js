(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? (module.exports = factory())
        : typeof define === "function" && define.amd
        ? define(factory)
        : ((global = typeof globalThis !== "undefined" ? globalThis : global || self),
          ((global.SimRating = global.SimRating || {}), (global.SimRating.Rating = factory())));
})(this, function () {
    "use strict";

    class Rating {
        constructor(ratings, options = {}) {
            this.ratings = this.normalizeKeys(ratings);
            this.validateRatings(this.ratings);
            this.options = {
                type: "stars",
                color: "#ffc107",
                size: "1em",
                showAverage: true,
                showTotal: true,
                interactive: false,
                barHeight: "20px",
                barSpacing: "8px",
                barBorderRadius: "4px",
                barShowPercentages: true,
                barPercentagePrecision: 1,
                barPercentageSuffix: "%",
                showSummary: true,
                ...options,
            };
        }

        normalizeKeys(ratings) {
            const normalized = {};
            for (const [key, value] of Object.entries(ratings)) {
                const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                normalized[camelCaseKey] = value;
            }
            return normalized;
        }

        validateRatings(ratings) {
            const requiredKeys = ["oneStar", "twoStar", "threeStar", "fourStar", "fiveStar"];
            const missingKeys = requiredKeys.filter((key) => !(key in ratings));

            if (missingKeys.length > 0) {
                throw new Error(`Missing required rating keys: ${missingKeys.join(", ")}`);
            }

            Object.entries(ratings).forEach(([key, value]) => {
                if (typeof value !== "number" || value < 0) {
                    throw new Error(`Invalid value for ${key}: must be a positive number`);
                }
            });
        }

        getAverage() {
            const starValues = {
                oneStar: 1,
                twoStar: 2,
                threeStar: 3,
                fourStar: 4,
                fiveStar: 5,
            };

            const {total, sum} = Object.entries(this.ratings).reduce(
                (acc, [key, count]) => {
                    const value = starValues[key];
                    return {
                        total: acc.total + count,
                        sum: acc.sum + value * count,
                    };
                },
                {total: 0, sum: 0}
            );

            // Apply any business-specific adjustments here
            const rawAverage = total > 0 ? sum / total : 0;
            const adjustedAverage = rawAverage * 0.956; // Example adjustment

            return parseFloat(adjustedAverage.toFixed(2));
        }

        getTotal() {
            return Object.values(this.ratings).reduce((sum, count) => sum + count, 0);
        }

        getDistribution() {
            const total = this.getTotal();
            return Object.fromEntries(
                Object.entries(this.ratings).map(([key, count]) => [
                    key,
                    total > 0 ? parseFloat(((count / total) * 100).toFixed(2)) : 0,
                ])
            );
        }

        render(format = "html", customOptions = {}) {
            const options = {...this.options, ...customOptions};

            try {
                switch (format.toLowerCase()) {
                    case "json":
                        return this.renderJson();
                    case "svg":
                        return this.renderSvg(options);
                    case "html":
                    default:
                        return this.renderHtml(options);
                }
            } catch (error) {
                console.error("Error rendering rating:", error);
                return "";
            }
        }

        renderHtml(options) {
            const average = this.getAverage();
            const total = this.getTotal();

            if (options.type === "bars") {
                return this.renderBars(options);
            }

            return `
        <div class="sim-rating" style="font-size: ${options.size}">
          ${this.renderStars(average, options)}
          ${options.showAverage ? `<span class="sim-rating-average">${average.toFixed(1)}</span>` : ""}
          ${options.showTotal ? `<span class="sim-rating-total">(${total} ratings)</span>` : ""}
          ${options.interactive ? this.getInteractiveJS() : ""}
        </div>
      `;
        }

        renderStars(average, options) {
            const fullStars = Math.floor(average);
            const hasHalfStar = average - fullStars >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            return [
                "★".repeat(fullStars).replace(/★/g, `<span style="color: ${options.color}">★</span>`),
                hasHalfStar ? `<span style="color: ${options.color}">½</span>` : "",
                "☆".repeat(emptyStars),
            ].join("");
        }

        renderBars(options) {
            const distribution = this.getDistribution();
            const totalRatings = this.getTotal();

            return `
        <div class="sim-rating-bars" style="width:100%">
          ${Object.entries(this.getStarLabels())
          .map(([key, label]) => this.renderBar(key, label, distribution[key] || 0, this.ratings[key] || 0, options))
          .join("")}
          ${options.showSummary ? this.renderSummary() : ""}
        </div>
      `;
        }

        getStarLabels() {
            return {
                fiveStar: "5-star",
                fourStar: "4-star",
                threeStar: "3-star",
                twoStar: "2-star",
                oneStar: "1-star",
            };
        }

        renderBar(key, label, percentage, count, options) {
            const percentageText = options.barShowPercentages
                ? `${percentage.toFixed(options.barPercentagePrecision)}${options.barPercentageSuffix}`
                : "";

            return `
        <div class="sim-rating-bar-container" style="margin-bottom:${options.barSpacing}">
          <div class="sim-rating-bar-label" style="width:80px">
            ${label}: ${count}
          </div>
          <div class="sim-rating-bar-bg" style="
            height:${options.barHeight};
            background:#f0f0f0;
            border-radius:${options.barBorderRadius};
            width:100%;
            overflow:hidden">
            <div class="sim-rating-bar-fill" style="
              width:${percentage}%;
              height:100%;
              background:${options.color};
              border-radius:${options.barBorderRadius};
              transition:width 0.3s ease">
            </div>
          </div>
          ${
              percentageText
                  ? `
                <div class="sim-rating-bar-percent" style="width:50px;text-align:right">
                  ${percentageText}
                </div>
              `
                  : ""
          }
        </div>
      `;
        }

        renderSummary() {
            return `
        <div class="sim-rating-summary" style="margin-top:12px">
          Average: <strong>${this.getAverage().toFixed(1)}</strong> 
          from <strong>${this.getTotal()}</strong> ratings
        </div>
      `;
        }

        getInteractiveJS() {
            return `
        <script>
          (function() {
            const dispatchRatingEvent = (element, value) => {
              element.dispatchEvent(new CustomEvent('rating-change', {
                detail: { rating: value },
                bubbles: true
              }));
            };

            document.querySelectorAll('.sim-rating').forEach(ratingEl => {
              ratingEl.addEventListener('click', (e) => {
                const star = e.target.closest('[data-rating-value]');
                if (star) {
                  const value = parseInt(star.dataset.ratingValue);
                  dispatchRatingEvent(ratingEl, value);
                }
              });
            });
          })();
        </script>
      `;
        }

        renderJson() {
            return JSON.stringify({
                average: this.getAverage(),
                total: this.getTotal(),
                distribution: this.getDistribution(),
            });
        }

        renderSvg(options = {}) {
            const opts = {...this.options, ...options};
            const average = this.getAverage();
            const total = this.getTotal();
            const size = parseFloat(opts.size) || 24;
            const color = opts.color || "#ffc107";
            const showText = opts.showAverage !== false || opts.showTotal !== false;
            const starSize = size;
            const spacing = starSize * 0.3;
            const width = starSize * 5 + spacing * 4 + (showText ? size * 4 : 0);
            const height = starSize * 1.2;

            const fullStars = Math.floor(average);
            const hasHalfStar = average - fullStars >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            const starPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

            let stars = "";
            let xPos = 0;

            for (let i = 0; i < fullStars; i++) {
                stars += `<path d="${starPath}" fill="${color}" 
             transform="translate(${xPos},0) scale(${starSize / 24})"/>`;
                xPos += starSize + spacing;
            }

            if (hasHalfStar) {
                stars += `
          <defs>
              <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                  <stop offset="50%" stop-color="${color}"/>
                  <stop offset="50%" stop-color="transparent" stop-opacity="0"/>
              </linearGradient>
          </defs>
          <path d="${starPath}" fill="url(#half-star)" stroke="${color}" stroke-width="1"
               transform="translate(${xPos},0) scale(${starSize / 24})"/>`;
                xPos += starSize + spacing;
            }

            for (let i = 0; i < emptyStars; i++) {
                stars += `<path d="${starPath}" fill="transparent" stroke="#ddd" stroke-width="1"
               transform="translate(${xPos},0) scale(${starSize / 24})"/>`;
                xPos += starSize + spacing;
            }

            let textElements = "";
            if (showText) {
                let textContent = [];
                if (opts.showAverage !== false) {
                    textContent.push(`${average.toFixed(1)}`);
                }
                if (opts.showTotal !== false) {
                    textContent.push(`(${total} ratings)`);
                }

                textElements = `
          <text x="${xPos + size * 0.5}" y="${size * 0.6}" 
                font-family="Arial, sans-serif" 
                font-size="${size * 0.6}" 
                fill="#666">
              ${textContent.join(" ")}
          </text>`;
            }

            return `
          <svg width="${width}" height="${height}" 
               viewBox="0 0 ${width} ${height}" 
               xmlns="http://www.w3.org/2000/svg">
              ${stars}
              ${textElements}
              ${opts.interactive ? this.getSvgInteractiveJS() : ""}
          </svg>`;
        }

        getSvgInteractiveJS() {
            return `
          <script>
              document.querySelectorAll('.sim-rating-svg').forEach(svg => {
                  svg.addEventListener('click', (e) => {
                      const star = e.target.closest('path[fill]');
                      if (star) {
                          const stars = [...svg.querySelectorAll('path[fill]')];
                          const clickedIndex = stars.indexOf(star);
                          svg.dispatchEvent(new CustomEvent('rating-change', {
                              detail: { rating: clickedIndex + 1 }
                          }));
                      }
                  });
              });
          </script>
      `;
        }
    }

    return Rating;
});
