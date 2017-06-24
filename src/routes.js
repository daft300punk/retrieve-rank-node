/**
 * Contains all application endpoints
 */
import WeatherDataController from './controllers/WeatherDataController';
import MockSalesController from './controllers/MockDataController';
import SolrController from './controllers/SolrController';

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
  '/solr/availableClusters': {
    get: {
      method: SolrController.getAvailableClusters,
      public: true,
    },
  },
  '/solr/uploadData': {
    get: {
      method: SolrController.uploadData,
      public: true,
    },
  },
  '/solr/uploadSolrConfig/:clusterId': {
    get: {
      method: SolrController.uploadSolrConfig,
      public: true,
    },
  },
  '/solr/deleteSolrConfig/:clusterId': {
    get: {
      method: SolrController.deleteSolrConfig,
      public: true,
    },
  },
  '/solr/createSolrCollection/:clusterId': {
    get: {
      method: SolrController.createSolrCollection,
      public: true,
    },
  },
  '/solr/deleteSolrCollection/:clusterId': {
    get: {
      method: SolrController.deleteSolrCollection,
      public: true,
    },
  },
  '/solr/uploadSalesData/:clusterId': {
    get: {
      method: SolrController.uploadSalesData,
      public: true,
    },
  },
  '/solr/querySolr/:clusterId': {
    get: {
      method: SolrController.querySolr,
      public: true,
    },
  },
};
