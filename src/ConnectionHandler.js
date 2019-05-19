const UserHandlerFactory = require(`./UserHandler`)
const LobbyHandlerFactory = require(`./LobbyHandler`)
const GameHandlerFactory = require(`./GameHandler`)
const UserFactory = require(`./entities/User`)

const ConnectionHandlerFactory = ({ settersGetters }) => (ws) => {
  const currentUser = UserFactory(ws)

  const userHandler = UserHandlerFactory(currentUser, settersGetters.users)
  const lobbyHandler = LobbyHandlerFactory(currentUser, settersGetters.lobbies)
  const gameHandler = GameHandlerFactory(currentUser, settersGetters.lobbies)

  ws.on(`message`, function incoming (message) {
    console.log(`Received: ${message}`)

    const [type, data] = JSON.parse(message)

    if (type === `REGISTER`) {
      userHandler.register(data.name)
    }

    if (type === `LEAVE-SERVER`) {
      userHandler.leaveServer()
    }

    if (type === `CREATE-LOBBY`) {
      lobbyHandler.createLobby(data.name)
    }

    if (type === `CLOSE-LOBBY`) {
      lobbyHandler.closeLobby()
    }

    if (type === `JOIN-LOBBY`) {
      lobbyHandler.joinLobby(data.name)
    }

    if (type === `LEAVE-LOBBY`) {
      lobbyHandler.leaveLobby()
    }

    if (type === `CHOOSE-ROL`) {
      lobbyHandler.chooseRol(data.rol)
    }

    if (type === `START-GAME`) {
      lobbyHandler.startGame(settersGetters.game.getGameConstructor())
    }

    if (type === `MOVE`) {
      gameHandler.move(data.move)
    }
  })
}

module.exports = ConnectionHandlerFactory
