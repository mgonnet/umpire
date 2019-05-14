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

    await this.createLobby({ ws, lobbyName: 'myLobby' })
  })

  it('should not allow to create a lobby if another exists with same name', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    await this.createLobby({
      ws: ws2,
      lobbyName: 'myLobby',
      expectedMessage: '["CREATE-LOBBY-REJECTED",{"reason":"Lobby name already exists"}]'
    })
  })

  it('should not allow to create a lobby if the player is already in a lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    await this.createLobby({
      ws,
      lobbyName: 'myLobby2',
      expectedMessage: `["CREATE-LOBBY-REJECTED",{"reason":"User already in lobby"}]`
    })
  })

  it('should allow the creator to close the lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    await this.closeLobby({ ws })
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

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    await this.joinLobby({ ws: ws2, lobbyName: 'myLobby' })
  })

  it('should not allow users to join a lobby while on another lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    await this.joinLobby({ ws: ws2, lobbyName: 'myLobby' })

    await this.joinLobby({
      ws: ws2,
      lobbyName: 'myLobby',
      expectedMessage: `["JOIN-LOBBY-REJECTED",{"reason":"User is already in a lobby"}]` })
  })

  it('should not allow users to join an unexisting lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()

    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    await this.joinLobby({
      ws,
      lobbyName: 'myLobby',
      expectedMessage: `["JOIN-LOBBY-REJECTED",{"reason":"Lobby does not exist"}]` })
  })

  it('should not allow users other than the creator to close the lobby', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    await this.joinLobby({ ws: ws2, lobbyName: 'myLobby' })

    let closeLobbyMessage = JSON.stringify(['CLOSE-LOBBY'])
    ws2.send(closeLobbyMessage)
    let received = await this.waitForMessage(ws2)
    expect(received).toBe(`["CLOSE-LOBBY-REJECTED",{"reason":"Player is not the lobby creator"}]`)
  })

  it('should allow users to leave the lobby they are in', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    await this.joinLobby({ ws: ws2, lobbyName: 'myLobby' })

    let leaveLobbyMessage = JSON.stringify(['LEAVE-LOBBY'])
    ws2.send(leaveLobbyMessage)
    let received = await this.waitForMessage(ws2)
    expect(received).toBe(`["LEAVE-LOBBY-ACCEPTED"]`)
  })

  it('should allow users to join a lobby if they were inside one, but then left', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    await this.joinLobby({ ws: ws2, lobbyName: 'myLobby' })

    let leaveLobbyMessage = JSON.stringify(['LEAVE-LOBBY'])
    ws2.send(leaveLobbyMessage)
    let received = await this.waitForMessage(ws2)
    expect(received).toBe(`["LEAVE-LOBBY-ACCEPTED"]`)

    await this.joinLobby({ ws: ws2, lobbyName: 'myLobby' })
  })

  it('should not allow a user to leave a lobby if they are not in one', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    let leaveLobbyMessage = JSON.stringify(['LEAVE-LOBBY'])
    ws.send(leaveLobbyMessage)
    let received = await this.waitForMessage(ws)
    expect(received).toBe(`["LEAVE-LOBBY-REJECTED",{"reason":"Player is not the inside a lobby"}]`)
  })

  it('should notify to all the players of a lobby when a new player joins', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })

    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    let joinLobbyMessage = JSON.stringify(['JOIN-LOBBY', { name: 'myLobby' }])
    ws2.send(joinLobbyMessage)
    let [msgP1, msgP2] = await Promise.all([this.waitForMessage(ws), this.waitForMessage(ws2)])
    expect(msgP2).toBe(`["JOIN-LOBBY-ACCEPTED"]`)
    expect(msgP1).toBe(`["JOINED-LOBBY",{"player":"rataplan"}]`)
  })

  it('should allow players to join other lobbies after the one they were in was closed', async function () {
    spyOn(console, 'log')
    await umpire.start()
    const ws = await this.registerUser({ url: 'ws://localhost', port, userName: 'useloom' })
    const ws2 = await this.registerUser({ url: 'ws://localhost', port, userName: 'rataplan' })
    const ws3 = await this.registerUser({ url: 'ws://localhost', port, userName: 'ElgoLazo' })

    await this.createLobby({ ws, lobbyName: 'myLobby' })
    await this.createLobby({ ws: ws3, lobbyName: 'myOtherLobby' })

    await this.joinLobby({ ws: ws2, lobbyName: 'myLobby' })

    await this.closeLobby({ ws: ws })
    let received = await this.waitForMessage(ws2) // Joined players also receive a notification
    expect(received).toBe('["CLOSE-LOBBY-ACCEPTED"]')

    await this.joinLobby({ ws: ws2, lobbyName: 'myOtherLobby' })
    await this.joinLobby({ ws: ws, lobbyName: 'myOtherLobby' })
  })
})
