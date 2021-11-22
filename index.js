
const httpServer = require("http").createServer();
let port = 3000;

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  }
});

io.on("connection", (socket) => {
  io.sockets.emit('broadcast', 'Client connected (' + socket.id + ')')
  socket.on("message", (message) => {
    console.log('Received from client (' + socket.id + '): ' + message)
    io.sockets.emit('broadcast', socket.id + ' says ' + message)
  })
});

io.on("disconnect", (reason) => {
  console.log('Disconnect')
});

httpServer.listen(port, function() {
  console.log('listening / on ' + port)
}); 
