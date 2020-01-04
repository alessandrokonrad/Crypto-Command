const isDapp = () => {
  // Modern dapp browsers...
  if (window.ethereum || window.web3) {
    try {
      // Request account access if needed
      window.ethereum.enable();
      // Acccounts now exposed
    } catch (error) {
      // User denied account access...
      return false;
    }
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
    return false;
  }
  return true;
};

// if (window.ethereum || window.web3)
//   window.ethereum.on("accountsChanged", () => {
//     window.location.reload();
//   });

export default isDapp;
