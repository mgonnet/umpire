const GameHandlerFactory = (currentUser, { getLobby }) => {
  return {
    move (move) {
      const lobby = currentUser.getLobby()
      if (!lobby.isPlayerTurn(currentUser)) {
        currentUser.sendMessage([
          `MOVE-REJECTED`,
          { reason: `Not your turn` }
        ])
      } else {
        const turn = lobby.move(move)
        lobby.broadcast([
          `MOVE-ACCEPTED`,
          {
            player: `${currentUser.getName()}`,
            move: `${move}`,
            turn: turn
          }
        ])
      }
    }
  }
}

module.exports = GameHandlerFactory
