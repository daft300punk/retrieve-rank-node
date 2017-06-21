/**
 * Contains all application endpoints
 */
import WeatherDataController from './controllers/WeatherDataController';

export default {
  '/weatherData/:latitude/:longitude/:timeInterval/:timePeriod': {
    get: {
      method: WeatherDataController.weatherCompanyData,
      public: true,
    },
  },
};
