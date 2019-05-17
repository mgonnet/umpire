async function startTwoPlayersGame ({ creatorName, creatorRol, joinerName, joinerRol, port }) {
  const creator = await this.registerUser({ url: `ws://localhost`, port, userName: creatorName })
  const joiner = await this.registerUser({ url: `ws://localhost`, port, userName: joinerName })

  await this.createLobby({ ws: creator, lobbyName: `myLobby` })
  await this.joinLobby({ ws: joiner, lobbyName: `myLobby` })
  await Promise.all([
    this.chooseRol({ ws: creator, rol: creatorRol, playerName: creatorName }),
    this.waitForMessage(joiner) // The joiner is notified that the creator choosed rol
  ])
  await Promise.all([
    this.chooseRol({ ws: joiner, rol: joinerRol, playerName: joinerName }),
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
        { name: creatorName, rol: creatorRol },
        { name: joinerName, rol: joinerRol } ],
      turn: `w`
    }
  ])

  expect(receivedCreator).toBe(startedMessage)
  expect(receivedJoiner).toBe(startedMessage)

  return { creator, joiner }
}

beforeEach(function () {
  this.startTwoPlayersGame = startTwoPlayersGame
})
