const UserHandlerFactory = require('./UserHandler')
const LobbyHandlerFactory = require('./LobbyHandler')

const ConnectionHandlerFactory = ({ settersGetters }) => (ws) => {
  let currentUser
  let currentLobby = void (0)

  const connectionStatus = {
    hasCurrentLobby () {
      return currentLobby !== void (0)
    },
    setCurrentLobby (lobby) {
      currentLobby = lobby
    },
    getCurrentLobby () {
      return currentLobby
    },
    getCurrentUser () {
      return currentUser
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
      { sendMessage, sendMessageAndClose }
    )
  )
  const lobbyHandler = LobbyHandlerFactory(
    Object.assign(
      {},
      connectionStatus,
      settersGetters.lobbies,
      { sendMessage }
    )
  )

  ws.on('message', function incoming (message) {
    console.log(`Received: ${message}`)

    let [type, data] = JSON.parse(message)

    if (type === 'REGISTER') {
      currentUser = data.name
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
  })
}

module.exports = ConnectionHandlerFactory
