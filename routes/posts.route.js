//posts.route.js
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const postsRoutes = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database.js');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const raccoon = require('raccoon/lib/raccoon');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'assets/contents/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + '__' + file.originalname);
    }
  }),
});


// require models
let Account = require('../models/account.js');
let Posts = require('../models/posts.js');


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

postsRoutes.get('/viewed', passport.authenticate('jwt', { session: false }), (req,res)=>{
  let token = getToken(req.headers);
  const postId = req.body.postId;
  const decoded = jwt.verify(token, config.secret);
  if(!postId) res.status(404).send('post is not exist');
  if(token){
    Account.findOne({ID: decoded}, (err, result)=>{
      Posts.findById(postId).exec().then( who => {
        const isviewed = who.viewed.includes(result._id);
        if(isviewed){
          res.status(200).send('you already saw this content');
        }else{
          who.viewed.push(result._id);
          who.save();
          res.status(200).send('you are seeing this content');
        }
      })
    })
  }else{
    res.status(404).send('invalid token');
  }
})

postsRoutes.post('/like', passport.authenticate('jwt', { session: false }), (req,res) =>{
  let token = getToken(req.headers);
  const postId = req.body.postId;

  if(!postId) res.status(404).send('post is not exist');
  if(token){
    const decoded = jwt.verify(token, config.secret);
    Account.findOne({ID: decoded}, (err, result)=>{
      if(err) res.status(403);
      if(result){
        //해당 포스트아이디에 유저가 라이크를 지운경우 추천알고리즘에서 제외 후 디비에서 해당 아이디를 지움, 반대의 경우 반대로 작동
        Posts.findById(postId).exec().then(who => {
          const isliked = who.Like.includes(result._id);
          if(isliked){
            raccoon.unliked(result._id.toString(), postId).then(()=>{
              const idx = who.Like.indexOf(result._id);
              who.Like.splice(idx, 1);
              who.save();
              return res.status(200).send('sucessfully unlike!');
            })
          }else{
            raccoon.liked(result._id.toString(), postId).then(()=>{
              who.Like.push(result._id);
              who.save();
              return res.status(200).send('sucessfully like!');
            })
          }
        })
      }
    })
  }else{
    res.status(404).send('invalid token');
  }
})

postsRoutes.get('/recommendforuser', passport.authenticate('jwt', { session: false }), (req,res) => {
  let token = getToken(req.headers);
  if(token){
    const decoded = jwt.verify(token, config.secret);
    Account.findOne({ID: decoded}, (err, result) =>{
      raccoon.recommendFor(result._id.toString(), 10)
      .then((recs)=>{
        Posts.find().where('_id').in(recs).exec((err, records) => {
          if (err) console.log(err);
          res.status(200).send(records);
        })
      })
    })
  }else{
    res.status(404).send('invalid token');
  }
})

postsRoutes.get('/all', async (req, res)=>{
  const allpost = await Posts.find().exec();
  res.status(200).json(allpost);
})

postsRoutes.get('/mine', passport.authenticate('jwt', { session: false }), (req, res) => {
  let token = getToken(req.headers);
  if (token){
    const decoded = jwt.verify(token, config.secret);
    Account.findOne({ID: decoded}, (err, result) => {
      //토큰에 담긴 id의 포스트를 전부 가져옴
      if(err) res.status(403);
      if(result) {
        let tmp = [];
        result.posts.forEach(element => {
          tmp.push(findpost(element));
        });
        return Promise.all(tmp).then(val=>{
          res.send(val);
        })
        
      }
    })
  }else{
    res.status(404).send('invalid token');
  }
})

async function findpost(objid){
  return await Posts.findById(objid).exec();
}


postsRoutes.post('/',
  passport.authenticate('jwt', { session: false }),
  upload.array('imgnvideo'),
  (req,res) => {
  let token = getToken(req.headers);
  if (token){
    const decoded = jwt.verify(token, config.secret);
    Account.findOne({ID: decoded}, (err, result) => {
      if(err) res.status(403);
      if(result){
        const howmany = req.body.howmany;
        let pagedes = [];

        //페이지 5개를 각각 변수에 넣음
        if(req.body.page1) pagedes[0] = req.body.page1;
        if(req.body.page2) pagedes[1] = req.body.page2;
        if(req.body.page3) pagedes[2] = req.body.page3;
        if(req.body.page4) pagedes[3] = req.body.page4;
        if(req.body.page5) pagedes[4] = req.body.page5;

        let post = new Posts();
        post._id = new mongoose.Types.ObjectId();
        post.author = result._id;
        post.date = Date.now();
        post.comments = [];
        post.viewed = [];
        let tmp = [];
        for(let i = 0; i < howmany; i++){
          tmp.push({ page: i+1, filepath: '/contents/' +  req.files[i].filename, description: pagedes[i]});
        }
        post.post = tmp;
        post.Like = [];
        post.tags = [];
        post.save();
        result.posts.push(post._id);
        result.save();
        res.status(200).send('post complete');
      } else {
        res.status(404).send('user not found');
      }
    })
  }
  
})


module.exports = postsRoutes;