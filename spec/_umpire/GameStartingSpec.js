const Umpire = require(`../../src/umpire`)
const Chess = require(`chess.js`).Chess

describe(`game starting`, function () {
  const port = 8080
  let umpire

  beforeEach(function () {
    umpire = Umpire({ port, game: Chess, requiredRoles: [`w`, `b`] })
  })

  afterEach(async function () {
    // Try to close in case something failed in the test case
    try {
      await umpire.close()
    } catch (e) {

    }
  })

  it(`should allow the lobby creator to start a game`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    await this.startTwoPlayersGame({
      creatorName: `useloom`,
      creatorRol: `b`,
      joinerName: `rataplan`,
      joinerRol: `w`,
      port
    })
  })

  it(`should not allow the joiner to start the game`, async function () {
    spyOn(console, `log`)
    await umpire.start()

    const creator = await this.registerUser({ url: `ws://localhost`, port, userName: `useloom` })
    const joiner = await this.registerUser({ url: `ws://localhost`, port, userName: `rataplan` })

    await this.createLobby({ ws: creator, lobbyName: `myLobby` })
    await this.joinLobby({ ws: joiner, lobbyName: `myLobby` })
    await Promise.all([
      this.chooseRol({ ws: creator, rol: `b`, playerName: `useloom` }),
      this.waitForMessage(joiner) // The joiner is notified that the creator choosed rol
    ])
    await Promise.all([
      this.chooseRol({ ws: joiner, rol: `w`, playerName: `rataplan` }),
      this.waitForMessage(creator) // The creator is notified that the joiner choosed rol
    ])

    const startGameMessage = JSON.stringify([`START-GAME`])
    joiner.send(startGameMessage)
    const received = await this.waitForMessage(joiner)

    expect(received).toBe(`["START-GAME-REJECTED",{"reason":"Player is not the lobby creator"}]`)
  })

  it(`should not allow a player to move if it is not his turn`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const { creator } = await this.startTwoPlayersGame({
      creatorName: `useloom`,
      creatorRol: `b`,
      joinerName: `rataplan`,
      joinerRol: `w`,
      port
    })

    creator.send(JSON.stringify([`MOVE`, { move: `e4` }]))
    const received = await this.waitForMessage(creator)

    expect(received).toBe(`["MOVE-REJECTED",{"reason":"Not your turn"}]`)
  })

  it(`should allow a player to move if it is his turn`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const { joiner } = await this.startTwoPlayersGame({
      creatorName: `useloom`,
      creatorRol: `b`,
      joinerName: `rataplan`,
      joinerRol: `w`,
      port
    })

    joiner.send(JSON.stringify([`MOVE`, { move: `e4` }]))
    const received = await this.waitForMessage(joiner)

    expect(received).toBe(`["MOVE-ACCEPTED",{"name":"rataplan","move":"e4","turn":"b"}]`)
  })

  it(`should notify all players when someone makes a move`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const { creator, joiner } = await this.startTwoPlayersGame({
      creatorName: `useloom`,
      creatorRol: `b`,
      joinerName: `rataplan`,
      joinerRol: `w`,
      port
    })

    await this.makeMove(joiner, creator, `rataplan`, `e4`, `b`)
  })

  it(`should allow the next player to move after the first move`, async function () {
    spyOn(console, `log`)
    await umpire.start()

    const { creator, joiner } = await this.startTwoPlayersGame({
      creatorName: `useloom`,
      creatorRol: `b`,
      joinerName: `rataplan`,
      joinerRol: `w`,
      port
    })

    await this.makeMove(joiner, creator, `rataplan`, `e4`, `b`)
    await this.makeMove(creator, joiner, `useloom`, `e5`, `w`)
  })

  it(`should not allow invalid moves`, async function () {
    spyOn(console, `log`)
    await umpire.start()

    const { joiner } = await this.startTwoPlayersGame({
      creatorName: `useloom`,
      creatorRol: `b`,
      joinerName: `rataplan`,
      joinerRol: `w`,
      port
    })

    joiner.send(JSON.stringify([`MOVE`, { move: `tu abuela` }]))
    const received = await this.waitForMessage(joiner)

    expect(received).toBe(`["MOVE-REJECTED",{"reason":"Invalid move"}]`)
  })

  it(`should allow a player to make a complex move if it is his turn`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    const { joiner } = await this.startTwoPlayersGame({
      creatorName: `useloom`,
      creatorRol: `b`,
      joinerName: `rataplan`,
      joinerRol: `w`,
      port
    })

    joiner.send(JSON.stringify([`MOVE`, { move: { from: `e2`, to: `e4` } }]))
    const received = await this.waitForMessage(joiner)

    expect(received).toBe(`["MOVE-ACCEPTED",{"name":"rataplan","move":{"from":"e2","to":"e4"},"turn":"b"}]`)
  })

  it(`should not allow to join a lobby if the game already started`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    await this.startTwoPlayersGame({
      creatorName: `useloom`,
      creatorRol: `b`,
      joinerName: `rataplan`,
      joinerRol: `w`,
      port
    })

    const outsider = await this.registerUser({ url: `ws://localhost`, port, userName: `peperone` })
    await this.joinLobby({
      ws: outsider,
      lobbyName: `myLobby`,
      expectedMessage: JSON.stringify([`JOIN-LOBBY-REJECTED`, { "reason": `Game already started` }])
    })
  })

  it(`should not allow to start a game if there are roles with no players`, async function () {
    spyOn(console, `log`)
    await umpire.start()

    const creator = await this.registerUser({ url: `ws://localhost`, port, userName: `useloom` })
    const joiner = await this.registerUser({ url: `ws://localhost`, port, userName: `rataplan` })

    await this.createLobby({ ws: creator, lobbyName: `myLobby` })
    await this.joinLobby({ ws: joiner, lobbyName: `myLobby` })
    await Promise.all([
      this.chooseRol({ ws: creator, rol: `b`, playerName: `useloom` }),
      this.waitForMessage(joiner) // The joiner is notified that the creator choosed rol
    ])
    await Promise.all([
      this.chooseRol({ ws: joiner, rol: `b`, playerName: `rataplan` }),
      this.waitForMessage(creator) // The creator is notified that the joiner choosed rol
    ])

    const startGameMessage = JSON.stringify([`START-GAME`])
    creator.send(startGameMessage)
    const received = await this.waitForMessage(creator)

    expect(received).toBe(`["START-GAME-REJECTED",{"reason":"There are roles without player"}]`)
  })
})
