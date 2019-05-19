const Umpire = require(`../../src/umpire`)
const Chess = require(`chess.js`).Chess

describe(`game starting`, function () {
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

    expect(received).toBe(`["MOVE-ACCEPTED",{"player":"rataplan","move":"e4","turn":"b"}]`)
  })
})
