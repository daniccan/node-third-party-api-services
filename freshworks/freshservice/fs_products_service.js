let freshserviceCommon = require("./freshservice_common");
let freshworksCommon = require("../freshworks_common");
const logger = require("../../utils/logger");

const MAX_RECORDS = 100;

let FsProductsService = {
  getProducts: async (fsSubDomain, fsApiKey) => {
    let results = [];
    let pageNo = 1;
    let resultsInPage = await FsProductsService.getProductsByPageNo(pageNo, fsSubDomain, fsApiKey);
    results = results.concat(resultsInPage);
    while (resultsInPage && resultsInPage.length == MAX_RECORDS) {
      resultsInPage = await FsProductsService.getProductsByPageNo(++pageNo, fsSubDomain, fsApiKey);
      results = results.concat(resultsInPage);
    }
    return results;
  },

  getProductsByPageNo: async (pageNo, fsSubDomain, fsApiKey) => {
    const helperApi = async (callback) => {
      try {
        const requestUrl = `https://${fsSubDomain}.freshservice.com/api/v2/products?per_page=${MAX_RECORDS}&page=${pageNo}`;
        const response = await freshworksCommon.callGetApiUsingAxios(requestUrl, freshserviceCommon.getHttpHeaders(fsApiKey));
        callback(null, response.data.products);
      } catch (error) {
        const status = error.response ? error.response.status : 400;
        logger.error(`Unable to get Products in FS: ${JSON.stringify(error)}`);
        callback(status === 429 ? error : null, null);
      }
    };
    return freshworksCommon.retryFunc(helperApi);
  },

  getProductByName: async function (productName, fsSubDomain, fsApiKey) {
    const helperApi = async (callback) => {
      try {
        const requestUrl = `https://${fsSubDomain}.freshservice.com/api/v2/products/search?q=${productName}`;
        const response = await freshworksCommon.callGetApiUsingAxios(requestUrl, freshserviceCommon.getHttpHeaders(fsApiKey));
        callback(null, response.data.products);
      } catch (error) {
        const status = error.response ? error.response.status : 400;
        logger.error(`Unable to get Product in FS: ${JSON.stringify(error)}`);
        callback(status === 429 ? error : null, null);
      }
    };
    return freshworksCommon.retryFunc(helperApi);
  },
}

module.exports = FsProductsService;
require('make-runnable');
