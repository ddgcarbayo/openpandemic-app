'use strict'

exports.qrcode = require('./src/getQrCode.js')
exports.positive_contacts = require('./src/updatePositiveContacts.js').update
exports.exportInformation = require('./src/exportInformation')