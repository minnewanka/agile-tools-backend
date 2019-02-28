import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import logger from "morgan"
import {ParseServer} from "parse-server"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json"

import indexRouter from "./routes/index"

var app = express()
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI

// Import parse 
var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
    cloud: process.env.CLOUD_CODE_MAIN || './cloud/main.js',
    appId: process.env.APP_ID || 'SIIAG',
    masterKey: process.env.MASTER_KEY || 'qWapk8BYDbUdnfMl3hZ8b2yTAgglDQ', 
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', 
    liveQuery: {
      classNames: ['Vote']
    }
  })

//don't show the log when it is test
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
//SwaggerUI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/", indexRouter)

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse'
app.use(mountPath, api)

//app.listen(1337, () => {})

var port = process.env.PORT || 1337
var httpServer = require('http').createServer(app)

httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.')
})

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer)

module.exports = app
