'use strict';

const express = require('express');
var typeOfMusician = process.argv[2];
// Constants
const PORT = 8080;


const MESSAGE_TO_SEND = function soundToSend(typeOfMusician){
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
    var message = new Buffer(MESSAGE_TO_SEND);
    server.send(message, 0, message.length, PORT, 'localhost');
    console.log("Sent " + message);
    //server.close();
}
