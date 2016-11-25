var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan"); // morgon do all the request log for our application
config = require("./config"); // here we can write both config and config.js


var app = express();

// Configuring the socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);
// Connect nodejs application to our database (Fisrt need moongose module to connect so install  it using npm)
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(config.database, function(err){
	if(err){
		console.log("Error! in connecting database " + err);
	}else{
		console.log("Connected to the database");
	}
});


// Adding middile-ware
app.use(bodyParser.urlencoded({extended: true})); // True means it can be parse anything - images or string etc, False means it will only parse string
app.use(bodyParser.json()); // will parse json as well
app.use(morgan("dev"));

// Now a middie ware for - any javascript file, css file remaining in public folder will be rander if we not using this then there is no way to use css, js for our index.html
app.use(express.static(__dirname + "/public"));

var api = require("./app/route/api")(app, express, io);
app.use("/api", api);

app.get("*", function(req, res){
	res.sendFile(__dirname + "/public/views/index.html");
});

// Before scoket
/*app.listen(3000, function(err) {
	if(err){
		console.log(err);
	}else{
		console.log("Listening on port 3000 ...")
	}
});*/

// After Socket
http.listen(process.env.PORT || 3000, function(err) {
	if(err){
		console.log(err);
	}else{
		console.log("Listening on port 3000 ...")
	}
});