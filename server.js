// server.js

let express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),

cookieParser = require('cookie-parser'),
mongoose = require('mongoose'),
db = require('./DB.js'),
passport = require('passport');
const app = express();

var cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8100',
    credentials:true
}));
app.options('/*', cors());
db();
/*app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'X-Requested-With, content-type, Authorization, accept');
    //res.header("Access-Control-Allow-Credentials",true);
    next();
});*/
/*app.all('/*', (req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'X-Requested-With, content-type, Authorization, accept');
    //res.header("Access-Control-Allow-Credentials",true);
    //res.send('cors problem fixed:)');

    next();
})*/


var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

const authRoutes = require('./routes/auth.route.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


app.use(passport.initialize());
//app.use(passport.session());
//app.use(passport.authenticate('session'));
app.use(cookieParser('abcedf'));
app.enable('trust proxy');
/*app.use(session({
    secret: 'abcedf',
    resave: true,
    saveUninitialized: false
}));*/
require('./config/passport')(passport);
const port = process.env.PORT || 4000;

app.use('/auth', authRoutes);

const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});