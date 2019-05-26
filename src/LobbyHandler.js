const LobbyFactory = require(`./entities/Lobby`)
const ConditionCheckerFactory = require(`./ConditionChecker`)
const MessageTypes = require(`./entities/MessageTypes`)

const LobbyHandlerFactory = (
  currentUser,
  { hasLobby,
    addLobby,
    getLobby,
    removeLobby }) => {
  const checker = ConditionCheckerFactory(currentUser, { getLobby })

  return {

    createLobby (lobbyName) {
      if (checker.check(MessageTypes.CREATE_LOBBY, { registeredPlayer: true })) {
        if (currentUser.isInLobby()) {
          currentUser.sendMessage([
            `${MessageTypes.CREATE_LOBBY}-REJECTED`,
            { reason: `User already in lobby` }
          ])
        } else if (hasLobby(lobbyName)) {
          currentUser.sendMessage([
            `${MessageTypes.CREATE_LOBBY}-REJECTED`,
            { reason: `Lobby name already exists` }
          ])
        } else {
          const newLobby = LobbyFactory({ lobbyName, creator: currentUser })
          addLobby(newLobby)
          currentUser.setLobby(newLobby)
          currentUser.sendMessage([`${MessageTypes.CREATE_LOBBY}-ACCEPTED`])
        }
      }
    },

    closeLobby () {
      if (checker.check(MessageTypes.CLOSE_LOBBY, { insideLobby: true, isLobbyCreator: true })) {
        const lobby = currentUser.getLobby()
        if (removeLobby(lobby)) {
          lobby.broadcast([`${MessageTypes.CLOSE_LOBBY}-ACCEPTED`])
          lobby.forEachPlayer((player) => {
            player.leaveLobby()
          })
        }
      }
    },

    joinLobby (lobbyName) {
      if (checker.check(MessageTypes.JOIN_LOBBY, { registeredPlayer: true })) {
        if (currentUser.isInLobby()) {
          currentUser.sendMessage([
            `${MessageTypes.JOIN_LOBBY}-REJECTED`,
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
            currentUser.sendMessage([
              `${MessageTypes.JOIN_LOBBY}-ACCEPTED`,
              { players: lobby.getPlayersInfo() }
            ])
          } else {
            currentUser.sendMessage([
              `${MessageTypes.JOIN_LOBBY}-REJECTED`,
              { reason: `Lobby does not exist` }
            ])
          }
        }
      }
    },

    leaveLobby () {
      if (checker.check(MessageTypes.LEAVE_LOBBY, { insideLobby: true })) {
        const lobby = currentUser.getLobby()
        lobby.removePlayer(currentUser)
        currentUser.leaveLobby()
        currentUser.sendMessage([`${MessageTypes.LEAVE_LOBBY}-ACCEPTED`])
      }
    },

    /**
     *
     * @param {string} rol
     */
    chooseRol (rol) {
      if (checker.check(MessageTypes.CHOOSE_ROL, { insideLobby: true })) {
        const lobby = currentUser.getLobby()
        lobby.setPlayerRol(currentUser, rol)
        lobby.broadcast([
          `${MessageTypes.CHOOSE_ROL}-ACCEPTED`,
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
      if (checker.check(MessageTypes.START_GAME, { insideLobby: true, isLobbyCreator: true })) {
        const lobby = currentUser.getLobby()
        if (lobby.isTheCreator(currentUser)) {
          const turn = lobby.startGame(GameConstructor)
          lobby.broadcast([
            `${MessageTypes.START_GAME}-ACCEPTED`,
            {
              players: lobby.getPlayersInfo(),
              turn
            }
          ])
        }
      }
    }

  }
}

module.exports = LobbyHandlerFactory
