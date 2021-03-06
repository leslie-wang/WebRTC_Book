var static = require('node-static');
var https = require('https');
var fs = require('fs');
// Create a node-static server instance
var file = new(static.Server)();

// We use the https module�s createServer function and
// rely on our instance of node-static to serve the files
var options = {
	key: fs.readFileSync('tls/server.key', 'utf8'),
	cert: fs.readFileSync('tls/server.crt', 'utf8')
};
var app = https.createServer(options, function (req, res) {
  file.serve(req, res);
}).listen(8181);

// Use socket.io JavaScript library for real-time web applications
var io = require('socket.io').listen(app);

// Let's start managing connections...
io.sockets.on('connection', function (socket){

    	// Handle 'message' messages
        socket.on('message', function (message) {
                log('S --> got message: ', message);
                // channel-only broadcast...
                //Below does not work since message.channel is null
                //socket.broadcast.to(message.channel).emit('message', message);
                socket.broadcast.emit('message', message);
        });

        // Handle 'create or join' messages
        socket.on('create or join', function (room) {
                // Below throws an exception on newer versions of sockets.io
                //var numClients = io.sockets.clients(room).length;
                var clients = io.sockets.adapter.rooms[room];
                var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length - 1 : 0;

                log('S --> Room ' + room + ' has ' + numClients + ' client(s)');
                log('S --> Request to create or join room', room);

                // First client joining...
                if (numClients == 0){
                        socket.join(room);
                        socket.emit('created', room);
                } else if (numClients == 1) {
                // Second client joining...
                        io.sockets.in(room).emit('join', room);
                        socket.join(room);
                        socket.emit('joined', room);
                } else { // max two clients
                        socket.emit('full', room);
                }
        });

        function log(){
            var array = [">>> "];
            for (var i = 0; i < arguments.length; i++) {
            	array.push(arguments[i]);
            }
            socket.emit('log', array);
        }
});
