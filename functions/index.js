const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());

const firestore = require('./src/routers/router.firestore');
app.use('/fire', firestore)
const realtime = require('./src/routers/router.realtime');
app.use('/real', realtime)
const preference = require('./src/routers/router.preference');
app.use('/firepref', preference)

exports.app = functions.https.onRequest(app);