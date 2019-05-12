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
    getCurrentUser () {
      return currentUser
    }
  }

  const wsFunctions = {
    sendMessage (message, callback) {
      ws.send(message, callback)
    }
  }

  const userHandler = UserHandlerFactory(settersGetters.users)
  const lobbyHandler = LobbyHandlerFactory(
    Object.assign(
      {},
      connectionStatus,
      settersGetters.lobbies,
      wsFunctions
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
      userHandler.leaveServer(currentUser, ws)
    }

    if (type === 'CREATE-LOBBY') {
      lobbyHandler.createLobby(data.name)
    }

    if (type === 'CLOSE-LOBBY') {
      if (currentLobby === void (0)) {
        let response = JSON.stringify(['CLOSE-LOBBY-REJECTED', { reason: 'User is not in a lobby' }])
        ws.send(response)
      } else {
        let lobby = settersGetters.lobbies.getLobby(currentLobby)
        if (!lobby) {

        } else {
          if (lobby.creator !== currentUser) {
            let response = JSON.stringify(['CLOSE-LOBBY-REJECTED', { reason: 'Player is not the lobby creator' }])
            ws.send(response)
          } else if (settersGetters.lobbies.removeLobby(currentLobby)) {
            currentLobby = void (0)
            let response = JSON.stringify(['CLOSE-LOBBY-ACCEPTED'])
            ws.send(response)
          }
        }
      }
    }

    if (type === 'JOIN-LOBBY') {
      if (currentLobby !== void (0)) {
        let response = JSON.stringify(['JOIN-LOBBY-REJECTED', { reason: 'User is already in a lobby' }])
        ws.send(response)
      } else {
        let lobby = settersGetters.lobbies.getLobby(data.name)
        if (lobby) {
          lobby.players.push(currentUser)
          currentLobby = data.name
          let response = JSON.stringify(['JOIN-LOBBY-ACCEPTED'])
          ws.send(response)
        } else {
          let response = JSON.stringify(['JOIN-LOBBY-REJECTED', { reason: 'Lobby does not exist' }])
          ws.send(response)
        }
      }
    }
  })
}

module.exports = ConnectionHandlerFactory
