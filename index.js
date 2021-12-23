const logger = require('pino')()
logger.level = process.env.LOG_LEVEL
const httpServer = require('http').createServer()

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
  }
})

io.on('connection', (socket) => {
  logger.debug('new connection', socket.id)
  socket.on('message', (message) => {
    logger.debug(`message from client : ${JSON.stringify(message)}`)
    io.to(message.xetId)
      .emit('broadcast', message)
    io.to(message.xetId)
      .emit('message', message)
  }).on('disconnect', () => {
    logger.debug(socket.id, 'disconnected')
  }).on('join', xetId => {
    logger.debug(`${xetId} joining`)
    socket.join(xetId)
  }).on('leave', xetId => {
    logger.debug(`${socket.id} leaving ${xetId} room`)
    socket.leave(xetId)
  })
})

const port = process.env.PORT || 3001

httpServer.listen(port, function () {
  logger.info('web server socket serving at / on ' + port)
})
