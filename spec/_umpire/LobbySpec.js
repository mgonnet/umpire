const Umpire = require('../../src/umpire')

describe('lobby creation', function () {
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

  it('should allow a connected user to create a lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    let createLobbyMessage = JSON.stringify(['CREATE-LOBBY', { name: 'myLobby' }])
    ws.send(createLobbyMessage)
    let received = await this.waitForMessage(ws)

    expect(received).toBe(`["CREATE-LOBBY-ACCEPTED"]`)
  })

  it('should not allow to create a lobby if another exists with same name', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    let createLobbyMessage = JSON.stringify(['CREATE-LOBBY', { name: 'myLobby' }])
    ws.send(createLobbyMessage)
    let received = await this.waitForMessage(ws)

    expect(received).toBe(`["CREATE-LOBBY-ACCEPTED"]`)

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })

    ws2.send(createLobbyMessage)
    received = await this.waitForMessage(ws2)

    expect(received).toBe(`["CREATE-LOBBY-REJECTED",{"reason":"Lobby name already exists"}]`)
  })

  it('should not allow to create a lobby if the player is already in a lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    let createLobbyMessage = JSON.stringify(['CREATE-LOBBY', { name: 'myLobby' }])
    ws.send(createLobbyMessage)
    let received = await this.waitForMessage(ws)
    expect(received).toBe(`["CREATE-LOBBY-ACCEPTED"]`)

    let createOtherLobbyMessage = JSON.stringify(['CREATE-LOBBY', { name: 'myOtherLobby' }])
    ws.send(createOtherLobbyMessage)
    received = await this.waitForMessage(ws)
    expect(received).toBe(`["CREATE-LOBBY-REJECTED",{"reason":"User already in lobby"}]`)
  })

  it('should allow the creator to close the lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    let createLobbyMessage = JSON.stringify(['CREATE-LOBBY', { name: 'myLobby' }])
    ws.send(createLobbyMessage)
    let received = await this.waitForMessage(ws)
    expect(received).toBe(`["CREATE-LOBBY-ACCEPTED"]`)

    let closeLobbyMessage = JSON.stringify(['CLOSE-LOBBY'])
    ws.send(closeLobbyMessage)
    received = await this.waitForMessage(ws)
    expect(received).toBe(`["CLOSE-LOBBY-ACCEPTED"]`)
  })

  it('should not allow to close a lobby if the user is not in one', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    let closeLobbyMessage = JSON.stringify(['CLOSE-LOBBY'])
    ws.send(closeLobbyMessage)
    let received = await this.waitForMessage(ws)
    expect(received).toBe(`["CLOSE-LOBBY-REJECTED",{"reason":"User is not in a lobby"}]`)
  })

  it('should allow users to join an existing lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    let createLobbyMessage = JSON.stringify(['CREATE-LOBBY', { name: 'myLobby' }])
    ws.send(createLobbyMessage)
    let received = await this.waitForMessage(ws)
    expect(received).toBe(`["CREATE-LOBBY-ACCEPTED"]`)

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    let joinLobbyMessage = JSON.stringify(['JOIN-LOBBY', { name: 'myLobby' }])
    ws2.send(joinLobbyMessage)
    received = await this.waitForMessage(ws2)
    expect(received).toBe(`["JOIN-LOBBY-ACCEPTED"]`)
  })

  it('should not allow users to join a lobby while on another lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    let createLobbyMessage = JSON.stringify(['CREATE-LOBBY', { name: 'myLobby' }])
    ws.send(createLobbyMessage)
    let received = await this.waitForMessage(ws)
    expect(received).toBe(`["CREATE-LOBBY-ACCEPTED"]`)

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    let joinLobbyMessage = JSON.stringify(['JOIN-LOBBY', { name: 'myLobby' }])
    ws2.send(joinLobbyMessage)
    received = await this.waitForMessage(ws2)
    expect(received).toBe(`["JOIN-LOBBY-ACCEPTED"]`)

    ws2.send(joinLobbyMessage)
    received = await this.waitForMessage(ws2)
    expect(received).toBe(`["JOIN-LOBBY-REJECTED",{"reason":"User is already in a lobby"}]`)
  })
})
