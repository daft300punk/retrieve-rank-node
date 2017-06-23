import MockSalesDataService from '../services/MockSalesDataService';

async function getMockSales(req, res) {
  try {
    const data = await MockSalesDataService.generateSalesData();
    res.json(data);
  } catch (e) {
    res.status(520).send(e);
  }
}

export default {
  getMockSales,
};
