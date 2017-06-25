import decorate from 'decorate-it';
import Joi from 'joi';
import path from 'path';
import _ from 'lodash';
import MockSalesDataService from './MockSalesDataService';

const watson = require('watson-developer-cloud');

// Set theses environment variables. You get theses config info from
// bluemix console, after you create these services.
const retrieveAndRank = watson.retrieve_and_rank({
  username: process.env.RR_UNAME,
  password: process.env.RR_PASSWORD,
  version: 'v1',
});

/**
 * List available clusters. Useful for knowing the status of cluster, or
 * finding cluster id.
 *
 * @returns {Promise} that resolves with available cluster info.
 */
function listAvailableClusters() {
  return new Promise((resolve, reject) => {
    retrieveAndRank.listClusters({}, (err, res) => {
      if (err) { reject(err); }
      resolve(res);
    });
  });
}

/**
 * Create a cluster with provided name and size. For free accounts you can only
 * create 1 cluster, without any size, i.e dont provide size value(empty string).
 * See docs for more on sizing clusters.
 *
 * @param {String}
 * @param {String}
 * @returns {Promise}
 */
function createCluster(size, name) {
  return new Promise((resolve, reject) => {
    retrieveAndRank.createCluster({
      cluster_size: size,
      cluster_name: name,
    }, (err, response) => {
      if (err) { reject(err); }
      resolve(response);
    });
  });
}

/**
 * Delete a cluster. Is useful in development, when data/schema is changing
 * constantly.
 *
 * @param {String} id cluster_id
 * @returns {Promise}
 */
function deleteCluster(id) {
  return new Promise((resolve, reject) => {
    retrieveAndRank.deleteCluster({
      cluster_id: id,
    }, (err, res) => {
      if (err) { reject(err); }
      resolve(res);
    });
  });
}

/**
 * Upload solr config zip file. Note the directory in which zip file is stored.
 * The zip file contains a schema and some other files. You might only need to
 * change schema file. Update schema when you update the shape of sales data
 * you upload on R&R service.
 *
 * @param {String} id cluster id.
 * @returns {Promise}
 */
function uploadSolrConfig(id) {
  return new Promise((resolve, reject) => {
    const params = {
      cluster_id: id,
      config_name: 'solr-config',
      config_zip_path: path.join(__dirname, '../../config/solr-config.zip'),
    };

    retrieveAndRank.uploadConfig(params, (err, res) => {
      if (err) { reject(err); }
      resolve(res);
    });
  });
}

/**
 * Delete solr config. Useful in development, when data/schema is changing.
 *
 * @param {String} id cluster id
 * @returns {Promise}
 */
function deleteSolrConfig(id) {
  return new Promise((resolve, reject) => {
    const params = {
      cluster_id: id,
      config_name: 'solr-config',
    };
    retrieveAndRank.deleteConfig(params,
      (err, res) => {
        if (err) { reject(err); }
        resolve(res);
      });
  });
}

/**
 * Create a solr collection in a cluster identified by the id provided. Before
 * you start indexing the your sales data, you need a collection. Note, you
 * can also dynamically provide collection_name. Since free accounts only allow
 * for 1 collection/cluster, I hard code collection name. Make necessary small
 * changes in routes to receive variable collection_name.
 *
 * @param {String} id cluster id
 * @returns {Promise}
 */
function createSolrCollection(id) {
  return new Promise((resolve, reject) => {
    const params = {
      cluster_id: id,
      config_name: 'solr-config',
      collection_name: 'solr_collection',
      wt: 'json',
    };
    retrieveAndRank.createCollection(params, (err, res) => {
      if (err) { reject(err); }
      resolve(res);
    });
  });
}

/**
 * Delete a solr collection in a cluster identified by provided id.
 * Again you can dynamically provide collection name, like just above.
 *
 * @param {String} id cluster id.
 * @returns {Promise}
 */
