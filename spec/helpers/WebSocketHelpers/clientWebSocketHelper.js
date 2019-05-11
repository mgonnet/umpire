const WebSocket = require('ws')

function sendWsClientMessage ({ url, message }) {
  const ws = new WebSocket('ws://localhost:8080')

  ws.on('open', function open () {
    ws.send(message)
  })
}

beforeEach(function () {
  this.sendWsClientMessage = sendWsClientMessage
})
