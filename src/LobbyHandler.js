const LobbyHandlerFactory = ({ sendMessage, getCurrentUser, hasCurrentLobby, setCurrentLobby, hasLobby, addLobby }) => {
  return {

    createLobby (lobbyName) {
      if (hasCurrentLobby()) {
        sendMessage([
          'CREATE-LOBBY-REJECTED',
          { reason: 'User already in lobby' }
        ])
      } else if (hasLobby(lobbyName)) {
        sendMessage([
          'CREATE-LOBBY-REJECTED',
          { reason: 'Lobby name already exists' }
        ])
      } else {
        addLobby({ lobbyName: lobbyName, creator: getCurrentUser() })
        setCurrentLobby(lobbyName)
        sendMessage(['CREATE-LOBBY-ACCEPTED'])
      }
    }

  }
}

module.exports = LobbyHandlerFactory
