import SalesForecastService from '../services/SalesForecastService';

import locations from '../../config/dummyDataConfig/location';

/**
 * Path - /salesForecast/:locationName/:itemName
 *
 * Sends the forecast sales for the next 10 days. The forecast sales
 * is an array containing individual sales object for the 10days.
 *
 * The locationName should uniquely identify one from the dummyLocations
 * array inside config/dummyDataConfig/location.js.
 */
async function getSalesForecast(req, res) {
  try {
    const itemName = req.params.itemName;
    const locationName = req.params.locationName;

    const location = locations.dummyLocations.filter((item) => {
      if (item.name === locationName) return true;
      return false;
    });

    // location array now only has one element after filtering.
    const geocode = location[0].geocode;

    const salesForecast = await SalesForecastService.getForecast(geocode, itemName);
    res.json(salesForecast);
  } catch (e) {
    res.status(520).send('Error retrieving sales forecast.');
  }
}

export default {
  getSalesForecast,
};
