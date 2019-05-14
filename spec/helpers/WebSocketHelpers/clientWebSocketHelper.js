const WebSocket = require(`ws`)

function sendWsClientMessage ({ url, message }) {
  const ws = new WebSocket(`ws://localhost:8080`)

  ws.on(`open`, function open () {
    ws.send(message)
  })
}

function waitForMessage (ws) {
  return new Promise(function (resolve, reject) {
    ws.on(`message`, function messageReceived (message) {
      resolve(message)
    })
  })
}

beforeEach(function () {
  this.sendWsClientMessage = sendWsClientMessage
  this.waitForMessage = waitForMessage
})
