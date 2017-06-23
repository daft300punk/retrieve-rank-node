import _ from 'lodash';
import moment from 'moment';
import decorate from 'decorate-it';
import WeatherDataService from './WeatherDataService';

const locations = require('../../config/dummyDataConfig/location');
const saleArticles = require('../../config/dummyDataConfig/saleArticles');
// contains weather info for all location, all days in a year.
const weatherInfoForAllLocation = {};

/**
 * Get the average weather info for each day, each location in advance.
 * Once we have it, we can use the value to retrieve weather info for any
 * day, any location, without making an api request all the time.
 * In the free account, we can only make 10 api requests per day. So
 * dont have more than 10 locations configured.
 * @returns {Promise}
 */
function getRequestPromiseArray() {
  // will cotain promise with request to get almanac data for each location
  const promiseArray = [];
  const startDate = '0101'; // mmdd
  const endDate = '1231';

  // Accummulate promise array.
  _.forEach(locations.dummyLocations, (location) => {
    let result = WeatherDataService.getWeatherHistory(location.geocode, { startDate, endDate });
    result = result.then(res => res.json());
    promiseArray.push(result);
  });

  return promiseArray;
}

/**
 * Generate an array containing date values in the range specified in
 * config. For each of these date values, we will generate sale data
 * for each article and each location.
 * @returns {Array} array of dates in range
 */
function getAllDatesInRange() {
  const start = moment(locations.timespan.startDate, 'MM-DD-YYYY');
  const end = moment(locations.timespan.endDate, 'MM-DD-YYYY');

  const dates = [];

  for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
    dates.push(m.format('MM-DD-YYYY'));
  }

  return dates;
}


/**
 * Generates a sale value taking into consideration the severity of weather,
 * averageSale rate of article, and the configured effect of good weather.
 * Severity value less than .2 makes multiplier 2. See below code of multiplier
 * values for other severity values.
 * @param {Object} article
 * @param {object} weatherInfo
 * @returns {Number} newSale the randomly generated sale following configured data.
 */
function generateDummySales(article, weatherInfo) {
  const avgSaleRate = parseFloat(article.averageSaleRate);
  const severity = weatherInfo.severity;

  let multiplier;
  // Assign multiplier value depending on weather severity.
  if (severity < 0.2) {
    multiplier = 2;
  } else if (severity < 0.4) {
    multiplier = 1;
  } else if (severity < 0.7) {
    multiplier = -1;
  } else {
    multiplier = -2;
  }

  const weatherEffect = parseFloat(article.goodWeatherEffect)
  const newSale = avgSaleRate +
    ((weatherEffect) * (multiplier) * (Math.random() * (avgSaleRate / 2)));

  return newSale;
}

/**
 * Generate weather info for the provided date and location
 * @param {Object} location
 * @param {Object} date
 * @returns {Object} the object containing weather data.
 */
function generateWeatherInfo(location, date) {
  const dayNumber = moment(date, 'MM-DD-YYYY').dayOfYear();
  const weatherInfo = weatherInfoForAllLocation[location.name].almanac_summaries[dayNumber - 1];
  const hi = weatherInfo.record_hi;
  const mean = weatherInfo.mean_temp;
  const lo = weatherInfo.record_lo;
  const randHigh = mean + ((hi - mean) * Math.random());
  const randLow = mean + ((lo - mean) * Math.random());
  const randMean = (randHigh + randLow) / 2;
  const rangeRanMeanMax = Math.max(Math.abs((hi - mean) / 2), Math.abs((lo - mean) / 2));
  const severity = (randMean - weatherInfo.mean_temp) / rangeRanMeanMax;
  return {
    avg_lo: parseInt(randLow, 10),
    avg_hi: parseInt(randHigh, 10),
    avg_mean: parseInt(randMean, 10),
    severity: Math.abs(severity),
  };
}

/**
 * Call this function to receive a promise that resolves with an arrary containing
 * sales data for each day, location, and article configured in /config/dummyDataConfig
 *
 * @returns {Promise} that resolves with generated dummy sales data.
 */
async function generateSalesData() {
  const promiseArray = getRequestPromiseArray();
  const result = await Promise.all(promiseArray);

  return new Promise((resolve, reject) => {
    try {
      _.forEach(locations.dummyLocations, (location, index) => {
        weatherInfoForAllLocation[location.name] = result[index];
      });


      const generatedData = [];
      const dates = getAllDatesInRange();

      _.forEach(saleArticles, (article) => {
        _.forEach(locations.dummyLocations, (location) => {
          _.forEach(dates, (date) => {
            const weatherInfo = generateWeatherInfo(location, date);
            const data = {
              date,
              articleName: article.name,
              sales: generateDummySales(article, weatherInfo),
              location,
              weatherInfo,
              avgSalesRate: article.averageSaleRate,
            };
            generatedData.push(data);
          });
        });
        resolve(generatedData);
      });
    } catch (e) {
      reject(e);
    }
  });
}

generateSalesData.params = [];
generateSalesData.schema = {};

const MockSalesDataService = {
  generateSalesData,
};

decorate(MockSalesDataService, 'MockSalesDataService');

export default MockSalesDataService;
