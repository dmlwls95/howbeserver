// server.js

let express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const db = require('./DB.js');
const passport = require('passport');
const passportConfig = require('./config/passport');
const app = express();
const redis = require('redis');
var cors = require('cors');
var corsOptions = {
    origin:  'http://localhost:8100', // 이 주소가 ionic node.js 서버가 동작하는 주소
    credentials: true,
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: "Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept, x-access-token"
};

app.options(/\.*/, cors(corsOptions), function(req, res) {
  return res.sendStatus(200);
});
app.all('*', cors(corsOptions), function(req, res, next) {
  next();
});
db();

app.use(express.static(path.join(__dirname, 'assets')));




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());

//************************************** passport */
app.use(passport.initialize());
passportConfig();
//************************************** passportend */

app.use(cookieParser('abcedf'));
app.enable('trust proxy');
const port = process.env.PORT || 4000;

//************************************** routes */
const authRoutes = require('./routes/auth.route.js');
const personalRoutes = require('./routes/personal.route.js');
const postsRoutes = require('./routes/posts.route.js');
const hobbyRoutes = require('./routes/hobby.route.js');

app.use('/auth', authRoutes);
app.use('/personal', personalRoutes);
app.use('/posts', postsRoutes);
app.use('/hobby', hobbyRoutes);
//************************************** */
const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});