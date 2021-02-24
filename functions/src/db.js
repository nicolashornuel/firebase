

// SDK Admin Firebase
var admin = require("firebase-admin");

var serviceAccount = require("../resources/fourthproject.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fourthproject-aff75-default-rtdb.firebaseio.com"
});

module.exports = admin.database();
//module.exports = admin.firestore();
//https://firebase.google.com/docs/firestore/rtdb-vs-firestore





// SDK Web (≠ SDK Node.js)
// firebase.firestore