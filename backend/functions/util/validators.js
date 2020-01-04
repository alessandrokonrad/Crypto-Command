const { web3 } = require("./web3");
const util = require("ethereumjs-util");

const MESSAGE = "CRYPTOCOMMAND.IO";

const checkSignature = (message, signature) => {
  message = "\x19Ethereum Signed Message:\n" + message.length + message;
  message = util.keccak(message);
  const sig = signature;
  const { v, r, s } = util.fromRpcSig(sig);
  const pubKey = util.ecrecover(util.toBuffer(message), v, r, s);
  const addrBuf = util.pubToAddress(pubKey);
  const addr = util.bufferToHex(addrBuf);
  return addr;
};

const isAddress = address => web3.utils.isAddress(address);

const isSignatureToAddress = (address, signature) => {
  let signer = checkSignature(MESSAGE, signature);
  return address === signer;
};

const isEmpty = string => string.trim() === "";

const isTooLong = string => string.length > 16;

exports.validateSignupData = data => {
  let errors = {};

  // check address and siganture
  if (isEmpty(data.address)) errors.address = "Must not be empty";
  else if (!isAddress(data.address))
    errors.address = "Must be a valid Ethereum-address";
  else if (isEmpty(data.signature)) errors.signature = "Must not be empty";
  else if (!isSignatureToAddress(data.address, data.signature))
    errors.address = "Address does not belong to signature";

  // check username
  if (isEmpty(data.username)) errors.username = "Must not be empty";
  else if (isTooLong(data.username))
    errors.username = "Maximum of 16 characters";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(data.address)) errors.address = "Must not be empty";
  if (isEmpty(data.signature)) errors.signature = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateTxHash = txHash => {
  return /^0x([A-Fa-f0-9]{64})$/.test(txHash);
};
