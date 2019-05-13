const LobbyHandlerFactory = ({
  sendMessage,
  getCurrentUser,
  hasCurrentLobby,
  setCurrentLobby,
  notCurrentlyInALobby,
  getCurrentLobby,
  hasLobby,
  addLobby,
  getLobby,
  removeLobby }) => {
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
    },

    closeLobby () {
      if (!hasCurrentLobby()) {
        sendMessage([
          'CLOSE-LOBBY-REJECTED',
          { reason: 'User is not in a lobby' }
        ])
      } else {
        let lobby = getLobby(getCurrentLobby())
        if (!lobby) {

        } else {
          if (lobby.creator !== getCurrentUser()) {
            sendMessage([
              'CLOSE-LOBBY-REJECTED',
              { reason: 'Player is not the lobby creator' }
            ])
          } else if (removeLobby(getCurrentLobby())) {
            sendMessage(['CLOSE-LOBBY-ACCEPTED'])
          }
        }
      }
    },

    joinLobby (lobbyName) {
      if (hasCurrentLobby()) {
        sendMessage([
          'JOIN-LOBBY-REJECTED',
          { reason: 'User is already in a lobby' }
        ])
      } else {
        let lobby = getLobby(lobbyName)
        if (lobby) {
          lobby.players.push(getCurrentUser())
          setCurrentLobby(lobbyName)
          sendMessage(['JOIN-LOBBY-ACCEPTED'])
        } else {
          sendMessage([
            'JOIN-LOBBY-REJECTED',
            { reason: 'Lobby does not exist' }
          ])
        }
      }
    },

    leaveLobby () {
      if (hasCurrentLobby()) {
        let lobby = getLobby(getCurrentLobby())
        lobby.players.splice(lobby.players.indexOf(getCurrentUser()))
        notCurrentlyInALobby()
        sendMessage(['LEAVE-LOBBY-ACCEPTED'])
      } else {
        sendMessage([
          'LEAVE-LOBBY-REJECTED',
          { reason: 'Player is not the inside a lobby' }
        ])
      }
    }

  }
}

module.exports = LobbyHandlerFactory
