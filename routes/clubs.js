var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose= require('mongoose');

//schema for clubs
var schema = new mongoose.Schema({ name:String , city:String, state:String, members:[{userId:String,
  memberName:String, city:String, state:String, location:{ type:[Number],index:'2d' }}], logo:String, location:{ type:[Number],index:'2d' }});

var clubNew = mongoose.model('FairClubs',schema);
  //set the CORS request headers

 router.all('*',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
 })

router.get('/', function(req, res, next) {
   //console.dir(req);
    var longitude= req.query['longitude'];
    var latitude= req.query['latitude'];
    var userId =req.query['userId'];
     
     console.log( userId);
     console.log(longitude);
     console.log(latitude);

     var q1 = {location:{'$near':[longitude,latitude],'$maxDistance':2000}};
     var q2 = {members:{'$elemMatch':{'userId':userId}}};

    let q = {'$and':[{location:{'$near':[longitude,latitude],'$maxDistance':2000}},{members:{'$not':{'$elemMatch':{'userId':userId}}}}]};
    console.log(q1);
    console.log(q2);
    console.dir(q);
  clubNew.find(q).exec(function(err,clubs){
       if(clubs!=null){
        console.dir(JSON.stringify(clubs));
       res.json(clubs); 
      }
      else{
        console.log('null return');
        res.json([]);}
       
  });  
});
router.get('/joined',function(req,res,next){
  var userId =req.query.userId;
     clubNew.find({"members":{$elemMatch:{'userId':userId}}}).limit(5).exec(function(err,clubs){
              if(clubs!=null){
              res.json(clubs);
      }
            res.end('no clubs found');
     })
});

///update the members

router.put('/',function(req,res,next){
      var clubId= req.query.clubId;
      console.log(clubId);
      var userId= req.body.userId;
      var memberName= req.body.memberName;
         console.log("member is: "+memberName);
         console.log(req.body);
      var state= req.body.state;
      var city = req.body.city;
      
      var latitude= req.body.location[1];
      console.log('the latitude of join is: '+latitude);
      var longitude= req.body.location[0];
      var ObjectId= mongoose.Types.ObjectId
      var query= {_id:ObjectId(clubId)};
      console.log('new object id: '+ ObjectId(clubId));
     
      var operator2={$set:{state:'California'}};
      var operator={$addToSet:{members:{'userId':userId,'memberName':memberName, 'city':city,'state':state,'location':[longitude,latitude]}}};
      clubNew.update(query,operator, {upsert:true},function(err,numUpdate){
      if(err){
        console.log(err)
      }
      else{
        console.log('successfully added');
      }
  }) 

});

//create a new club

  router.post('/',function(req,res,next){
  //  console.log(req.body);
     var name=req.body.name;
   
     var location= req.body.location;
     var city = req.body.city;
     var state = req.body.state;
     var logo= req.body.logo;
     var members= req.body.members;
     console.log(members);
      console.log('the logo name is: '+logo);
       console.log('the state name is: '+state);
     // console.log(path.join(__dirname ,logo));
      var paths="C:\\Users\\user1\\Desktop\MUMCourses\\MWA\\CyclePoject\\src\\app\\images";
      var club1= new clubNew({'name':name , 'city':city, 'state':state, 'members':members,
       'logo':path.join(paths,logo), 'location':location});

       club1.save(function(err){
          if(err) console.log('error');
            else console.log('saved the whole club data');
       });
 });


///upload images

router.post('/images',function(req,res,next){
       res.header("Access-Control-Allow-Origin", "*");
       res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
       res.header("Access-Control-Allow-Headers", "Content-Type");
    
      if(req.files){
       var paths="C:\\Users\\user1\\Desktop\MUMCourses\\MWA\\CyclePoject\\src\\app\\images";
        req.files.image.mv( path.join(__dirname,'images',req.files.image.name), function(err){
        if(err){
      }
       console.log('no error');
        res. send('file uploaded');
      })
    }
  });

  router.get('/clubName', function(req,res,next){
      var name= req.query.name;
       var query= {'name':name};

       clubNew.find(query).exec(function(err,data){
             res.json(data);
       })
  })

module.exports = router;
