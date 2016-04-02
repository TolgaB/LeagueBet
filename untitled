
var mongoose = require('mongoose');
mongoose.connect('mongodb://Admin:adminboi@ds015710.mlab.com:15710/leaguebet');
var rest = require('rest');
var rest, mime, client;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
rest = require('rest'),
mime = require('rest/interceptor/mime'); 
client = rest.wrap(mime);

io.on('connection', function(socket){
  console.log('a user connected');
      socket.on('register', function(userName, Password){

        });
});


function getGames() {
client({ path: 'http://spectator.na.lol.riotgames.com:80/observer-mode/rest/featured?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb' }).then(function(response) {
   // console.log(response.entity.gameList[0]);
    return(response.entity.gameList);  
});
}
//Might not use these
function pullUpInfoOnSpecificGame(gameId) {
  /*
client({ path:'https://na.api.pvp.net/api/lol/na/v2.2/match/'gameId'?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb' }).then(function(response) {
    console.log(response.entity);
    return(response.entity);  
});
*/
}
//To tell if the league of legends game has ended
function didGameEnd(gameId) {

}