import decorate from 'decorate-it';
import Joi from 'joi';
import fetch from 'isomorphic-fetch';

const hostname = `https://${process.env.UNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT_WS}/api/weather`;

/**
 * Utility function to build geocde part of url.
 *
 * @param {Object} geocode
 * @returns {String} geocode part of url.
 */
function buildGeocodeString(geocode) {
  return `geocode/${geocode.latitude}/${geocode.longitude}`;
}

/**
 * Get weather forecast for provided geolocation.
 *
 * geocode is an object containing latitude and longitude keys.
 * timeInterval can take values like 'hourly', 'daily' etc. See IBM docs
 * for more.
 * timePeriod can take values like '3day', '7day', '10day' etc. See docs.
 *
 * @param {Object} geocode
 * @param {String} timeInterval
 * @param {String} timePeriod
 * @returns {Promise}
 */
function getWeatherForecast(geocode, timeInterval, timePeriod) {
  const geocodeString = buildGeocodeString(geocode);
  const url = `${hostname}/v1/${geocodeString}/forecast/${timeInterval}/${timePeriod}.json`;
  return fetch(url);
}

/**
 * Get weather alerts for the provided geoloaction. Note, most of the times you
 * wont see much here unless the weather is sever enough to have alerts.
 *
 * @param {Object} geocode
 * @returns {Promise}
 */
function getAlerts(geocode) {
  const geocodeString = buildGeocodeString(geocode);
  const url = `${hostname}/v1/${geocodeString}/alerts.json`;
  return fetch(url);
}

/**
 * Get almanac data for provided date ranges.
 *
 * dates should be in format MMDD. You cant provide year value.
 *
 * @param {Object} geocode
 * @param {Object} { startDate, endDate }
 * @returns {Promise}
 */
function getWeatherHistory(geocode, { startDate, endDate }) {
  const geocodeString = buildGeocodeString(geocode);
  const url = `${hostname}/v1/${geocodeString}/almanac/daily.json?units=e&start=${startDate}&end=${endDate}`;
  return fetch(url);
}

/**
 * Get information about a geolocation. This can be useful if you need to
 * find information(city name, weather station etc) given a geolocation.
 *
 * @param {Object} geocode
 * @returns {Promise}
 */
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
