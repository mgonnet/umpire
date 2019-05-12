const UserHandlerFactory = require('./UserHandler')

const ConnectionHandlerFactory = ({ settersGetters }) => (ws) => {
  let currentUser
  let currentLobby = void (0)

  const userHandler = UserHandlerFactory(settersGetters.users)

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
      if (currentLobby !== void (0)) {
        let response = JSON.stringify(['CREATE-LOBBY-REJECTED', { reason: 'User already in lobby' }])
        ws.send(response)
      } else if (settersGetters.lobbies.hasLobby(data.name)) {
        let response = JSON.stringify(['CREATE-LOBBY-REJECTED', { reason: 'Lobby name already exists' }])
        ws.send(response)
      } else {
        settersGetters.lobbies.addLobby({ lobbyName: data.name, creator: currentUser })
        currentLobby = data.name
        let response = JSON.stringify(['CREATE-LOBBY-ACCEPTED'])
        ws.send(response)
      }
    }

    if (type === 'CLOSE-LOBBY') {
      if (currentLobby === void (0)) {
        let response = JSON.stringify(['CLOSE-LOBBY-REJECTED', { reason: 'User is not in a lobby' }])
        ws.send(response)
      } else if (settersGetters.lobbies.removeLobby(currentLobby)) {
        currentLobby = void (0)
        let response = JSON.stringify(['CLOSE-LOBBY-ACCEPTED'])
        ws.send(response)
      }
    }

    if (type === 'JOIN-LOBBY') {
      let lobby = settersGetters.lobbies.getLobby(data.name)
      if (lobby) {
        lobby.players.push(currentUser)
        let response = JSON.stringify(['JOIN-LOBBY-ACCEPTED'])
        ws.send(response)
      }
    }
  })
}

module.exports = ConnectionHandlerFactory
