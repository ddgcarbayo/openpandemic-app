'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const updatePositiveContacts = async function (change, context) {
  if (change.after.data().result === "symptoms") {
    let person = await admin.firestore().collection('person').doc(context.params.id).get();
    if(person.exists){
      let contactIds = person.get('contact-ids') || [];
      contactIds.forEach(async contact => {
        let positive = await admin.firestore().collection('positive-contacts').doc(contact).get();
        let timestamps;
        if (positive.exists) {
          timestamps = positive.data().timestamps || [];
          timestamps.push(change.after.data().time);
        } else {
          timestamps = [];
          timestamps.push(change.after.data().time);
        }
        await admin.firestore().collection('positive-contacts').doc(contact).set({ "timestamps": timestamps }, { merge: true });
      });
    } else {
      console.warn("person not found");
    }
  }
}

exports.update = functions.firestore.document('person/{id}/test/{testId}').onWrite(updatePositiveContacts);