/**
* Update the available articles for sale. Specify the effect of good weather
* on sale. 1 is for positive effect, 0 no effect, -1 for negative effect.
*/


module.exports = [
  {
    name: 'Icecream',
    averageSaleRate: '120',
    goodWeatherEffect: '1',
  },
  {
    name: 'Shoes',
    averageSaleRate: '1020',
    goodWeatherEffect: '1',
  },
  {
    name: 'Umbrella',
    averageSaleRate: '120',
    goodWeatherEffect: '-1',
  },
];
