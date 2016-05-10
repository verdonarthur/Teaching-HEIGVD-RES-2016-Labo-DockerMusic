/* Imports */
const dgram = require('dgram');
const uuid = require('uuid');
const moment = require('moment');

const conf = require('./config.json');
const instruments = require('./instruments.json');

/* Global */
const socket = dgram.createSocket('udp4');

const instMap = mapInstSound(instruments);
const appId = uuid.v4();
const sound = instMap.get(process.argv[2]);

/* Functions*/
function mapInstSound(instArray) {
    var result = new Map();
    instArray.forEach(function(inst){
        result.set(inst.name, inst.sound);
    });

    return result;
}

function makeMessage() {
    var data = {
        "uuid": appId,
        "sound": sound,
        "timestamp": +moment()
    };

    return JSON.stringify(data);
}

function emitSound() {
    var msg = new Buffer(makeMessage());
    socket.send(msg, 0, msg.length, conf.udp_port, conf.multicast_adr, function(err) {
      if (err) {
          console.log("An error occured while emmiting sound")
          console.log(err);
      }
      else {
          console.log("Sound emitted");
      }
    });
}

/* Main */
if (sound == undefined) {
    throw "Unknow instrument";
}

setInterval(emitSound, conf.interval);
