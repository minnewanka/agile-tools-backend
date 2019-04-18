'use strict'
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  secureConnection: false,
  port: process.env.SMTP_PORT || 25,
  tls: {
    ciphers: 'SSLv3'
  },
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASSWORD || 'password'
  }
})

// no need to import Parse in cloud functions
/* eslint-disable no-undef*/
Parse.Cloud.define('sendFeedback', async request => {
  const {
    params: { firstname, lastname, email, company, message, subject }
  } = request
  const content = `First Name: ${firstname}<br/>Last Name: ${lastname}<br/>Email: ${email}<br/>Company: ${company}<br/>Message: ${message}`
  transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: `[${subject}] Agile Tools`,
    html: content
  })
})
