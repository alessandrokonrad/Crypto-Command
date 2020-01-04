const { admin, db } = require("../util/admin");

const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const { validateSignupData, validateLoginData } = require("../util/validators");

// Sign users up
exports.signup = (req, res) => {
  const newUser = {
    address: req.body.address,
    signature: req.body.signature,
    username: req.body.username
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;
  db.collection("users")
    .doc(newUser.address)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ address: "this address is already in use" });
      } else {
        let email = `${newUser.address}@cryptocommand.com`;
        let password = newUser.signature;
        return firebase.auth().createUserWithEmailAndPassword(email, password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        username: newUser.username,
        address: newUser.address,
        createdAt: Date.now(),
        userId
      };
      return db
        .collection("users")
        .doc(newUser.address)
        .set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
};
// Log user in
exports.login = (req, res) => {
  const user = {
    address: req.body.address,
    signature: req.body.signature
  };
  console.log(req.body);
  console.log(req.body.address);
  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  let email = `${user.address}@cryptocommand.com`;
  let password = user.signature;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-user
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.collection("users")
    .doc(req.user.address)
    .get()
    .then(doc => {
      if (doc.exists) userData.credentials = doc.data();
    })
    .then(data => res.json(userData))
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
