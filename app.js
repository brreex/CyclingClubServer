var express = require('express');
var bodyParser  = require('body-parser');
var index = require('./routes/index');
var app = express();
var mongo = require('mongoskin');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
mongoose.connect('mongodb://localhost:27017/CyclingClub');

var jwt    = require('jsonwebtoken');
var servertoken = require('./routes/apikey');
var location = require('./routes/location');
var post = require('./routes/posts');
var club = require('./routes/clubs');

var fileupload = require('express-fileupload');

var config = require('./models/config'); 
var User   = require('./models/user');

var db = mongo.db('mongodb://127.0.0.1:27017/CyclingClub',{native_parser:true});
db.bind('message');


app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileupload());
app.use(morgan('dev'));
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var users = [];
var connections = [];

http.listen(3000,function(){
  console.log('Chat Server on port 3000')
});


// app.all('*',function(req,res,next){
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   next();
// });


// app.use(function(req, res, next) {
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   if (token) {
//     jwt.verify(token, servertoken+'', function(err, decoded) {      
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         req.decoded = decoded;    
//         next();
//       }
//     });
//   } else {
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     }); 
//   }
// });




app.use('/location',location);
app.use('/posts',post)
app.use('/clubs',club);

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// app.get('/',function(req,res){
//   res.sendFile(__dirname+'/index.html');
// });

io.sockets.on('connection',function(socket){
  // send chat history 
  // socket.on('username',function(uname){
  //   console.dir(uname.name);
  //   console.log(socket.id);
  //   users.push({
  //     id:socket.id,
  //     username:uname
  //   });
  // });

  console.log(socket.id);
  db.message.find({}).each(function(err,data){
    if(data!=null)
      io.sockets.emit('chatHistory',data);
  });

  connections.push(socket);
  console.log('%s Users Connected',connections.length);
  socket.on('disconnect',function(){
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected %s socketes connected',connections.length);
  });

  socket.on('newMessage',function(data){

    //send to reciever only
    //socket.broadcast.to(data.toId).emit('chatUpdate',data);

      io.sockets.emit('chatUpdate',data);
      // save message into database
     db.message.insert(data,function(err,doc){
        if(err)
          console.log(err)
        console.dir('Chat Save'+doc);
      });
      console.log(data);
  });
})
app.listen(3200,function(){
  console.log('Express Listening on 3200');
});
