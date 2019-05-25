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

    if (type === MessageTypes.REGISTER) {
      userHandler.register(data.name)
    }

    if (type === MessageTypes.LEAVE_SERVER) {
      userHandler.leaveServer()
    }

    if (type === MessageTypes.CREATE_LOBBY) {
      lobbyHandler.createLobby(data.name)
    }

    if (type === MessageTypes.CLOSE_LOBBY) {
      lobbyHandler.closeLobby()
    }

    if (type === MessageTypes.JOIN_LOBBY) {
      lobbyHandler.joinLobby(data.name)
    }

    if (type === MessageTypes.LEAVE_LOBBY) {
      lobbyHandler.leaveLobby()
    }

    if (type === MessageTypes.CHOOSE_ROL) {
      lobbyHandler.chooseRol(data.rol)
    }

    if (type === MessageTypes.START_GAME) {
      lobbyHandler.startGame(settersGetters.game.getGameConstructor())
    }

    if (type === MessageTypes.MOVE) {
      gameHandler.move(data.move)
    }
  })
}

module.exports = ConnectionHandlerFactory
