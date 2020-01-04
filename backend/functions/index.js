const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require("cors")({ origin: true });
app.use(cors);
app.use(express.json());

const firebaseAuth = require("./util/fbAuth");
const { db } = require("./util/admin");

const { signup, login, getAuthenticatedUser } = require("./handlers/users");
const {
  moveUnit,
  getCountry,
  getWorld,
  getCurrentTokenCountry,
  purchase,
  addCountries,
  checkMyUnits
} = require("./handlers/country");

app.post("/signup", signup);
app.post("/login", login);
app.get("/user", firebaseAuth, getAuthenticatedUser);

app.post("/moveUnit", firebaseAuth, moveUnit);
app.post("/country", getCountry);
app.post("/tokenCountry", getCurrentTokenCountry);
app.get("/world", getWorld);

app.post("/purchase", firebaseAuth, purchase);
app.post("/checkMyUnits", firebaseAuth, checkMyUnits);
app.get("/addCountries", firebaseAuth, addCountries);

exports.api = functions.region("europe-west1").https.onRequest(app);
