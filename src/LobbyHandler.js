const LobbyFactory = require('./entities/Lobby')

const LobbyHandlerFactory = (
  currentUser,
  { hasLobby,
    addLobby,
    getLobby,
    removeLobby }) => {
  return {

    createLobby (lobbyName) {
      if (currentUser.isInLobby()) {
        currentUser.sendMessage([
          'CREATE-LOBBY-REJECTED',
          { reason: 'User already in lobby' }
        ])
      } else if (hasLobby(lobbyName)) {
        currentUser.sendMessage([
          'CREATE-LOBBY-REJECTED',
          { reason: 'Lobby name already exists' }
        ])
      } else {
        addLobby(LobbyFactory({ lobbyName, creator: currentUser }))
        currentUser.setLobby(lobbyName)
        currentUser.sendMessage(['CREATE-LOBBY-ACCEPTED'])
      }
    },

    closeLobby () {
      if (!currentUser.isInLobby()) {
        currentUser.sendMessage([
          'CLOSE-LOBBY-REJECTED',
          { reason: 'User is not in a lobby' }
        ])
      } else {
        let lobby = getLobby(currentUser.getLobby())
        console.log(lobby)
        if (!lobby) {

        } else {
          if (lobby.getCreator() !== currentUser) {
            currentUser.sendMessage([
              'CLOSE-LOBBY-REJECTED',
              { reason: 'Player is not the lobby creator' }
            ])
          } else if (removeLobby(lobby)) {
            currentUser.sendMessage(['CLOSE-LOBBY-ACCEPTED'])
          }
        }
      }
    },

    joinLobby (lobbyName) {
      if (currentUser.isInLobby()) {
        currentUser.sendMessage([
          'JOIN-LOBBY-REJECTED',
          { reason: 'User is already in a lobby' }
        ])
      } else {
        let lobby = getLobby(lobbyName)
        if (lobby) {
          lobby.broadcast([
            'JOINED-LOBBY',
            { player: currentUser.getName() }
          ])
          lobby.addPlayer(currentUser)
          currentUser.setLobby(lobbyName)
          currentUser.sendMessage(['JOIN-LOBBY-ACCEPTED'])
        } else {
          currentUser.sendMessage([
            'JOIN-LOBBY-REJECTED',
            { reason: 'Lobby does not exist' }
          ])
        }
      }
    },

    leaveLobby () {
      if (currentUser.isInLobby()) {
        let lobby = getLobby(currentUser.getLobby())
        lobby.removePlayer(currentUser)
        currentUser.leaveLobby()
        currentUser.sendMessage(['LEAVE-LOBBY-ACCEPTED'])
      } else {
        currentUser.sendMessage([
          'LEAVE-LOBBY-REJECTED',
          { reason: 'Player is not the inside a lobby' }
        ])
      }
    }

  }
}

module.exports = LobbyHandlerFactory
