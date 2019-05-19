const ConditionCheckerFactory = (
  currentUser,
  { getLobby }) => {
  /**
     * Sends a message to the current user, rejecting the action and providing the reason
     * @param {string} action
     * @param {string} reason
     */
  const reject = (action, reason) => {
    currentUser.sendMessage([
      `${action}-REJECTED`,
      { reason }
    ])
  }

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
          reject(action, `Player is not inside a lobby`)
          return false
        }
      }

      if (isLobbyCreator) {
        const lobby = currentUser.getLobby()
        if (!lobby.isTheCreator(currentUser)) {
          reject(action, `Player is not the lobby creator`)
          return false
        }
      }

      return true
    }

  }
}

module.exports = ConditionCheckerFactory
