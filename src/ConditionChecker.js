const ConditionCheckerFactory = (
  currentUser,
  { getLobby }) => {
  /**
   * Sends a message to the current user, rejecting the action and providing the reason
   *
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
     * @param {string} action
     * @param {{insideLobby?: boolean, isLobbyCreator?: boolean}} conditions
     * @returns {boolean} Returns true if all conditions pass
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
