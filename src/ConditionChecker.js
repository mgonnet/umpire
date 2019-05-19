const ConditionCheckerFactory = (
  currentUser,
  { getLobby }) => {
  return {
    check (action, { insideLobby }) {
      // Fails if the current user is not inside a lobby
      if (insideLobby) {
        if (!currentUser.isInLobby()) {
          currentUser.sendMessage([
            `${action}-REJECTED`,
            { reason: `Player is not inside a lobby` }
          ])
          return false
        }
      }

      return true
    }

  }
}

module.exports = ConditionCheckerFactory
