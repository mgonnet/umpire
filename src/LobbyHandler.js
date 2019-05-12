const LobbyHandlerFactory = ({ sendMessage, getCurrentUser, hasCurrentLobby, setCurrentLobby, hasLobby, addLobby }) => {
  return {
    createLobby (lobbyName) {
      if (hasCurrentLobby()) {
        let response = JSON.stringify(['CREATE-LOBBY-REJECTED', { reason: 'User already in lobby' }])
        sendMessage(response)
      } else if (hasLobby(lobbyName)) {
        let response = JSON.stringify(['CREATE-LOBBY-REJECTED', { reason: 'Lobby name already exists' }])
        sendMessage(response)
      } else {
        addLobby({ lobbyName: lobbyName, creator: getCurrentUser() })
        setCurrentLobby(lobbyName)
        let response = JSON.stringify(['CREATE-LOBBY-ACCEPTED'])
        sendMessage(response)
      }
    }
  }
}

module.exports = LobbyHandlerFactory
