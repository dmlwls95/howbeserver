//hme.route.js
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const personalRoutes = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database.js');
const fs = require('fs');
const path = require('path');
// require models
let Account = require('../models/account.js');




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
personalRoutes.get('/', (req,res,next) => {
  //console.log(distDir + '/index.html')
  res.send('test')
})
//** check jwt method */
personalRoutes.get('/jwtcheck', passport.authenticate('jwt', { session: false }), (req,res)=>{
  let token = getToken(req.headers);
  if (token) {
    return res.status(200).send({ success: true, msg: 'Authorized' });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
})
//** getting profile image */
personalRoutes.get('/profileimage', passport.authenticate('jwt', { session: false }), (req,res)=>{
  let token = getToken(req.headers);
  if (token){
    const decoded = jwt.verify(token, config.secret);
    Account.findOne({ID: decoded}, (err, result)=>{
      if(err) res.status(403);
      if(result){
        const user_id = result._id.toString()
        res.status(200).send(user_id);
      } else {
        res.status(404).send('user not found');
      }
    })
  }else{
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
})

personalRoutes.post('/whatisyourhowbe', passport.authenticate('jwt', { session: false }), (req,res)=>{
  let token = getToken(req.headers);
  if (token){
    const decoded = jwt.verify(token, config.secret);
    Account.findOne({ID: decoded}, (err, result)=>{
      if(err) res.status(403);
      if(result){
        let tmp = req.body;
        tmp.forEach(element => {
          result.howbe.push(element);
        });
        result.save();
        res.status(200).send({ success: true, msg: 'hobby selected' })
      } else {
      }
    })
  }else{
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
  
})


module.exports = personalRoutes;