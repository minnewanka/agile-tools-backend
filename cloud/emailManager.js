"use strict"
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
  host: process.env.STMP_HOST,
  secureConnection: false,
  port: process.env.STMP_PORT,
  tls: {
    ciphers: 'SSLv3'
  },
  auth: {
    user: process.env.STMP_USER,
    pass: process.env.STMP_PASSWORD
  }
})


// no need to import Parse in cloud functions
/* eslint-disable no-undef*/
Parse.Cloud.define("sendFeedback", async request => {
  const {
    params: {
      firstname,
      lastname,
      email,
      company,
      message,
      subject
    }
  } = request
  const content = `First Name: ${firstname}<br/>Last Name: ${lastname}<br/>Email: ${email}<br/>Company: ${company}<br/>Message: ${message}`
  transporter.sendMail({
    from: "agile-tools@siicanada.com",
    to: "agile-tools@siicanada.com",
    subject: `[${subject}] Agile Tools`,
    html: content
  })
})