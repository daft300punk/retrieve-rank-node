import WeatherDataService from '../services/WeatherDataService';

const getGeocodeFromReq = req => ({
  latitude: req.params.latitude,
  longitude: req.params.longitude,
});

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
