// Set up the port
var port = process.env.PORT || 8080;

// Require the necessary modules
var path = require("path");
var random = require("random-js")();
var express = require('express');
var app = express();
var server = app.listen(port);
var io = require('socket.io')(server);

// Serve up the client-side code from public/ to the root (e.g. 127.0.0.1:8080/)
var publicPath = path.join(__dirname, 'public');
var staticServer = express.static(publicPath);
app.use(staticServer);

// Real time communication
// In this example, the server is just a relay that passes on information
io.on('connection', function (socket) {
	console.log('a user connected');

	// Player Drawing
	// Get the drawing information from the client and pass it on to all 
	// other clients
	socket.on("player drawing", function(drawData) {
		socket.broadcast.emit("player drawing", drawData);	
	});

	// Player Disconnect
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});