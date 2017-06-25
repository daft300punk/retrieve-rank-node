import _ from 'lodash';
import moment from 'moment';
import decorate from 'decorate-it';
import Joi from 'joi';
import WeatherDataService from './WeatherDataService';
import SolrServices from './SolrServices';

/**
 * Calculate weather severity using the same formula before in MockSalesDataService.
 * The value of severity is then used to find the day with severity closest to
 * calculated severity. The sales on that day gives a fair prediction of what the sales
 * should be.
 *
 * @param {Number} meanTempToday the forecast mean temp today
 * @param {Number} meanTempAvg avg mean temp from almanac services that day.
 * @param {Number} hi higest temp from almanac service that day.
 * @param {Number} lo lowest temp from almanac services that day.
 * @returns {Number} severity a measure of how severe weather will be.
 */
function calculateSeverity(meanTempToday, meanTempAvg, hi, lo) {
  const range = Math.max(Math.abs((hi - meanTempAvg) / 2), Math.abs((lo - meanTempAvg) / 2));
  const severity = (meanTempToday - meanTempAvg) / range;
  return Math.abs(severity);
}

/**
 * Returns forecast sales for the next 10 days. Note, we can only go as far as
 * 10 days, since weather service can predict weather only for the next 10 days.
 *
 * @param {Object} geocode geocode object containing lat, long
 * @param {Object} itemName should be article name from config/dummyConfig/saleArticle
 * @returns {Array} salesForecast for next 10 days, with a few more accompanying
 * parameters.
 */
async function getForecast(geocode, itemName) {
  try {
    // Dates in format weatherHistory service accepts.
    const startDate = moment().add(1, 'day').format('MMDD');
    const endDate = moment().add(10, 'day').format('MMDD');

    let weatherHistory = await WeatherDataService
      .getWeatherHistory(geocode, { startDate, endDate });
    weatherHistory = await weatherHistory.json();

    // almanac_summaries contains the relevant array
    const almanacSummaries = weatherHistory.almanac_summaries;

    let weatherForecast = await WeatherDataService
      .getWeatherForecast(geocode, 'daily', '10day');
    weatherForecast = await weatherForecast.json();

    const forecasts = weatherForecast.forecasts;
    // The first data is actually the data for today. Only predict for
    // starting from tomorrow.
    forecasts.shift();

    const severityArray = [];
    const resultPromise = [];

    // Collect promises in an array.
    _.forEach(forecasts, (forecast, index) => {
      const meanTempToday = (forecast.day.temp + forecast.night.temp) / 2;
      const severity = calculateSeverity(
        meanTempToday,
        almanacSummaries[index].mean_temp,
        almanacSummaries[index].record_hi,
        almanacSummaries[index].record_lo,
      ).toFixed(4);
      severityArray.push(severity);
      resultPromise.push(SolrServices.searchCollection(
        process.env.SOLR_CLUSTER_ID,
        {
          articleName: itemName,
          weather_severity: `[${severity} TO 1]`,
        },
        {
          weather_severity: 'asc',
        },
        1,
      ));
    });

    // wait for all promises to resolve.
    let result = await Promise.all(resultPromise);

    // format the return data in desired way.
    result = result.map((item, index) => {
      const meanTempToday =
        (forecasts[index].day.temp + forecasts[index].night.temp) / 2;
      const avgTempHistory = almanacSummaries[index].mean_temp;
      return {
        weather_severity: severityArray[index],
        predicted_sales: item.response.docs[0].salesToday,
        mean_temp_today: meanTempToday,
        avg_temp_history: avgTempHistory,
      };
    });
    return result;
  } catch (e) {
    throw e;
  }
}

getForecast.params = ['geocode', 'itemName'];
getForecast.schema = {
  geocode: Joi.object().keys({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }),
  itemName: Joi.string(),
};

const SalesForecastService = {
  getForecast,
};

decorate(SalesForecastService, 'SalesForecastService');

export default SalesForecastService;
