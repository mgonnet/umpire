const LobbyFactory = require(`./entities/Lobby`)
const ConditionCheckerFactory = require(`./ConditionChecker`)

const LobbyHandlerFactory = (
  currentUser,
  { hasLobby,
    addLobby,
    getLobby,
    removeLobby }) => {
  const checker = ConditionCheckerFactory(currentUser, { getLobby })

  return {

    createLobby (lobbyName) {
      if (currentUser.isInLobby()) {
        currentUser.sendMessage([
          `CREATE-LOBBY-REJECTED`,
          { reason: `User already in lobby` }
        ])
      } else if (hasLobby(lobbyName)) {
        currentUser.sendMessage([
          `CREATE-LOBBY-REJECTED`,
          { reason: `Lobby name already exists` }
        ])
      } else {
        const newLobby = LobbyFactory({ lobbyName, creator: currentUser })
        addLobby(newLobby)
        currentUser.setLobby(newLobby)
        currentUser.sendMessage([`CREATE-LOBBY-ACCEPTED`])
      }
    },

    closeLobby () {
      if (checker.check(`CLOSE-LOBBY`, { insideLobby: true, isLobbyCreator: true })) {
        const lobby = currentUser.getLobby()
        if (removeLobby(lobby)) {
          lobby.broadcast([`CLOSE-LOBBY-ACCEPTED`])
          lobby.forEachPlayer((player) => {
            player.leaveLobby()
          })
        }
      }
    },

    joinLobby (lobbyName) {
      if (currentUser.isInLobby()) {
        currentUser.sendMessage([
          `JOIN-LOBBY-REJECTED`,
          { reason: `User is already in a lobby` }
        ])
      } else {
        const lobby = getLobby(lobbyName)
        if (lobby) {
          lobby.broadcast([
            `JOINED-LOBBY`,
            { player: currentUser.getName() }
          ])
          lobby.addPlayer(currentUser)
          currentUser.setLobby(lobby)
          currentUser.sendMessage([`JOIN-LOBBY-ACCEPTED`])
        } else {
          currentUser.sendMessage([
            `JOIN-LOBBY-REJECTED`,
            { reason: `Lobby does not exist` }
          ])
        }
      }
    },

    leaveLobby () {
      if (checker.check(`LEAVE-LOBBY`, { insideLobby: true })) {
        const lobby = currentUser.getLobby()
        lobby.removePlayer(currentUser)
        currentUser.leaveLobby()
        currentUser.sendMessage([`LEAVE-LOBBY-ACCEPTED`])
      }
    },

    /**
     *
     * @param {string} rol
     */
    chooseRol (rol) {
      if (checker.check(`CHOOSE-ROL`, { insideLobby: true })) {
        const lobby = currentUser.getLobby()
        lobby.setPlayerRol(currentUser, rol)
        lobby.broadcast([
          `CHOOSE-ROL-ACCEPTED`,
          {
            player: currentUser.getName(),
            rol: rol
          }
        ])
      }
    },

    /**
     *
     * @param {*} GameConstructor
     */
    startGame (GameConstructor) {
      if (currentUser.isInLobby()) {
        const lobby = currentUser.getLobby()
        if (lobby.isTheCreator(currentUser)) {
          const turn = lobby.startGame(GameConstructor)
          lobby.broadcast([
            `START-GAME-ACCEPTED`,
            {
              players: lobby.getPlayersInfo(),
              turn
            }
          ])
        } else {
          currentUser.sendMessage([
            `START-GAME-REJECTED`,
            { reason: `Player is not the lobby creator` }
          ])
        }
      }
    }

  }
}

module.exports = LobbyHandlerFactory
