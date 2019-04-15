"use strict"
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: 'SSLv3'
  },
  auth: {
    user: "agile-tools@siicanada.com",
    pass: "@SIIcanada1"
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