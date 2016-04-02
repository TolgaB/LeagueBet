var rest = require('rest');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://SOCIALEVENTTHING.firebaseio.com/");
var rest, mime, client;
 
rest = require('rest'),
mime = require('rest/interceptor/mime'); 
client = rest.wrap(mime);

getGames();
function getGames() {
client({ path: 'http://spectator.na.lol.riotgames.com:80/observer-mode/rest/featured?api_key=dd32a661-7717-4722-bcc7-31f53ca42fdb' }).then(function(response) {
    console.log(response.entity.gameList);
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
