import _ from 'lodash';
import moment from 'moment';
import decorate from 'decorate-it';
import Joi from 'joi';
import WeatherDataService from './WeatherDataService';
import SolrServices from './SolrServices';

function calculateSeverity(meanTempToday, meanTempAvg, hi, lo) {
  const range = Math.max(Math.abs((hi - meanTempAvg) / 2), Math.abs((lo - meanTempAvg) / 2));
  const severity = (meanTempToday - meanTempAvg) / range;
  return Math.abs(severity);
}

async function getForecast(geocode, itemName) {
  try {
    const startDate = moment().add(1, 'day').format('MMDD');
    const endDate = moment().add(10, 'day').format('MMDD');

    let weatherHistory = await WeatherDataService
      .getWeatherHistory(geocode, { startDate, endDate });
    weatherHistory = await weatherHistory.json();
    const almanac_summaries = weatherHistory.almanac_summaries;

    let weatherForecast = await WeatherDataService
      .getWeatherForecast(geocode, 'daily', '10day');
    weatherForecast = await weatherForecast.json();

    const forecasts = weatherForecast.forecasts;
    forecasts.shift();

    const severityArray = [];
    const resultPromise = [];

    _.forEach(forecasts, (forecast, index) => {
      const meanTempToday = (forecast.day.temp + forecast.night.temp) / 2;
      const severity = calculateSeverity(
        meanTempToday,
        almanac_summaries[index].mean_temp,
        almanac_summaries[index].record_hi,
        almanac_summaries[index].record_lo,
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

    let result = await Promise.all(resultPromise);
    result = result.map((item, index) => {
      const mean_temp_today = 
        (forecasts[index].day.temp + forecasts[index].night.temp) / 2;
      const avg_temp_history = almanac_summaries[index].mean_temp;
      return {
        weather_severity: severityArray[index],
        predicted_sales: item.response.docs[0].salesToday,
        mean_temp_today,
        avg_temp_history,
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
