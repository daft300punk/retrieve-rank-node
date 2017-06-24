import SolrServices from '../services/SolrServices';

async function getAvailableClusters(req, res) {
  try {
    const availableClusters = await SolrServices.listAvailableClusters();
    res.json(availableClusters);
  } catch (e) {
    res.status(520).send('Error retrieving clusters');
  }
}

async function uploadData(req, res) {
  try {
    const message = await SolrServices.uploadData();
    res.json(message);
  } catch (e) {
    res.status(520).send('Error uploading data');
  }
}

async function uploadSolrConfig(req, res) {
  try {
    const message = await SolrServices.uploadSolrConfig(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send(`Error uploading config: ${e}`);
  }
}

async function deleteSolrConfig(req, res) {
  try {
    const message = await SolrServices.deleteSolrConfig(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send(`Error uploading config: ${e}`);
  }
}

async function createSolrCollection(req, res) {
  try {
    const message = await SolrServices.createSolrCollection(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send(`Error creating collection: ${e}`);
  }
}

async function deleteSolrCollection(req, res) {
  try {
    const message = await SolrServices.deleteSolrCollection(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send(`Error delete collection: ${JSON.stringify(e)}`);
  }
}

async function uploadSalesData(req, res) {
  try {
    const message = await SolrServices.uploadSalesData(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send(`Error uploading sales data: ${e}`);
  }
}

async function querySolr(req, res) {
  try {
    const result = await SolrServices.searchCollection(req.params.clusterId, req.query);
    res.json(result);
  } catch (e) {
    res.status(520).send(`Error querying: ${JSON.stringify(e)}`);
  }
}

export default {
  getAvailableClusters,
  uploadData,
  uploadSolrConfig,
  deleteSolrConfig,
  createSolrCollection,
  deleteSolrCollection,
  uploadSalesData,
  querySolr,
};
