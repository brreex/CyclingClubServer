var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose= require('mongoose');


var schema= new mongoose.Schema({clubId:String,memberName:String, post:String});

var post= mongoose.model('cposts',schema);

var post1= new post({memberName:'adam',post:'welcome bikers'});
var post2= new post({memberName:'Berhanu',post:'welcome bikers enjoy'});
// post2.save(function(err){
//                if(err) console.log(err);
//                console.log('saved the posts');
//          });

router.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
 });


 router.get('/',function(req,res,next){
       var clubId= req.query.clubId;
       var query= {clubId:clubId}
     post.find(query, function(err,posts){
            res.json(posts);
     })
 })

 router.post('/',function(req,res,next){
         var memberName= req.body.memberName;
         var postMessage= req.body.post;
         var clubId= req.body.clubId;
          
         var post1= new post({'clubId':clubId,'memberName':memberName,'post':postMessage});
         post1.save(function(err){
               if(err) console.log(err);
               console.log('saved the posts');
         })
 })

 module.exports=router;