/* Imports */
const dgram = require('dgram');
const net = require('net');
const moment = require('moment');

const conf = require('./config.json');
const instruments = require('./instruments.json');

/* Global */
const UDPSocket = dgram.createSocket('udp4');
const server = net.createServer();

const soundMap = mapSoundInst(instruments);
var music = new Map();

/* Functions */
function mapSoundInst(instArray) {
    var result = new Map();
    instArray.forEach(function(inst){
        result.set(inst.sound, inst.name);
    });

    return result;
}

function flushInactive() {
    music.forEach(function(sound) {
        if (+moment() - sound.timestamp > conf.inactive_delay) {
            music.delete(sound.uuid);
        }
    });
}

function makePayload() {
    flushInactive();
    var result = [];
    console.log(music.size);
    music.forEach(function(sound, uuid) {
        var inst = {
            "uuid": uuid,
            "instrument": soundMap.get(sound.sound),
            "activeSince": moment(sound.timestamp).toISOString()
        }

        result.push(inst);
    });

    return JSON.stringify(result);
}

/* Events listeners */
UDPSocket.on('listening', function() {
    UDPSocket.addMembership(conf.multicast_adr);
    console.log("Now listening for UDP trafic on %s:%d", conf.multicast_adr, conf.udp_port);
});

UDPSocket.on('message', function(msg, info) {
  console.log('Heard a sound from %s:%d', info.address, info.port);
  var data = JSON.parse(msg);

  music.set(data.uuid, data);
});

server.on('listening', function() {
    console.log("Now listening for TCP trafic on %s:%d", server.address(), conf.tcp_port);
});

server.on('connection', function(socket) {
    socket.end(makePayload());
    console.log("Payload sent to %s:%d", socket.remoteAddress, socket.remotePort);
});

/* Main */
UDPSocket.bind(conf.udp_port);
server.listen(conf.tcp_port);
