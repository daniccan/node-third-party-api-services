let freshserviceCommon = require("./freshservice_common");
let freshworksCommon = require("../freshworks_common");
const logger = require("../../utils/logger");

const MAX_RECORDS = 100;

let FsAssetsService = {
  getAssets: async (fsSubDomain, fsApiKey) => {
    let results = [];
    let pageNo = 1;
    let resultsInPage = await FsAssetsService.getAssetsByPageNo(pageNo, fsSubDomain, fsApiKey);
    results = results.concat(resultsInPage);
    while (resultsInPage && resultsInPage.length == MAX_RECORDS) {
      resultsInPage = await FsAssetsService.getAssetsByPageNo(++pageNo, fsSubDomain, fsApiKey);
      results = results.concat(resultsInPage);
    }
    return results;
  },

  getAssetsByPageNo: async (pageNo, fsSubDomain, fsApiKey) => {
    const helperApi = async (callback) => {
      try {
        const requestUrl = `https://${fsSubDomain}.freshservice.com/api/v2/assets?per_page=${MAX_RECORDS}&page=${pageNo}`;
        const response = await freshworksCommon.callGetApiUsingAxios(requestUrl, freshserviceCommon.getHttpHeaders(fsApiKey));
        callback(null, response.data.assets);
      } catch (error) {
        const status = error.response ? error.response.status : 400;
        logger.error(`Unable to get Assets in FS: ${JSON.stringify(error)}`);
        callback(status === 429 ? error : null, null);
      }
    };
    return freshworksCommon.retryFunc(helperApi);
  },

  getAssetTypes: async (fsSubDomain, fsApiKey) => {
    let results = [];
    let pageNo = 1;
    let resultsInPage = await FsAssetsService.getAssetTypesByPageNo(pageNo, fsSubDomain, fsApiKey);
    results = results.concat(resultsInPage);
    while (resultsInPage && resultsInPage.length == MAX_RECORDS) {
      resultsInPage = await FsAssetsService.getAssetTypesByPageNo(++pageNo, fsSubDomain, fsApiKey);
      results = results.concat(resultsInPage);
    }
    return results;
  },

  getAssetTypesByPageNo: async (pageNo, fsSubDomain, fsApiKey) => {
    const helperApi = async (callback) => {
      try {
        const requestUrl = `https://${fsSubDomain}.freshservice.com/api/v2/asset_types?per_page=${MAX_RECORDS}&page=${pageNo}`;
        const response = await freshworksCommon.callGetApiUsingAxios(requestUrl, freshserviceCommon.getHttpHeaders(fsApiKey));
        callback(null, response.data.asset_types);
      } catch (error) {
        const status = error.response ? error.response.status : 400;
        logger.error(`Unable to get Asset Types in FS: ${JSON.stringify(error)}`);
        callback(status === 429 ? error : null, null);
      }
    };
    return freshworksCommon.retryFunc(helperApi);
  },

  getAssetTypeFields: async (assetTypeId, fsSubDomain, fsApiKey) => {
    const helperApi = async (callback) => {
      try {
        const requestUrl = `https://${fsSubDomain}.freshservice.com/api/v2/asset_types/${assetTypeId}/fields`;
        const response = await freshworksCommon.callGetApiUsingAxios(requestUrl, freshserviceCommon.getHttpHeaders(fsApiKey));
        callback(null, response.data.asset_type_fields);
      } catch (error) {
        const status = error.response ? error.response.status : 400;
        logger.error(`Unable to get Asset Type Fields in FS: ${JSON.stringify(error)}`);
        callback(status === 429 ? error : null, null);
      }
    };
    return freshworksCommon.retryFunc(helperApi);
  },
}

module.exports = FsAssetsService;
require('make-runnable');
