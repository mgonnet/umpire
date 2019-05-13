const UserHandlerFactory = require('./UserHandler')
const LobbyHandlerFactory = require('./LobbyHandler')

const ConnectionHandlerFactory = ({ settersGetters }) => (ws) => {
  let currentUser = void (0)
  let currentLobby = void (0)

  const connectionStatus = {
    hasCurrentLobby () {
      return currentLobby !== void (0)
    },
    setCurrentLobby (lobby) {
      currentLobby = lobby
    },
    notCurrentlyInALobby () {
      currentLobby = void (0)
    },
    getCurrentLobby () {
      return currentLobby
    },
    getCurrentUser () {
      return currentUser
    },
    setCurrentUser (user) {
      currentUser = user
    },
    hasCurrentUser () {
      return currentUser !== void (0)
    }
  }

  function sendMessage (message, callback) {
    ws.send(JSON.stringify(message), callback)
  }

  function sendMessageAndClose (message) {
    sendMessage(message, () => ws.close())
  }

  const userHandler = UserHandlerFactory(
    Object.assign(
      {},
      settersGetters.users,
      { sendMessage, sendMessageAndClose },
      { setCurrentUser: connectionStatus.setCurrentUser, hasCurrentUser: connectionStatus.hasCurrentUser }
    )
  )
  const lobbyHandler = LobbyHandlerFactory(
    Object.assign(
      {},
      connectionStatus,
      settersGetters.lobbies,
      { sendMessage },
      { sendMessageToUser: settersGetters.users.sendMessageToUser }
    )
  )

  ws.on('message', function incoming (message) {
    console.log(`Received: ${message}`)

    let [type, data] = JSON.parse(message)

    if (type === 'REGISTER') {
      userHandler.register(data.name, ws)
    }

    if (type === 'LEAVE-SERVER') {
      userHandler.leaveServer(currentUser)
    }

    if (type === 'CREATE-LOBBY') {
      lobbyHandler.createLobby(data.name)
    }

    if (type === 'CLOSE-LOBBY') {
      lobbyHandler.closeLobby()
    }

    if (type === 'JOIN-LOBBY') {
      lobbyHandler.joinLobby(data.name)
    }

    if (type === 'LEAVE-LOBBY') {
      lobbyHandler.leaveLobby()
    }
  })
}

module.exports = ConnectionHandlerFactory
