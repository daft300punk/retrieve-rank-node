import WeatherDataService from '../services/WeatherDataService';

const getGeocodeFromReq = req => ({
  latitude: req.params.latitude,
  longitude: req.params.longitude,
});

/**
 * Path - /weatherForecast/:latitude/:longitude/:timeInterval/:timePeriod
 *
 * Provide latitude and longitude without south, north etc. Should be numbers
 * with sign.
 *
 * Get weather forecast.
 * TimeInterval can be hourly, daily etc. See docs.
 * TimePeriod can be 1day 3day etc. See docs.
 */
async function weatherForecast(req, res) {
  const geocode = getGeocodeFromReq(req);
  const timeInterval = req.params.timeInterval;
  const timePeriod = req.params.timePeriod;

  try {
    let result = await WeatherDataService
      .getWeatherForecast(geocode, timeInterval, timePeriod);
    result = await result.json();
    res.json(result);
  } catch (e) {
    res.status(520).send(e);
  }
}

/**
 * Path - /weatherAlerts/:latitude/:longitude
 *
 * Get weather alerts.
 * Most of the time this should not return much info. Since, not all
 * place will have weather conditions bad enough to have alerts.
 */
async function alerts(req, res) {
  const geocode = getGeocodeFromReq(req);
  try {
    let result = await WeatherDataService
      .getAlerts(geocode);
    result = await result.json();
    res.json(result);
  } catch (e) {
    res.status(520).send(e);
  }
}

/**
 * Path - /weatherHistory/:latitude/:longitude/:startDate/:endDate
 *
 * startDate - MMDD
 * endDate - MMDD
 *
 * Get past almanac info for a location. It is nothing but average
 * weather parameters measured over long duration (30 years mostly).
 */
async function weatherHistory(req, res) {
  const geocode = getGeocodeFromReq(req);
  const timePeriod = {
    startDate: req.params.startDate,
    endDate: req.params.endDate,
  };
  try {
    let result = await WeatherDataService
      .getWeatherHistory(geocode, timePeriod);
    result = await result.json();
    res.json(result);
  } catch (e) {
    res.status(520).send(e);
  }
}

/**
 * Path - /location/:latitude/:longitude
 *
 * Might be useful if you want to know more about the providing
 * latitude and longitude values.
 */
async function getLocation(req, res) {
  const geocode = getGeocodeFromReq(req);
  try {
    let result = await WeatherDataService
      .getLocation(geocode);
    result = await result.json();
    res.json(result);
  } catch (e) {
    res.status(520).send(e);
  }
}

export default {
  weatherForecast,
  alerts,
  weatherHistory,
  getLocation,
};
