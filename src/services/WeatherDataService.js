import decorate from 'decorate-it';
import Joi from 'joi';
import fetch from 'isomorphic-fetch';
import buildWeatherUrl from '../util/buildWeatherUrl';

function getWeatherData(geocode, timeInterval, timePeriod) {
  const url = buildWeatherUrl(geocode, timeInterval, timePeriod);
  return fetch(url);
}

getWeatherData.params = ['geocode', 'timeInterval', 'timePeriod'];
getWeatherData.schema = {
  geocode: Joi.object().keys({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }),
  timeInterval: Joi.string(),
  timePeriod: Joi.string(),
};

const WeatherCompanyDataService = {
  getWeatherData,
};

decorate(WeatherCompanyDataService, 'WeatherCompanyDataService');

export default WeatherCompanyDataService;
