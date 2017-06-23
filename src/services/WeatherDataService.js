import decorate from 'decorate-it';
import Joi from 'joi';
import fetch from 'isomorphic-fetch';

const hostname = `https://${process.env.UNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/api/weather`;

function buildGeocodeString(geocode) {
  return `geocode/${geocode.latitude}/${geocode.longitude}`;
}

function getWeatherForecast(geocode, timeInterval, timePeriod) {
  const geocodeString = buildGeocodeString(geocode);
  const url = `${hostname}/v1/${geocodeString}/forecast/${timeInterval}/${timePeriod}.json`;
  return fetch(url);
}

function getAlerts(geocode) {
  const geocodeString = buildGeocodeString(geocode);
  const url = `${hostname}/v1/${geocodeString}/alerts.json`;
  return fetch(url);
}

function getWeatherHistory(geocode, { startDate, endDate }) {
  const geocodeString = buildGeocodeString(geocode);
  const url = `${hostname}/v1/${geocodeString}/almanac/daily.json?units=e&start=${startDate}&end=${endDate}`;
  return fetch(url);
}

function getLocation(geocode) {
  const url = `${hostname}/v3/location/point?geocode=${geocode.latitude}%2c${geocode.longitude}&language=en-US`;
  return fetch(url);
}

getWeatherForecast.params = ['geocode', 'timeInterval', 'timePeriod'];
getWeatherForecast.schema = {
  geocode: Joi.object().keys({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }),
  timeInterval: Joi.string(),
  timePeriod: Joi.string(),
};

getAlerts.params = ['geocode'];
getAlerts.schema = {
  geocode: Joi.object().keys({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }),
};

getWeatherHistory.params = ['geocode', 'timePeriod'];
getWeatherHistory.schema = {
  geocode: Joi.object().keys({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }),
  timePeriod: Joi.object().keys({
    startDate: Joi.string(),
    endDate: Joi.string(),
  }),
};

getLocation.params = ['geocode'];
getLocation.schema = {
  geocode: Joi.object().keys({
    latitude: Joi.string(),
    longitude: Joi.string(),
  }),
};

const WeatherCompanyDataService = {
  getWeatherForecast,
  getAlerts,
  getWeatherHistory,
  getLocation,
};

decorate(WeatherCompanyDataService, 'WeatherCompanyDataService');

export default WeatherCompanyDataService;
