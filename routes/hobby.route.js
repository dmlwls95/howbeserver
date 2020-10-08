//hme.route.js
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const hobbyRoutes = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database.js');
const fs = require('fs');
const path = require('path');
// require models
let Account = require('../models/account.js');
let Hobby = require('../models/hobby.js');




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
hobbyRoutes.get('/', (req,res,next) => {

  Hobby.find((err, result)=>{
    let tosend = [];
    result.forEach(ele=>{
      tosend.push(ele.name);
    })
    res.status(200).send(tosend);
  })
})

//**default render method */
hobbyRoutes.post('/', (req,res,next) => {
  let newhobby = new Hobby();
  newhobby._id = new mongoose.Types.ObjectId();
  newhobby.name = req.body.name;
  newhobby.hobby = null;
  newhobby.save();
  res.status(200).send('sucess');
})

hobbyRoutes.delete('/', (req,res,next) => {
  let newhobby = new Hobby();
  newhobby.name = req.body.name;
  newhobby.hobby = [];
  newhobby.save();
  res.status(200).send('sucess');
})

module.exports = hobbyRoutes;