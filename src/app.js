const session = require('cookie-session');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser')

app.config = require('./config.js'); 
app.use(cookieParser(app.config.cookieSecret));
const logger = require('./logger.js');
const { fileURLToPath } = require('url');
const { fstat } = require('fs');

//using the logger and its configured transports, to save the logs created by Morgan
const logStream = {
  write: (text) => {
    logger.info(text);
  }
}

app.log = logger;
app.use(morgan('tiny', { stream: logStream }));

app.mailer = require('./mailer.js');
app.db = require('./services/firebase').firestore;

app.disable('x-powered-by');
// const helmet = require('helmet');
// app.use(helmet())

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../ui/build')));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/ping', function(_req,res){
    res.status(200).send('pong');
})

app.get('/_buildinfo', function(_req, res){
  res.send({
    buildinfo: fs.readFileSync(path.join(__dirname,"../BUILDINFO")).toString().trim()
  })
})
app.use('/api/user', require('./api/user.js'));
app.use('/api/request', require('./api/request.js'));
app.use('/api/phone', require('./api/phonenumbers.js'));
app.use(require('./openapi'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
});

module.exports = app;