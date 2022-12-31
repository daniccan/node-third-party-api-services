const btoa = require("btoa");

let FreshserviceCommon = {
  getHttpHeaders: (apiKey) => {
    return {
      headers: {
        Authorization: `Basic ${btoa(apiKey + ":X")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  },
}

module.exports = FreshserviceCommon;
