const Web3 = require("web3");
exports.web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/4c63edab283a4ba1b145a17f095be4e3"
  )
);
