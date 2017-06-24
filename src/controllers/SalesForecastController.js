import _ from 'lodash';
import SalesForecastService from '../services/SalesForecastService';

import locations from '../../config/dummyDataConfig/location';

async function getSalesForecast(req, res) {
  const itemName = req.params.itemName;
  const locationName = req.params.locationName;

  const location = locations.dummyLocations.filter((item) => {
    if (item.name === locationName) return true;
    return false;
  });
  const geocode = location[0].geocode;

  const salesForecast = await SalesForecastService.getForecast(geocode, itemName);
  res.json(salesForecast);
}

export default {
  getSalesForecast,
};
