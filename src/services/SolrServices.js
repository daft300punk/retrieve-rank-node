import decorate from 'decorate-it';
import Joi from 'joi';
import path from 'path';
import MockSalesDataService from './MockSalesDataService';

const watson = require('watson-developer-cloud');


const retrieveAndRank = watson.retrieve_and_rank({
  username: process.env.RR_UNAME,
  password: process.env.RR_PASSWORD,
  version: 'v1',
});

function listAvailableClusters() {
  return new Promise((resolve, reject) => {
    retrieveAndRank.listClusters({}, (err, res) => {
      if (err) { reject(err); }
      resolve(res);
    });
  });
}

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

function searchCollection(id, queryObject) {
  return new Promise((resolve, reject) => {
    const params = {
      cluster_id: id,
      collection_name: 'solr_collection',
      wt: 'json',
    };

    const solrClient = retrieveAndRank.createSolrClient(params);
    const query = solrClient.createQuery();
    query.q(queryObject);

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

searchCollection.params = ['id', 'queryObject'];
searchCollection.schema = {
  id: Joi.string(),
  queryObject: Joi.object(),
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

