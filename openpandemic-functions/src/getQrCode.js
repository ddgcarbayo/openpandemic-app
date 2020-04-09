'use strict';

const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const crypto = require('crypto');
const app = express();


const validateFirebaseIdToken = require('./validateFirebaseToken.js').validate;

app.use(cors);
app.use(cookieParser);
app.use(express.json());
app.use(validateFirebaseIdToken);

app.post('/', (req, res) => {
  // This is just an example of a function to generate a code for the QR.
  // The actual QR Code will contain information for the an institutional app to read it
  const hash = crypto.createHash('sha256');
  hash.update(req.body.data.id);
  res.json({data:{code: hash.digest('hex')}});
});

exports.get = functions.https.onRequest(app);