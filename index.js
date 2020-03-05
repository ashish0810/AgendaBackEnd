console.log("    ___         __    _      __    ____             __    ___                        __      ___    ____  ____");
console.log("   /   |  _____/ /_  (_)____/ /_  / __ )____ ______/ /_  /   | ____ ____  ____  ____/ /___ _/   |  / __ \\/  _/");
console.log("  / /| | / ___/ __ \\/ / ___/ __ \\/ __  / __ `/ ___/ __ \\/ /| |/ __ `/ _ \\/ __ \\/ __  / __ `/ /| | / /_/ // /  ");
console.log(" / ___ |(__  ) / / / (__  ) / / / /_/ / /_/ / /__/ / / / ___ / /_/ /  __/ / / / /_/ / /_/ / ___ |/ ____// /   ");
console.log("/_/  |_/____/_/ /_/_/____/_/ /_/_____/\\__,_/\\___/_/ /_/_/  |_\\__, /\\___/_/ /_/\\__,_/\\__,_/_/  |_/_/   /___/   ");
console.log("                                                            /____/                                            ");

console.log('Starting up application...');

const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');
const MySqlClient = require('./utils/db/mySqlClient.js');
const LocalClient = require('./utils/db/localClient.js');
const TokenManager = require('./utils/session/tokenManager.js');
const tasksRoutes = require('./api/routes/tasksRoutes');
const loginRoutes = require('./api/routes/loginRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 8443;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: function(origin, callback) {
        console.log(origin);
        return callback(null, true);
    }
}));

var dbClient;
if (process.argv[2] != 'local') {
    dbClient = new MySqlClient(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);
} else {
    dbClient = new LocalClient();
}

const tokenManager = new TokenManager();

console.log('Loading routes...');

app.get('/', function (req, res) {
    res.send('Santiy check that the agenda api is working');
});

tasksRoutes(app, dbClient, tokenManager);
loginRoutes(app, dbClient, tokenManager);

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
    requestCert: false,
    rejectUnauthorized: false
}

https.createServer(options, app).listen(port); // Will this use my cert from ashishbach.com?
http.createServer(app).listen(3000);

// app.listen(port);
console.log('-------------------------------------------');
console.log('App has started. Now listening on port ' + port);
console.log('===========================================');
