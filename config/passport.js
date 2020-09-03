const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// load up the user model
let Account = require('../models/account.js');
let config = require('../config/database'); // get db config file

module.exports = () => {
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : config.secret
    },
        (jwt_payload, done) => {
        return Account.findOne({ID: jwt_payload})
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
  }));

};