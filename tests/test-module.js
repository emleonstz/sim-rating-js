import Rating from 'sim-rating-js';

const ratings = {
    oneStar: 10,
    twoStar: 20,
    threeStar: 15,
    fourStar: 30,
    fiveStar: 50
};

const rating = new Rating(ratings);
console.log('Average:', rating.getAverage());
console.log('JSON Output:', rating.render('json'));
