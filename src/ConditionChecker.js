const ConditionCheckerFactory = (
  currentUser,
  { getLobby }) => {
  return {

    /**
     *
     * @param {*} action
     * @param {*} conditions
     * @param {boolean} conditions.insideLobby Fails if the current user is not inside a lobby
     * @param {boolean} conditions.isLobbyCreator Fails if the current user is not the lobby creator
     */
    check (action, { insideLobby, isLobbyCreator }) {
      if (insideLobby) {
        if (!currentUser.isInLobby()) {
          currentUser.sendMessage([
            `${action}-REJECTED`,
            { reason: `Player is not inside a lobby` }
          ])
          return false
        }
      }

      if (isLobbyCreator) {
        const lobby = currentUser.getLobby()
        if (!lobby.isTheCreator(currentUser)) {
          currentUser.sendMessage([
            `${action}-REJECTED`,
            { reason: `Player is not the lobby creator` }
          ])
          return false
        }
      }

      return true
    }

  }
}

module.exports = ConditionCheckerFactory
