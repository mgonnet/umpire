const UserHandlerFactory = require('./UserHandler')
const LobbyHandlerFactory = require('./LobbyHandler')
const UserFactory = require('./entities/User')

const ConnectionHandlerFactory = ({ settersGetters }) => (ws) => {
  let currentUser = UserFactory({ ws })
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
      currentUser.setName(user)
    },
    hasCurrentUser () {
      return currentUser.hasName()
    }
  }

  function sendMessage (message, callback) {
    ws.send(JSON.stringify(message), callback)
  }

  const userHandler = UserHandlerFactory(
    currentUser,
    Object.assign(
      {},
      settersGetters.users,
      connectionStatus
    )
  )
  const lobbyHandler = LobbyHandlerFactory(
    currentUser,
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
