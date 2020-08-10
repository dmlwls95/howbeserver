//hme.route.js
const express = require('express');
const mongoose = require('mongoose');
const passport =require('passport');
const authRoutes = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database.js');

// require models
let Account = require('../models/account.js');
let Proimage = require('../models/proimage.js')

let distDir = __dirname + "../dist";



getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

//**default render method */
authRoutes.get('/', (req,res,next) => {
  //console.log(distDir + '/index.html')
  res.render('../dist/index.html');
})

//** login method*/
authRoutes.post('/login', (req,res,next) => {
  Account.findOne(
    {
      ID: req.body.username
    }, 
    (err, user) => {
      if(err) throw err;

      if(!user) {
        res.status(401).send({
          sucess: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err){
            let token = jwt.sign(user.toJSON(), config.secret, {
              expiresIn: '30m'
            });

            res.json({ success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }
  )
});
//** sign up method */
authRoutes.post('/signup',(req,res)=>{
  console.log(req.body)
  let newItem = new Account();
  newItem._id = new mongoose.Types.ObjectId();
  newItem.ID = req.body.ID;
  newItem.PW = req.body.PW;
  newItem.proImage.data = fs.readFileSync(__dirname + '/default-profile.png');
  newItem.proImage.contentType = 'image/png';
  Account.findOne(
    {ID: req.body.ID}, (err,result)=>{
      if(err){
        console.log(err);
        throw err;
      } 
      if(!result){
        /*Account.insertMany({ID: id, PW: pw, proImage: newPro}, (err, docs)=>{  
          res.status(200).send({
            success: true,
            msg: 'The request was successfully completed.'
          });
        });*/
        newItem.save();
        res.status(200).send({
          success: true,
          msg: 'The request was successfully completed.'
        });
      }else{
        res.status(400).send({
          success: false,
          msg: 'Already exist. send different ID.'
        });
      }
    }
  )
})
//** check jwt method */
authRoutes.get('/jwtcheck', passport.authenticate('jwt', { session: false }), (req,res)=>{
  let token = getToken(req.headers);
  if (token) {
    return res.status(200).send({ success: true, msg: 'Authorized' });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
})
//** getting profile image */
authRoutes.post('/profile', passport.authenticate('jwt', { session: false }), (req,res)=>{
  let token = getToken(req.headers);
  console.log(req.body);
  if (token){
    Account.findOne({ID: req.body.id}, (err, result)=>{
      res.send(result);
    })
  }else{
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
})
//** logging */
authRoutes.post('/alert',(req,res)=>{
  Account.findOne(
    {
      ID: req.body.username
    }, 
    (err, user) => {
      if(err) throw err;

      if(!user) {
        res.status(401).send({
          sucess: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err){
            let newalert = new Alertinfo();
            newalert._id = new mongoose.Types.ObjectId();
            newalert.Date = Date.now();
            newalert.ID = req.body.username;
            newalert.lat = req.body.lat;
            newalert.lng = req.body.lng;
            newalert.save();
            
            io.sockets.emit(req.body.username, newalert);

            res.status(200).send({
              sucess: true,
              msg: 'sucessed'
            })
          } else {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }
  )
});


module.exports = authRoutes;