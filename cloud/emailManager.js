const sendmail = require("sendmail")({
  devPort: 25, // Default: False
  devHost: "localhost", // Default: localhost
  smtpPort: 25, // Default: 25
  smtpHost: "localhost" // Default: -1 - extra smtp host after resolveMX
})
// no need to import Parse in cloud functions
/* eslint-disable no-undef*/
Parse.Cloud.define("sendFeedback", async request => {
  const {
    params: { firstname, lastname, email, company, message, subject }
  } = request
  const content = `First Name: ${firstname}<br/>Last Name: ${lastname}<br/>Email: ${email}<br/>Company: ${company}<br/>Message: ${message}`
  sendmail(
    {
      from: "agileapp@siicanada.com",
      to: "agileapp@siicanada.com",
      subject: `[${subject}] Agile Tools`,
      html: content
    },
    function(err, reply) {
      console.log(err && err.stack)
    }
  )
})