function deleteSolrCollection(id) {
  return new Promise((resolve, reject) => {
    const params = {
      cluster_id: id,
      collection_name: 'solr_collection',
      wt: 'json',
    };
    retrieveAndRank.deleteCollection(params, (err, response) => {
      if (err) { reject(err); }
      resolve(response);
    });
  });
}

/**
 * Upload the sales data for indexing. Again, like above you can provide dynamic
 * collection_name.
 * This first waits for generation of mock sales data using MockSalesDataService.
 * Then it sends the received json for indexing.
 *
 * If you want to dynamically upload sales data, this is the place to make relevant
 * changes.
 *
 * @param {String} id cluster id
 * @returns {Promise}
 */
async function uploadSalesData(id) {
  let data;
  try {
    data = await MockSalesDataService.generateSalesData();
  } catch (e) {
    throw e;
  }
  return new Promise((resolve, reject) => {
    const params = {
      cluster_id: id,
      collection_name: 'solr_collection',
    };

    const solrClient = retrieveAndRank.createSolrClient(params);
    solrClient.add(data, (err, response) => {
      if (err) { reject(err); }
      solrClient.commit((err2) => {
        if (err) { reject(err2); }
        resolve(`${response}. Successfully committed.`);
      });
    });
  });
}

/**
 * Call this service to query our solr collection. id is the cluster id of
 * specific solr cluster.
 *
 * queryObject should contain necessary fields for querying. See how querying
 * works in solr using json. In short, an object { id: '1' } will search in
 * id field for a value 1.
 *
 * sortObject should contain sorting parameters. Provide an empty object if you
 * dont want sorting of returned query result. Ex. if you want to sort the query
 * result in ascending order of field weather_severity, provide an object of the
 * form { weather_severity: 'asc' }. See how sorting works in solr using json
 * queries.
 *
 * @param {String} id
 * @param {Object} queryObject
 * @param {Object} sortObject
 * @param {number} [rows=10]
 * @returns {Promise}
 */
function searchCollection(id, queryObject, sortObject, rows = 10) {
  return new Promise((resolve, reject) => {
    const params = {
      cluster_id: id,
      collection_name: 'solr_collection',
      wt: 'json',
    };

    const solrClient = retrieveAndRank.createSolrClient(params);
    const query = solrClient.createQuery();
    query.q(queryObject);
    if (!_.isEmpty(sortObject)) { query.sort(sortObject); }
    query.rows(rows);

    solrClient.search(query, (err, searchResponse) => {
      if (err) { reject(err); }
      resolve(searchResponse);
    });
  });
}

listAvailableClusters.params = [];
listAvailableClusters.schema = {};

createCluster.params = ['size', 'name'];
createCluster.schema = {
  size: Joi.string().allow(''),
  name: Joi.string(),
};

deleteCluster.params = ['id'];
deleteCluster.schema = {
  id: Joi.string(),
};

createSolrCollection.params = ['id'];
createSolrCollection.schema = {
  id: Joi.string(),
};

deleteSolrCollection.params = ['id'];
deleteSolrCollection.schema = {
  id: Joi.string(),
};

deleteSolrConfig.params = ['id'];
deleteSolrConfig.schema = {
  id: Joi.string(),
};

uploadSolrConfig.params = ['id'];
uploadSolrConfig.schema = {
  id: Joi.string(),
};

uploadSalesData.params = ['id'];
uploadSalesData.schema = {
  id: Joi.string(),
};

searchCollection.params = ['id', 'queryObject', 'sortObject', 'rows'];
searchCollection.schema = {
  id: Joi.string(),
  queryObject: Joi.object(),
  sortObject: Joi.object(),
  rows: Joi.number(),
};

const SolrServices = {
  listAvailableClusters,
  deleteCluster,
  createCluster,
  createSolrCollection,
  deleteSolrCollection,
  uploadSolrConfig,
  deleteSolrConfig,
  uploadSalesData,
  searchCollection,
};

decorate(SolrServices, 'SolrServices');

export default SolrServices;

