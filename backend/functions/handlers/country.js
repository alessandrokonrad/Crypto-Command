const { db } = require("../util/admin");
const { CCDContract } = require("../util/contract");
const { web3 } = require("../util/web3");
const { validateTxHash } = require("../util/validators");

const removeUnitFromCountry = async (tokenId, token, country) => {
  // reduce power
  country.forces[token.country].power -= parseInt(token.power);
  let index = country.forces[token.country].units.indexOf(tokenId);
  country.forces[token.country].units.splice(index, 1);
  if (country.forces[token.country].power <= 0)
    delete country.forces[token.country];

  calculateDominance(country);
  await calculateOccupations(country);
  await updateCountry(country);
};

const addUnitToCountry = async (tokenId, token, country) => {
  //add power
  if (!country.forces[token.country]) {
    country.forces[token.country] = {
      dominance: 0,
      power: 0,
      units: []
    };
  }
  country.forces[token.country].power += parseInt(token.power);
  country.forces[token.country].units.push(tokenId);

  calculateDominance(country);
  await calculateOccupations(country);

  await db
    .collection("tokens")
    .doc(tokenId.toString())
    .set({ code: country.code })
    .catch(error => console.log(error));

  await updateCountry(country);
};

const hasForces = country => Object.keys(country.forces).length != 0;

const calculateOccupations = async country => {
  if (!hasForces(country)) {
    if (country.command == country.code) {
      country.command = null;
      let index = country.occupations.indexOf(country.code);
      country.occupations.splice(index, 1);
      // country.occupations--;
      return;
    }
    let commandCountry = await db
      .collection("countries")
      .doc(country.command)
      .get()
      .then(doc => doc.data());
    country.command = null;
    let index = commandCountry.occupations.indexOf(country.code);
    commandCountry.occupations.splice(index, 1);
    // commandCountry.occupations--;
    await db
      .collection("countries")
      .doc(commandCountry.code)
      .set(commandCountry);
  } else {
    let highestPower = 0;
    let oldCommand = country.command;
    let newCommand = null;
    for (let code in country.forces) {
      let force = country.forces[code];
      if (parseInt(force.power) > parseInt(highestPower)) {
        highestPower = parseInt(force.power);
        newCommand = code;
      }
    }

    country.command = newCommand;

    if (oldCommand == newCommand) return;
    else if (!oldCommand) {
      if (country.code == newCommand) {
        country.occupations.push(country.code);
        return;
      }
      let commandCountry = await db
        .collection("countries")
        .doc(newCommand)
        .get()
        .then(doc => doc.data());
      commandCountry.occupations.push(country.code);

      await db
        .collection("countries")
        .doc(commandCountry.code)
        .set(commandCountry);
    } else if (oldCommand == country.code) {
      let index = country.occupations.indexOf(country.code);
      country.occupations.splice(index, 1);
      let commandCountry = await db
        .collection("countries")
        .doc(newCommand)
        .get()
        .then(doc => doc.data());
      commandCountry.occupations.push(country.code);

      await db
        .collection("countries")
        .doc(commandCountry.code)
        .set(commandCountry);
    } else if (newCommand == country.code) {
      country.occupations.push(country.code);
      let lostCountry = await db
        .collection("countries")
        .doc(oldCommand)
        .get()
        .then(doc => doc.data());
      let index = lostCountry.occupations.indexOf(country.code);
      lostCountry.occupations.splice(index, 1);
      await db
        .collection("countries")
        .doc(lostCountry.code)
        .set(lostCountry);
    } else {
      let commandCountry = await db
        .collection("countries")
        .doc(newCommand)
        .get()
        .then(doc => doc.data());
      commandCountry.occupations.push(country.code);
      await db
        .collection("countries")
        .doc(commandCountry.code)
        .set(commandCountry);
      let lostCountry = await db
        .collection("countries")
        .doc(oldCommand)
        .get()
        .then(doc => doc.data());
      let index = lostCountry.occupations.indexOf(country.code);
      lostCountry.occupations.splice(index, 1);
      await db
        .collection("countries")
        .doc(lostCountry.code)
        .set(lostCountry);
    }
  }
};

const calculateDominance = country => {
  let totalPower = 0;
  for (let code in country.forces) {
    totalPower += parseInt(country.forces[code].power);
  }
  for (let code in country.forces) {
    let force = country.forces[code];
    force.dominance = Math.round((parseInt(force.power) / totalPower) * 100);
  }
};

const updateCountry = async country => {
  await db
    .collection("countries")
    .doc(country.code)
    .set(country)
    .catch(error => console.log(error));
};

exports.moveUnit = async (req, res) => {
  let tokenId = parseInt(req.body.tokenId);
  let newTokenCode = req.body.code;

  console.log(`Checking ownership of token ${tokenId} ...`);
  let tokenOwner = await CCDContract.methods.ownerOf(tokenId).call();
  if (tokenOwner.toLowerCase() != req.user.address.toLowerCase())
    return res.status(500).json({ error: "You are not owner of the token" });

  console.log("Fetching token ...");
  let token = await CCDContract.methods.getToken(tokenId).call();

  let oldTokenCode = await db
    .collection("tokens")
    .doc(tokenId.toString())
    .get()
    .then(doc => (doc.exists ? doc.data().code : null));
  if (!oldTokenCode)
    return res
      .status(500)
      .json({ error: "Current token location not available" });

  if (oldTokenCode == newTokenCode)
    return res.status(500).json({ error: "Unit is already in this country" });

  console.log("Fetching old country");
  let oldCountry = await db
    .collection("countries")
    .doc(oldTokenCode)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
  if (!oldCountry)
    return res.status(500).json({ error: "Current country doesn't exist" });

  console.log(`Removing ${token.name} from ${oldCountry.code} ...`);
  await removeUnitFromCountry(tokenId, token, oldCountry);
  console.log("Successfully removed!");

  console.log("Fetching new country ...");
  let newCountry = await db
    .collection("countries")
    .doc(newTokenCode)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
  if (!newCountry)
    return res.status(500).json({ error: "New country doesn't exist" });

  console.log(`Adding ${token.name} to ${newCountry.code} ...`);
  await addUnitToCountry(tokenId, token, newCountry);
  console.log("Successfully added!");

  return res.json({ status: "Success" });
};

