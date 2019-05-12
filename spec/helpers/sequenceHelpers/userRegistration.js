const WebSocket = require('ws')

async function registerUser ({ url, port, userName }) {
  let registerMessage = JSON.stringify([ 'REGISTER', { name: userName } ])
  const ws = new WebSocket(`${url}:${port}`)

  ws.on('open', function open () {
    ws.send(registerMessage)
  })

  let message = await this.waitForMessage(ws)
  expect(message).toBe(`["REGISTER-ACCEPTED"]`)
  return ws
}

beforeEach(function () {
  this.registerUser = registerUser
})
