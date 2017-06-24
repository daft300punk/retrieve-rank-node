import MockSalesDataService from '../services/MockSalesDataService';

/**
 * Path - /mockData
 *
 * Sends the json of randomly generated sales data.
 */
async function getMockSales(req, res) {
  try {
    const data = await MockSalesDataService.generateSalesData();
    res.json(data);
  } catch (e) {
    res.status(520).send('Error generating mock sales data.');
  }
}

export default {
  getMockSales,
};
