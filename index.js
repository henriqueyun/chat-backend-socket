const httpServer = require("http").createServer();
let port = 3000;

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  }
});

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log('Received from client (' + socket.id + '): ' + message, 'passing to room (xet)', message.xetId)
    io  
      .to(message.xetId)
      .emit('broadcast', message)
    io  
      .to(message.xetId)
      .emit('message', message)
  }).on('disconnect', () => {
    console.log('disconnected', socket.id)
  }).on('join', xetId => {
    console.log('ROOMS', io.of('/').adapter.rooms)
    socket.join(xetId)
  }).on('leave', xetId => {
    console.log(socket.id + ' leaving ' + xetId, ' room')
    socket.leave(xetId)
  })
});

httpServer.listen(port, function () {
  console.log('listening / on ' + port)
}); 
