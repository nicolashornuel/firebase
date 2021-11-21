

// SDK Admin Firebase
var admin = require("firebase-admin");

var serviceAccount = require("../../resources/fourthproject.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fourthproject-aff75-default-rtdb.firebaseio.com/"

});

module.exports = admin.firestore();
