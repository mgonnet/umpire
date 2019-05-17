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
    creator.send(startGameMessage)
    const [ receivedCreator, receivedJoiner ] = await Promise.all([
      this.waitForMessage(creator),
      this.waitForMessage(joiner)
    ])

    const startedMessage = JSON.stringify([
      `START-GAME-ACCEPTED`,
      {
        players: [
          { name: `useloom`, rol: `b` },
          { name: `rataplan`, rol: `w` } ],
        turn: `w`
      }
    ])

    expect(receivedCreator).toBe(startedMessage)
    expect(receivedJoiner).toBe(startedMessage)
  })
})
