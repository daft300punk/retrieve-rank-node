import SolrServices from '../services/SolrServices';

/**
 * Path - /solr/availableClusters
 *
 * Sends json of available clusters.
 *
 * Note solr_cluster_id. You will require this to set environment variable.
 * To have anything show here, you first need to create solr cluster.
 * Note the status off solr_cluster_status field. Before proceding make sure
 * the value shows READY.
 */
async function getAvailableClusters(req, res) {
  try {
    const availableClusters = await SolrServices.listAvailableClusters();
    res.json(availableClusters);
  } catch (e) {
    res.status(520).send('Error retrieving clusters');
  }
}
/**
 * Path - /solr/createCluster?size=size
 *
 * For free accounts don't provide size. Refer to sizing clusters in
 * Retrieve and Rank Docs.
 */
async function createCluster(req, res) {
  try {
    const clusterName = req.query.name;
    const clusterSize = req.query.size || '';

    const message = await SolrServices.createCluster(clusterSize, clusterName);
    res.json(message);
  } catch (e) {
    res.status(520).send('Error uploading config');
  }
}
/**
 * Path - /solr/deleteCluster?cluster_id=id
 *
 * Delete a cluster providing its id in query.
 */
async function deleteCluster(req, res) {
  try {
    const clusterId = req.query.cluster_id;
    const message = await SolrServices.deleteCluster(clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send('Error deleting cluster.');
  }
}

/**
 * Path - /solr/uploadSolrConfig/:clusterId
 *
 * Upload the solr config zip. Place the zip file in config directory
 * inside root project directory, as has been done currently.
 */
async function uploadSolrConfig(req, res) {
  try {
    const message = await SolrServices.uploadSolrConfig(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send('Error uploading config.');
  }
}

/**
 * Path - /solr/deleteSolrConfig/:clusterId
 *
 * Delete solr config for the cluster with clusterId in query.
 */
async function deleteSolrConfig(req, res) {
  try {
    const message = await SolrServices.deleteSolrConfig(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send('Error uploading config');
  }
}

/**
 * Path - /solr/createCollection/:clusterId
 *
 * Once you have a cluster ready. Make a collection inside the cluster.
 * This can take time. All errors related to improper solr config file
 * will show up here, if there are any.
 *
 * Note: Currently, I don't give the option of choosing collection name,
 * since the free account can only have one collection. But, just passing
 * a name param in the route, and making small change in service will do that.
 */
async function createSolrCollection(req, res) {
  try {
    const message = await SolrServices.createSolrCollection(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send('Error creating collection');
  }
}

/**
 * Path - /solr/createCollection/:clusterId
 *
 * Delete a solr collection with id in url param;
 *
 * Note: Currently, I don't give the option of choosing collection name,
 * since the free account can only have one collection. But, just passing
 * a name param in the route, and making small change in service will do that.
 */
async function deleteSolrCollection(req, res) {
  try {
    const message = await SolrServices.deleteSolrCollection(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send('Error deleting collection.');
  }
}

/**
 * Path - /solr/uploadSalesData/:clusterId
 *
 * Uploads the mock generated sales data for configured parameters inside
 * config/dummyConfig.
 */
async function uploadSalesData(req, res) {
  try {
    const message = await SolrServices.uploadSalesData(req.params.clusterId);
    res.json(message);
  } catch (e) {
    res.status(520).send(`Error uploading sales data: ${e}`);
  }
}

/**
 * Path - /solr/querySolr/:clusterId?queryhere
 *
 * See how to write solr queries. This will query our solr instance,
 * and send back the results.
 */
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
  createCluster,
  deleteCluster,
  uploadSolrConfig,
  deleteSolrConfig,
  createSolrCollection,
  deleteSolrCollection,
  uploadSalesData,
  querySolr,
};
