var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(4210);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.use(express.static('public'));

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
  bitcoinKey: String
     }, {collection: 'User'});

var user = mongoose.model('User', userSchema);

var gameSchema = mongoose.Schema ({
  gameId: String,
  gameStartTime: String,
  gameType: String,
  Player1Id: String
}, {collection: 'Games'});

var game = mongoose.model('Game', gameSchema);

var wageSchema = mongoose.Schema ({
	gameId: String,
	gameStartTime: String,
	summoner1Name: String,
	ParticipantDictionary: Array,
}, {collection: 'Wages'});

var wage = mongoose.model('Wage', wageSchema);
io.on('connection', function(socket){
  console.log('a user connected');
      socket.on('registerUser', function (userName, password, email) {
        console.log("registerusercalled");
      //Add code to check for same usernames, add to the db database and send response
    var tempUser = user({name: userName, email : email, password : password});
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

    socket.on('addBitcoinKey', function(bitcoinKeyr, userEmails) {
    	user.findOne({userEmail: userEmails}, function (err, doc) {
    		docs.bitcoinKey = bitcoinKeyr;
    	});
    });



	socket.on('setUpWager', function(gameIds, gameStartTime, summoner1Name, sideBetOn, userEmail) {
		//check if there is already an existing wager with gameId
		wage.findOne({gameId : gameIds}, function(err,obj) { 
    	console.log(obj); 
		   	 if (obj == null) {
		   	 	//Its an original

		   	 	var tempArray = [summoner1Name, sideBetOn, userEmail];
		   	 	var tempWage = wage({gameId: gameIds,gameStartTime: gameStartTime,summoner1Name: summoner1Name, sideBetOn: sideBetOn, ParticipantDictionary: tempArray});
		   	 	tempWage.save(function (err, tempUser) {
        		if (err) {
        			console.log("error trying to put the wage into the database");
        				}
        	    else {
        	    	console.log("succesfully pushed the wage to the database");
        	    }

		   	 });
		   	 }
		   	 else {
		   	 	//already been taken add as a participant
		   	 	wage.findOne({ gameId: gameIds}, function (err, doc){
		   	 		doc.ParticipantDictionary[doc.ParticipantDictionary.length] = summoner1Name;
		   	 		doc.ParticipantDictionary[doc.ParticipantDictionary.length + 1] = sideBetOn;
		   	 	});
		   	 }
		});    
        });
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

setInterval(function(){ 
    wage.find({}, function(err, obj) {
	for (var i = 0; i < obj.length; i++) {
		console.log(obj);
		var summonerName = obj[i].summoner1Name;
		var gameStartTime = obj[i].gameStartTime;
		var didWin = lookForGame(summonerName, gameStartTime, obj[i]);
	}
	});  
}, 5000);


function distributePrizes(didWin, summoner) {
//search through the participants and they're bets according to this send them bitcoin or keep theyre bitcoin
var Server = require('coinbase').Client;

var server = new Server({
  'apiKey': '5uVjwIev2ASxTszr',
  'apiSecret': 'INl7fOXNI5k9Eqld3iPXCxS4oVXzUf6x',
  'baseApiUri': 'https://api.sandbox.coinbase.com/v2/',
  'tokenUri': 'https://api.sandbox.coinbase.com/oauth/token'
});


var Client = require('coinbase').Client;

var client = new Client({
  'apiKey': 'Hc0mYX0KDEaGusU0',
  'apiSecret': 'GCG1eza4ZhfTfEZ88Zkq4G2fUc9uSArZ',
  'baseApiUri': 'https://api.sandbox.coinbase.com/v2/',
  'tokenUri': 'https://api.sandbox.coinbase.com/oauth/token'
});
	if (didWin == "true") {
		console.log("you won");
	server.getAccount('primary', function(err, account) {
				  account.sendMoney({'to': 'mzp8R2rkUrGcho7jpsposT5jLj5RNmPeix',
				                     'amount': '0.01',
				                     'currency': 'BTC'}, function(err, tx) {
				    console.log(tx);
				  });
				});
				
	}
	else if (didWin == "false") {
		console.log("you lost");
		client.getAccount('primary', function(err, account) {
				  account.sendMoney({'to': 'mhRyJ1abp8pHS43T6SZC7tTuUmmyP2fPBE',
				                     'amount': '0.01',
				                     'currency': 'BTC'}, function(err, tx) {
				    console.log(tx);
				  });
				});
	}
	wage.remove({ summoner1Name: summoner }, function(err) {
    if (!err) {
         
    }
    else {
           
    }
});

}




function lookForGame(summoner1Name, gameStartTime, obj) {
	//First search summoner name then get the summonerid, use that to get match id, then get the match data
	//https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Kristian1082?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb
	//https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/summid?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb
	rest('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'+summoner1Name+'?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb').then(function(response) {
    var json = JSON.parse(response.entity);
    var SUMMONER_NAME_NOSPACES = summoner1Name.replace(" ", "");
    SUMMONER_NAME_NOSPACES = SUMMONER_NAME_NOSPACES.toLowerCase().trim();
    var summonerID = json[SUMMONER_NAME_NOSPACES].id;
    console.log(summonerID);
    	rest('https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/'+summonerID+'?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb').then(function(response) {
    		var json = JSON.parse(response.entity);
    		var matches = json["matches"];
    		var matchId = matches[0].matchId;
    		//https://na.api.pvp.net/api/lol/na/v2.2/match/matchid?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb
    		rest('https://na.api.pvp.net/api/lol/na/v2.2/match/'+matchId+'?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb').then(function(response) {
    			var json = JSON.parse(response.entity);
    			var matches = json["participantIdentities"]
    			for (var i = 0; i < matches.length; i++) {
    				if (matches[i].player.summonerName == summoner1Name) {
    					var participantID = matches[i].participantId;
    					var matchParticipants = json["participants"];
    					var repeat = matchParticipants[i].stats.winner;
    					console.log(repeat);
    					var returnValue;
    					if (repeat == true) {
    						returnValue = "true";
    					}
    					else {
    						returnValue = "false";
    					}
    					distributePrizes(returnValue, summoner1Name);
    					return returnValue;
    				}
    			}
    		});
    	});
	});
}



