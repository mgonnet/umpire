const UserHandlerFactory = require('./UserHandler')

const ConnectionHandlerFactory = ({ settersGetters }) => (ws) => {
  let currentUser

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
      if (!settersGetters.lobbies.hasLobby(data.name)) {
        settersGetters.lobbies.addLobby({ lobbyName: data.name, creator: currentUser })
        let response = JSON.stringify(['CREATE-LOBBY-ACCEPTED'])
        ws.send(response)
      }
    }
  })
}

module.exports = ConnectionHandlerFactory
