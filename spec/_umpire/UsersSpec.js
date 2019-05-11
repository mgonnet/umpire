const Umpire = require('../../src/umpire')
const WebSocket = require('ws')

describe('umpire server start', function () {
  let port = 8080
  let umpire

  beforeEach(function () {
    umpire = Umpire({ port })
  })

  afterEach(async function () {
    // Try to close in case something failed in the test case
    try {
      await umpire.close()
    } catch (e) {

    }
  })

  it('should accept a user that had not been used before', async function () {
    spyOn(console, 'log')
    await umpire.start()
    let message = JSON.stringify([ 'REGISTER', { name: 'useloom' } ])

    const ws = new WebSocket('ws://localhost:8080')

    ws.on('open', function open () {
      ws.send(message)
    })

    let received = await new Promise(function (resolve, reject) {
      ws.on('message', function messageReceived (message) {
        resolve(message)
      })
    })

    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    await umpire.close()
  })

  it('should reject a user that is already in use', async function () {
    spyOn(console, 'log')
    await umpire.start()
    let message = JSON.stringify([ 'REGISTER', { name: 'useloom' } ])

    const ws = new WebSocket('ws://localhost:8080')

    ws.on('open', function open () {
      ws.send(message)
    })

    let received = await new Promise(function (resolve, reject) {
      ws.on('message', function messageReceived (message) {
        resolve(message)
      })
    })

    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    ws.send(message)

    received = await new Promise(function (resolve, reject) {
      ws.on('message', function messageReceived (message) {
        resolve(message)
      })
    })

    expect(received).toBe(`["REGISTER-REJECTED"]`)

    await umpire.close()
  })
})
