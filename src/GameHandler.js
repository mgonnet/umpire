const GameHandlerFactory = (currentUser, { getLobby }) => {
  return {
    move (move) {
      const lobby = getLobby(currentUser.getLobby())
      if (!lobby.isPlayerTurn(currentUser)) {
        currentUser.sendMessage([
          `MOVE-REJECTED`,
          { reason: `Not your turn` }
        ])
      }
    }
  }
}

module.exports = GameHandlerFactory
