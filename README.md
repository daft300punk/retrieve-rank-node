## Description
Based on bluemix starter nodejs kit here - <a href="https://github.com/topcoderinc/Topcoder-StarterPack_BluemixNode">https://github.com/topcoderinc/Topcoder-StarterPack_BluemixNode</a>.
Read more about setup and configuration in SETUP.md. Take careful note of environment variables needed, especially the SOLR_CLUSTER_ID, which you get only after you create a solr cluster.

## Video

## Live Bluemix deploy

## Endpoints
Note: All end points are mounted on ```'/api'```.
#### Related to weather
- ```/weatherForecast/:latitude/:longitude/:timeInterval/:timePeriod```<br>
Get weather forecast. Provide latitude and logitude. Time interval can take values like 'daily', 'hourly' etc. Time period can take values like '1day', '3day' etc. See IBM docs for exhaustive list.
- ```/weatherAlerts/:latitude/:longitude```<br>
Get weather alerts. You might not see much, since the weather needs to be bad enough to have alerts.
- ```/weatherHistory/:latitude/:longitude/:startDate/:endDate'```<br>
Get almanac history for place with provide latitude, longitude. dates should be in format MMDD. No year is allowed, since almanac data is average taken over large duration(30 years).
- ```/location/:latitude/:longitude```<br>
Get location info for provided latitude, longitude. Ex - cityname, weather station etc.

#### Related to generating mock sales data
- ```/mockData```<br>
Get mock sales data, generated following configuration inside ```./config/dummyDataConfig/```. 

#### Related to Retrieve&Rank
- ```/solr/availableClusters```<br>
Retrieve a list of available solr clusters. Note the cluster_id of cluster you want to work with and configure environment variable(see setup.md). If starting for the first time, you first need to create a cluster.
- ```/solr/createCluster```<br>
Create a solr cluster. Note the cluster_id, and put it inside environment variable(See setup.md). A new cluster is unavailable by default(it's status). You can check the status by checking available clusters. See status field. When the cluster is ready for interaction, you should see status READY.
- ```/solr/deleteCluster?clusterId=id```<br>
Delete a solr cluster. Provide clusterId in query. Helpful during development, when schema,data keeps changing. Maybe, disable this in production.
- ```/solr/uploadSolrConfig/:clusterId```<br>
Once you create a solr cluster, you need to provide solr config. The config is present inside ```./config/solr-config.zip```. Update schema if you want to change the shape of indexed documents. Mostly you will need to work with ```schema.xml```. This requires the knowledge of configuring solr schema.
- ```/solr/deleteSolrConfig/:clusterId```<br>
Delete solr config. Helpfule in development. Maybe, remove in prod.
- ```/solr/createSolrCollection/:clusterId```<br>
Once you upload the solr config successfully, you need to create a collection you can upload your data for indexing. Provide the clusterId of cluster you want to work with. This creates a collection by the name 'solr_collection'.
- ```/solr/deleteSolrCollection/:clusterId```<br>
Delete a solr collection. Helpfule in dev.
- ```/solr/uploadSalesData/:clusterId```<br>
Once you create a solr collection. You can upload your sales data. Your data should conform to the schema we configured earlier. On successful upload, we can start querying our collection for results.
- ```/solr/querySolr/:clusterId?*=*```<br>
Query our solr collection we uploaded data to. See query url creation for more info on how to query solr collection using json. The above query gets all documents in our collection. Note, however, you will receive only 10 results, since solr will limit the number of rows in result to 10 by default.

#### Related to Getting Sales Forecast
- ```/salesForecast/:locationName/:itemName```<br>
Get sales forecast for the provided loactionName and itemName. Note the values should be from what we configured inside ```./config/dummyDataConfig/```.

## Configuring mock data
You can configure mock data inside ```./config/dummyDataConfig/```.

## Notes on mock sales data
Below is sample mock sales data.
``` javascript
{
  "id": "1",
  "date": "2017-01-01T00:00:00Z",
  "articleName": "Icecream",
  "location_coord": "37, -95",
  "location_name": "NewYork",
  "avg_tmp_lo": 33,
  "avg_tmp_hi": 63,
  "avg_tmp_mean": 48,
  "weather_severity": 0.6923,
  "avgSalesRate": "120",
  "salesToday": 114
}
```
- date is stored in a format suitable for solr.
- location_coord is stored in format suitable for solr.
- avgSalesRate is the configured value from config.
- salesToday is the value of sales today. It is generated using the weather severity.
- <strong>weather_severity is how severe the weather is going to be today. 1 being the most severe, 0 least. To see how severity is calculated, see ```calculateSeverity``` method in ```SalesForecastService.js```. I have defined severity range [0, 0.2] to be better than average day, [0.2, 0.5] average, [0.5, 0.7] bad, [0.7, 1] very bad. In the above case, severity is .69, which means weather is bad, this is shown in salesToday with a value 114, lesser than averageSaleRate. To make better predictions, what we need to do is better refine this value of severity, taking into account more factors than temperature, as I have done.</strong>

## Notes on forecast sales
Below is a sample forecast sales object for Icecream in NewYork- 
``` javascript
{
  "weather_severity": "0.3750",
  "predicted_sales": 125,
  "mean_temp_today": 73,
  "avg_temp_history": 79
}
```
- See the value of weather_severity. It is in the range [.2, .5], thus average weather. This is shown in the value of predicted_sales(125) i.e greater than 120(avgSalesRate).
- The closer the values mean_temp_today and avg_temp_history, the lesser will be severity.
- <strong>How does forecast work?</strong><br>
Currently, I retrieve weather forecast coming 10 days. You can't get weather forecast for more than 10 days. We calculate ```weather_severity```, using the method mentioned above. The we retreve the document which has weather severity closest to this one in our solr collection. We use the sales value of that document as the predicted_sales. This is the method mentioned in competition description.

## Notes on improving sales forecast
Sales forecast depends on ```weather_severity```. We need to define this in a better way to improve sales forecast. Currently I'm only using temperature values for defining severity. But we could use other parameters as well. I think we can use, Machine Learning service from Bluemix to better define ```weather_severity```, taking into account various factors it could depend on.

## Notes on querying solr cluster
- You need to understand how querying works in solr using json through urls.
- ```/solr/querySolr/:clusterId?*=*``` will retrieve all docs in collection.
- ```/solr/querySolr/:clusterId?id=1``` will retrieve doc with id 1.
- You will need to refer solr docs for forming more complex queries.

