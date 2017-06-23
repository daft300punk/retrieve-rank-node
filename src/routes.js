/**
 * Contains all application endpoints
 */
import WeatherDataController from './controllers/WeatherDataController';
import MockSalesController from './controllers/MockDataController';

export default {
  '/weatherForecast/:latitude/:longitude/:timeInterval/:timePeriod': {
    get: {
      method: WeatherDataController.weatherForecast,
      public: true,
    },
  },
  '/weatherAlerts/:latitude/:longitude': {
    get: {
      method: WeatherDataController.alerts,
      public: true,
    },
  },
  '/weatherHistory/:latitude/:longitude/:startDate/:endDate': {
    get: {
      method: WeatherDataController.weatherHistory,
      public: true,
    },
  },
  '/location/:latitude/:longitude': {
    get: {
      method: WeatherDataController.getLocation,
      public: true,
    },
  },
  '/mockData': {
    get: {
      method: MockSalesController.getMockSales,
      public: true,
    },
  },
};
