var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose= require('mongoose');
//mongoose.connect('mongodb://localhost:27017/db1');

//schema for Event
var schema = new mongoose.Schema({ 
          userId : String , 
          eventName : String,  
          eventDate:String, 
          latitude: Number, 
          longtitude : Number ,
          status: String });

//schema for Emergency
var schema1 = new mongoose.Schema({ 
          eventId : String ,
          userId : String,
          latitude : Number,
          longtitude : Number
         });

var emergency = mongoose.model('emergeny',schema1);
var event = mongoose.model('event',schema);


/* GET users listing. */

//set the CORS request headers
router.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
 });

 router.all('/live', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
 });

 router.all('/live/stop', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
 });

 router.all('/live/emergency', function(req, res, next) {
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
 });

router.all('/live/update', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
 });
 
router.get('/', function(req, res, next) {
  var id = req.query.userId;
  
  var queryString = {$and : [{userId : id}, {status : {$in : ["created","emergency","started"]}} ]};

  event.find(queryString).exec((err,data)=>{
    res.json(data);
  });
  
});

router.post('/', function(req, res, next) {

var addEvent = new  
 event({
    userId : req.body.userId,
    eventName : req.body.eventName,
    eventDate : req.body.eventDate,
    eventTime : req.body.eventTime,
    latitude : req.body.latitude,
    longtitude : req.body.longtitude,
    status : "created"
});

    addEvent.save(err => {
          if(err) 
              console.log(err) ; 
          console.log("Inserted");
        });


});


router.get('/live', function(req, res, next) {
  
  var queryString = {status : "started"};
  
  event.find(queryString).exec((err,data)=>{
    res.json(data);
  });
  
});


router.put('/live', function(req, res, next) {
  var id = req.body.eventId;
   console.log("this is id : " + req.body.eventId);
  var queryString = {_id : id};
  var operator =  {$set: {status : "started"}};

  event.update(queryString,operator).exec((err,data)=>{
    res.json(data);
  });

});

router.put('/live/update', function(req, res, next) {
  var id = req.body.eventId;
  
  var queryString = {_id : id};
  var operator =  {$set: {latitude : req.body.latitude , longtitude : req.body.longtitude} };

  event.update(queryString,operator).exec((err,data)=>{
    res.json(data);
    
  });
  
});

router.delete('/live/stop', function(req, res, next) {
  var id = req.query.eventId;
  
  var queryString = {_id : id};
  
  event.findOneAndRemove(queryString , function(err,data){
    res.json(data);
  });
  
});


router.get('/live/emergency', function(req, res, next) {
  
  var queryString = {};
  
  event.find(queryString).exec((err,data)=>{
    res.json(data);
  });
  
});

router.post('/live/emergency', function(req, res, next) {

  var id = req.body.eventId;
  var queryString = {_id : id};
  var operator =  {$set: {status : "emergency"}};

  event.update(queryString,operator).exec((err,data)=>{
    res.json(data);
  });

   var emergencyInfo = new emergency ({
      eventId : req.body.eventId,
      userId : req.body.userId,
      latitude : req.body.latitude,
      longtitude : req.body.longtitude
  });
 
router.delete('/live/emergency', function(req, res, next) {
  var id = req.query.eventId;
  console.log("Inside Server : " + id);
  var queryString = {_id : id};

  
  emergency.findOneAndRemove(queryString , function(err,data){
    console.log("Inside Delete");
    console.log(data);
    res.json(data);
  });
  
});  
});






module.exports = router;