exports.getWorld = (req, res) => {
  let countries = {};
  db.collection("countries")
    .get()
    .then(snapshot => snapshot.forEach(doc => (countries[doc.id] = doc.data())))
    .then(() => res.json({ countries }))
    .catch(error => console.log(error));
};

exports.getCurrentTokenCountry = (req, res) => {
  db.collection("tokens")
    .doc(req.body.tokenId.toString())
    .get()
    .then(doc => (doc.exists ? doc.data().code : null))
    .then(code => res.json({ code }));
};

exports.getCountry = async (req, res) => {
  let country = await db
    .collection("countries")
    .doc(req.body.code)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
  if (!country) return res.json({ error: "country doesn't exist" });

  for (let code in country.forces) {
    let force = country.forces[code];
    force.fullUnits = [];
    for (let unit of force.units) {
      force.fullUnits.push(await CCDContract.methods.getToken(unit).call());
    }
  }
  return res.json({ country });
};

const isOnBattlefield = async tokenId => {
  var tokenOnBattlefield = await db
    .collection("tokens")
    .doc(tokenId.toString())
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
  return tokenOnBattlefield;
};

exports.checkMyUnits = async (req, res) => {
  let tokenIds = req.body.tokenIds;
  console.log(tokenIds);
  let tokensFromEth = await CCDContract.methods
    .getTokens(req.user.address)
    .call();
  if (tokenIds != tokensFromEth.toString())
    return res.status(500).json({ error: "Something went wrong" });

  for (let tokenId of tokenIds) {
    tokenId = parseInt(tokenId);

    let token = await CCDContract.methods.getToken(tokenId).call();
    let country = await db
      .collection("countries")
      .doc(token.country)
      .get()
      .then(doc => (doc.exists ? doc.data() : null));

    let index = country.freeUnits.indexOf(tokenId);

    if (index != -1) {
      country.freeUnits.splice(index, 1);
      await updateCountry(country);
    }
    if (!(await isOnBattlefield(tokenId))) {
      await addUnitToCountry(tokenId, token, country);
    }
  }

  return res.json({ general: "Updated units" });
};

exports.purchase = async (req, res) => {
  const tokenId = parseInt(req.body.tokenId);
  if (!req.body.receipt.status)
    return res.status(500).json({ error: "Token not mined into block" });
  if (await isOnBattlefield(tokenId))
    return res.status(500).json({ error: "Already on battlefield" });

  let tokenOwner = await CCDContract.methods.ownerOf(tokenId).call();
  let token = await CCDContract.methods.getToken(tokenId).call();
  if (tokenOwner.toLowerCase() != req.user.address.toLowerCase())
    return res.status(500).json({ error: "You are not owner of the token" });
  let country = await db
    .collection("countries")
    .doc(token.country)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
  if (!country)
    return res.status(500).json({ error: "Current country doesn't exist" });
  let index = country.freeUnits.indexOf(tokenId);
  country.freeUnits.splice(index, 1);
  await addUnitToCountry(tokenId, token, country);
  return res.json({ result: "Success" });
};

const listComplete = (start, unitSize) => {
  let indices = [];
  for (let i = start; i < start + unitSize; i++) {
    indices.push(i);
  }
  return indices;
};

exports.addCountries = async (req, res) => {
  let secret = "0x4fF8689659B104fd0596DBC9E8F18EBB39f635b8";

  if (req.user.address.toLowerCase() !== secret.toLowerCase())
    return res.status(500).json({ error: "Invalid secret" });

  let unitSize = 25;

  for (let i = 0; i < CODES.length; i++) {
    let code = CODES[i];
    let country = {
      code,
      command: null,
      freeUnits: [],
      occupations: [],
      forces: {}
    };
    let start = i * unitSize;

    for (let tokenId of listComplete(start, unitSize))
      country.freeUnits.push(tokenId);

    await db
      .collection("countries")
      .doc(code)
      .set(country);
  }

  res.json({ general: "Success" });
};

const CODES = [
  "AF",
  "AL",
  "AM",
  "AO",
  "AR",
  "AT",
  "AU",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BI",
  "BJ",
  "BO",
  "BR",
  "BS",
  "BT",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CD",
  "CF",
  "CH",
  "CI",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GH",
  "GL",
  "GM",
  "GN",
  "GQ",
  "GR",
  "GT",
  "GW",
  "GY",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IN",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KP",
  "KR",
  "KW",
  "KZ",
  "LA",
  "LB",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "ME",
  "MG",
  "ML",
  "MM",
  "MN",
  "MP",
  "MR",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PG",
  "PH",
  "PK",
  "PL",
  "PS",
  "PT",
  "PY",
  "QA",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SN",
  "SO",
  "SR",
  "SS",
  "SV",
  "SY",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TL",
  "TM",
  "TN",
  "TR",
  "TT",
  "TW",
  "TZ",
  "UA",
  "AE",
  "UG",
  "US",
  "UY",
  "UZ",
  "VE",
  "VN",
  "VU",
  "WE",
  "XK",
  "YE",
  "ZA",
  "ZM",
  "ZW"
];
