import WeatherCompanyService from '../services/WeatherCompanyService';

async function weatherCompanyData(req, res) {
  const geocode = {
    latitude: req.params.latitude,
    longitude: req.params.longitude,
  };
  const timeInterval = req.params.timeInterval;
  const timePeriod = req.params.timePeriod;

  try {
    let result = await WeatherCompanyService
      .getWeatherData(geocode, timeInterval, timePeriod);
    result = await result.json();
    res.json(result);
  } catch (e) {
    res.status(520).send(e);
  }
}

export default {
  weatherCompanyData,
};
