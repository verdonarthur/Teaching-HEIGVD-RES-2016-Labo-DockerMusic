
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// Listen for emission of the "message" event.
server.on('message', function (message) {
    console.log('received a message: ' + message);
});

// Bind to port 4000
var port = 9456;
server.bind(port);

server.on("listening", function () {
    var address = server.address();
    console.log("I am listening on " +
        address.address + ":" + address.port);
});
