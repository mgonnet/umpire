const UserHandlerFactory = require(`./UserHandler`)
const LobbyHandlerFactory = require(`./LobbyHandler`)
const GameHandlerFactory = require(`./GameHandler`)
const UserFactory = require(`./entities/User`)
const MessageTypes = require(`./entities/MessageTypes`)

const ConnectionHandlerFactory = ({ settersGetters }) => (ws) => {
  const currentUser = UserFactory(ws)

  const userHandler = UserHandlerFactory(currentUser, settersGetters.users)
  const lobbyHandler = LobbyHandlerFactory(currentUser, settersGetters.lobbies)
  const gameHandler = GameHandlerFactory(currentUser, settersGetters.lobbies)

  ws.on(`message`, function incoming (message) {
    console.log(`Received: ${message}`)

    const [type, data] = JSON.parse(message)

    switch (type) {
      case MessageTypes.REGISTER:
        userHandler.register(data.name)
        break
      case MessageTypes.LEAVE_SERVER:
        userHandler.leaveServer()
        break
      case MessageTypes.CREATE_LOBBY:
        lobbyHandler.createLobby(data.name, settersGetters.game.requiredRoles)
        break
      case MessageTypes.CLOSE_LOBBY:
        lobbyHandler.closeLobby()
        break
      case MessageTypes.JOIN_LOBBY:
        lobbyHandler.joinLobby(data.name)
        break
      case MessageTypes.LEAVE_LOBBY:
        lobbyHandler.leaveLobby()
        break
      case MessageTypes.CHOOSE_ROL:
        lobbyHandler.chooseRol(data.rol)
        break
      case MessageTypes.START_GAME:
        lobbyHandler.startGame(settersGetters.game.getGameConstructor())
        break
      case MessageTypes.MOVE:
        gameHandler.move(data.move)
        break
      default:
        break
    }
  })
}

module.exports = ConnectionHandlerFactory
