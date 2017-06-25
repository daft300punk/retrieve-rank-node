## Tested on
- node v7.10.0
- npm 5.0.3
- Windows 10 machine

## Configuration
This info is from the starter kit.

|Name|Description|
|----|-----------|
|`PORT`| The port to listen|
|`VERBOSE_LOGGING`| The flag if debug logging in enabled|


## Local deployment

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Serves the app in prod mode. It will override config with `config/production.js`|
|`dev`|Same as `npm start`, but enables nodemon for the server as well.|
|`lint`|Lint all `.js` files.|
|`lint:fix`|Lint and fix all `.js` files. [Read more on this](http://eslint.org/docs/user-guide/command-line-interface.html#fix).|
|`spec`|Run unit tests|
|`spec:watch`|Run unit tests in watch mode|
|`e2e`|Run e2e tests|
|`e2e:watch`|Run e2e tests in watch mode|
|`coverage`|Run unit tests and verify coverage|
|`check-coverage`|Verify coverage only|
|`test`|Run lint, tests and checks coverage|


## Bluemix deployment
1. go to https://console.eu-gb.bluemix.net
2. click *Create app*
3. pick *SDK for Node.js*
4. pick any free *App name* and click *Create*
5. Click on the app and go to tab *Getting started*
6. (optional) Copy manifest.yml from *DOWNLOAD STARTER CODE* to the application directory
7. Complete steps 2-7 for deployment
8. if you copied `manifest.yml` you can just run `cf push` for redeployment


## Environment Variables
Take a look at the .env file. The content of my .env files are
- UNAME="600ecc2e-c83d-4b43-bc32-1e2c40d4522a"
- PASSWORD="apNyvc3ONV"
- HOST="twcservice.eu-gb.mybluemix.net"
- PORT_WS=443
- URL="https://600ecc2e-c83d-4b43-bc32-1e2c40d4522a:apNyvc3ONV@twcservice.eu-gb.mybluemix.net"
- RR_UNAME="82d2aeda-cf69-4d3a-b200-7d77b0ad9ca7"
- RR_PASSWORD="LTRmtRmtAZCB"
- SOLR_CLUSTER_ID="sc9094fd8d_d877_4017_81f5_0b212af2d3ff"

<strong>Note:</strong> You can test using the above env config. You will get the first 5 fields, till
URL after creating Weather Company Data service in IBM Bluemix. The next two,
you will get after creating Retrieve and Rank service in IBM Bluemix. The last
is solr cluster id. You need to input the cluster id of your solr instance here.
That is you will first need to create a solr cluster, and then update this variable here.

## Notes on setting up solr instance in Retrieve and Rank