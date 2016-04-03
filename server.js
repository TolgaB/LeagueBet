var http = require('http');

var app = http.createServer(function(req, res) {
  console.log('createServer');
});
app.listen(4210);

var io = require('socket.io').listen(app);
var mongoose = require('mongoose');
mongoose.connect('mongodb://tester:test@ds023118.mlab.com:23118/league');
var rest = require('rest');
var rest, mime, client;
rest = require('rest'),
mime = require('rest/interceptor/mime'); 
client = rest.wrap(mime);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function() {
  console.log("connected to mongodb");

  getGames();
});


var userSchema = mongoose.Schema ({

  name : String,
  email : String,
  password : String,
     }, {collection: 'User'});

var user = mongoose.model('User', userSchema);

var gameSchema = mongoose.Schema ({
  gameId: String,
  gameStartTime: String,
  gameType: String,
  Player1Id: String
}, {collection: 'Games'});

var game = mongoose.model('Game', gameSchema);

var wageSchema == mongoose.Schema ({
	gameId: String,
	gameStartTime: String,
	summoner1Name: String,
	ParticipantDictionary: Array,
}, {collection: 'Wages'})
io.on('connection', function(socket){


  console.log('a user connected');
      socket.on('registerUser', function (userName, password, email) {
        console.log("registerusercalled");
      //Add code to check for same usernames, add to the db database and send response
    var tempUser = user({name: userName, email : email, password : password})
      console.log(userName, password, email);

    var tempId = socket['id'];

    user.findOne({name : userName}, function(err,obj) { 

      console.log("test 6");
    console.log(obj); 
    if (obj == null) {
      console.log("nothing there");

     tempUser.save(function (err, tempUser) {

        if (err) {
          return console.error(err);
          //Broadcast that the registration failed
          
         socket.emit('registerUnsuccesfull', "nowork");
        } 
          console.log("Sent properly");
          socket.emit('registerSuccesfull', userName);
      });

    }

    else {
    console.log("there is something there")

    socket.emit('registerUnsuccesfull', "nowork");
    }
    });
    });

    socket.on('loginUser', function (email, password) {
      //Check the db database
    user.findOne({email : email, password : password}, function(err,obj) { 

    console.log(obj); 
    if (obj == null) {
      console.log('could not find');
      socket.emit('loginUnsuccessfull', "didnotwork");

    }
    else {
    console.log("login worked");
    socket.emit('loginSuccesfull', "worked");

    }
    });
      
    });

    socket.on('getCurrentGames', function() {
      var responser;
      client({ path: 'http://spectator.na.lol.riotgames.com:80/observer-mode/rest/featured?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb' }).then(function(response) {
      console.log(response.entity);
      socket.emit('currentGame', response.entity.gameList);        
       });
  
    });

	socket.on('setUpWager', function(gameId, gameStartTime, summoner1Name, sideBetOn) {
		
	});    

	function checkForWin() {
		console.log("testing");
	}

    
        });

function getGames() {
client({ path: 'http://spectator.na.lol.riotgames.com:80/observer-mode/rest/featured?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb' }).then(function(response) {
  
    return(response.entity.gameList); 

});
}

//Might not use these
function pullUpInfoOnSpecificGame(gameId) {
  
client({ path:'https://na.api.pvp.net/api/lol/na/v2.2/match/'+gameId+'?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb' }).then(function(response) {
    console.log(response.entity);
    return(response.entity);  
});

}
//To tell if the league of legends game has ended
function didGameEnd(gameId) {

}