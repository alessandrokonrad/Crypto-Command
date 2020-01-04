import abi from "./contract.abi";
import Web3 from "web3";
import isDapp from "./dapp";

export var web3;

if (isDapp()) {
  web3 = new Web3(window.web3.currentProvider);
  if (!(web3.currentProvider.networkVersion == 1)) {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://mainnet.infura.io/v3/4c63edab283a4ba1b145a17f095be4e3"
      )
    );
  }
} else {
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://mainnet.infura.io/v3/4c63edab283a4ba1b145a17f095be4e3"
    )
  );
}

export let checkNetwork = () => {
  if (!isDapp()) return true;
  let netId = window.web3.currentProvider.networkVersion;
  if (netId == 1) {
    return true;
  }
  return false;
};

const contractAddress = "0x862174623BC39E57DE552538f424806B947d3D05";
export const CCDContract = new web3.eth.Contract(abi, contractAddress);
