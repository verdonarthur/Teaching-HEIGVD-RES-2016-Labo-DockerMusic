'use strict';

const express = require('express');

// Constants
const PORT = 9456;

// programm arg
var typeOfMusician = process.argv[2];

/**
* function who define the message to send
*/
function soundToSend(typeOfMusician){
  switch (typeOfMusician) {
    case "piano":
      return "piano";
      break;
    default:
      return "default"
      break;

  }
};


var dgram = require('dgram');
var server = dgram.createSocket("udp4");
server.bind();
//server.setBroadcast(true);

setInterval(sendSound, 3000);

function sendSound() {
    var message = new Buffer(soundToSend(typeOfMusician));
    server.send(message, 0, message.length, PORT, 'localhost');
    console.log("Sent " + message);
    //server.close();
}
