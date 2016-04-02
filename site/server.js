var express = require('express');
var app = express();
// 

app.use(express.static(__dirname + "")); //use static files in ROOT/public folder

 app.get('/', function(req, res) {
    res.sendFile('index.html',{ root: __dirname });

});
 
 app.get('/register', function(req,res){
 	    res.sendFile('register.html',{ root: __dirname });

 });
app.get('/login', function(req, res) {
    res.sendFile('login.html',{ root: __dirname });

});

app.get('/dashboard', function(req, res) {
    res.sendFile('dashboard.html',{ root: __dirname });
});

app.get('/logout', function(req,res){
	res.sendFile('logout.html',{root:__dirname});
});



var port=8000;
app.listen(port);
console.log("running at " + port);


