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
     * @param {Object} conditions
     * @param {boolean} [conditions.insideLobby] Rejects if the player is not inside a lobby
     * @param {boolean} [conditions.isLobbyCreator] Rejects if the player is not the lobby creator
     * @param {boolean} [conditions.registeredPlayer] Rejects if the player is not registerd
     * @returns {boolean} Returns true if all conditions pass
     */
    check (action, { insideLobby, isLobbyCreator, registeredPlayer }) {
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

      if (registeredPlayer) {
        if (!currentUser.hasName()) {
          reject(action, `Player is not registered`)
        }
      }

      return true
    }

  }
}

module.exports = ConditionCheckerFactory
