const functions = require('firebase-functions')
const { callbackMessage } = require('./callBack')

const exportInformation = functions.firestore
  .document('person/{personId}/test/{testId}')
  .onWrite(callbackMessage)

module.exports = {
  exportInformation
}