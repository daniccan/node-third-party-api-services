const axios = require("axios");
const async = require("async");
const logger = require("../utils/logger");

let FreshworksCommon = {
  retryFunc: async (apiMethod, ...args) => {
    return await async.retry(
      {
        times: 3,
        interval: 60000,
        errorFilter: function (err) {
          if (err.response) {
            logger.info(`Retrying after: ${err.response.headers["retry-after"]} seconds`);
            this.intervalFunc = () => {
              return (+err.response.headers["retry-after"] + 1) * 1000;
            };
            return err.response.status === 429;
          }
        },
      },
      (callback) => {
        return apiMethod(callback, ...args);
      }
    );
  },

  callPostApiUsingAxios: async (url, data, headers) => {
    let response = await axios({
      method: "post",
      url,
      data,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers,
    });
    return response;
  },

  callGetApiUsingAxios: async (url, headers) => {
    let response = await axios.get(url, headers);
    return response;
  }
}

module.exports = FreshworksCommon;