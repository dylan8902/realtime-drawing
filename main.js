// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'realtime-drawing';

// Port where we'll run the websocket server
var webSocketsServerPort = 27285;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

// list of currently connected clients (users)
var clients = [ ];

/**
 * HTTP server
 */
var httpServer = http.createServer(function(request, response) {
});

httpServer.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    httpServer:  httpServer
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    console.log((new Date()) + " Peer " + index + " connected.");

    // user sent some message
    connection.on('message', function(message) {
        for (var i=0; i < clients.length; i++) {
            clients[i].send(message.utf8Data);
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer " + index + " disconnected.");
        // remove user from the list of connected clients
        clients.splice(index, 1);
    });

});