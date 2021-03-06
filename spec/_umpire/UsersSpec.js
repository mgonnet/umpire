const Umpire = require(`../../src/umpire`)
const WebSocket = require(`ws`)
const Chess = require(`chess.js`).Chess

describe(`user connections`, function () {
  const port = 8080
  let umpire

  beforeEach(function () {
    umpire = Umpire({ port, game: Chess })
  })

  afterEach(async function () {
    // Try to close in case something failed in the test case
    try {
      await umpire.close()
    } catch (e) {

    }
  })

  it(`should accept a user that had not been used before`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const message = JSON.stringify([ `REGISTER`, { name: `useloom` } ])

    const ws = new WebSocket(`ws://localhost:8080`)

    ws.on(`open`, function open () {
      ws.send(message)
    })

    const received = await this.waitForMessage(ws)

    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    await umpire.close()
  })

  it(`should reject a user that is already in use`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const message = JSON.stringify([ `REGISTER`, { name: `useloom` } ])

    const ws = new WebSocket(`ws://localhost:8080`)

    ws.on(`open`, function open () {
      ws.send(message)
    })

    let received = await this.waitForMessage(ws)

    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    const ws2 = new WebSocket(`ws://localhost:8080`)

    ws2.on(`open`, function open () {
      ws2.send(message)
    })

    received = await this.waitForMessage(ws2)

    expect(received).toBe(`["REGISTER-REJECTED",{"reason":"User name taken - useloom"}]`)

    await umpire.close()
  })

  it(`should allow a user to leave`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const message = JSON.stringify([ `REGISTER`, { name: `useloom` } ])

    const ws = new WebSocket(`ws://localhost:8080`)

    ws.on(`open`, function open () {
      ws.send(message)
    })

    let received = await this.waitForMessage(ws)

    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    const leaveMessage = JSON.stringify([`LEAVE-SERVER`])
    ws.send(leaveMessage)

    received = await this.waitForMessage(ws)

    expect(received).toBe(`["LEAVE-SERVER-ACCEPTED"]`)

    await umpire.close()
  })

  it(`should allow a user to register again`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const message = JSON.stringify([ `REGISTER`, { name: `useloom` } ])

    const ws = new WebSocket(`ws://localhost:8080`)

    ws.on(`open`, function open () {
      ws.send(message)
    })

    let received = await this.waitForMessage(ws)

    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    const leaveMessage = JSON.stringify([`LEAVE-SERVER`])
    ws.send(leaveMessage)

    received = await this.waitForMessage(ws)

    expect(received).toBe(`["LEAVE-SERVER-ACCEPTED"]`)

    const ws2 = new WebSocket(`ws://localhost:8080`)

    ws2.on(`open`, function open () {
      ws2.send(message)
    })

    received = await this.waitForMessage(ws2)

    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    await umpire.close()
  })

  it(`should close the connection when a user leaves`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const message = JSON.stringify([ `REGISTER`, { name: `useloom` } ])

    const ws = new WebSocket(`ws://localhost:8080`)

    ws.on(`open`, function open () {
      ws.send(message)
    })

    let received = await this.waitForMessage(ws)

    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    const leaveMessage = JSON.stringify([`LEAVE-SERVER`])

    received = this.waitForMessage(ws)

    ws.send(leaveMessage)
    const [messageReceived, isClosed] = await Promise.all([
      this.waitForMessage(ws),
      new Promise(function (resolve, reject) {
        ws.on(`close`, function (code, reason) {
          resolve(true)
        })
      })
    ])

    expect(messageReceived).toBe(`["LEAVE-SERVER-ACCEPTED"]`)
    expect(isClosed).toBe(true)

    await umpire.close()
  })

  it(`should not allow a user to register with a different name while still connected`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const message = JSON.stringify([ `REGISTER`, { name: `useloom` } ])

    const ws = new WebSocket(`ws://localhost:8080`)

    ws.on(`open`, function open () {
      ws.send(message)
    })

    let received = await this.waitForMessage(ws)
    expect(received).toBe(`["REGISTER-ACCEPTED"]`)

    const message2 = JSON.stringify([ `REGISTER`, { name: `rataplan` } ])
    ws.send(message2)
    received = await this.waitForMessage(ws)
    expect(received).toBe(`["REGISTER-REJECTED",{"reason":"User already registered"}]`)

    await umpire.close()
  })
})
