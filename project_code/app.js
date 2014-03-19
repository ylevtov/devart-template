var http = require('http'),
    static = require('node-static'),
    fs = require('fs'),
    osc = require('osc-min'),
    dgram = require('dgram'),
    path = require('path'),
    udp = dgram.createSocket('udp4'),
    levels = require('./js/levels'),
    midi = require('midi');

var DynamicsManagerNode = require("./node_classes/DynamicsManagerNode.js");

var outport = 41234;

console.log('Starting...');

// Setup static http server

var clientFiles = new static.Server('./client');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {      
        clientFiles.serve(request, response);
    }).resume();
}).listen(8080);

var manager = new DynamicsManagerNode();


// Setup Socket.io

var io = require('socket.io').listen(8081);

io.set("origins = *");
io.set("log level", 1); // reduce logging

io.sockets.on('connection', function (socket) {

  socket.on('adduser', function(username) {

    manager.addUser(socket, username);

  });

});