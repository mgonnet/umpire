const MessageTypes = require(`./entities/MessageTypes`)

const GameHandlerFactory = (currentUser, { getLobby }) => {
  return {
    move (move) {
      const lobby = currentUser.getLobby()
      if (!lobby.isPlayerTurn(currentUser)) {
        currentUser.sendMessage([
          `${MessageTypes.MOVE}-REJECTED`,
          { reason: `Not your turn` }
        ])
      } else {
        const turn = lobby.move(move)
        if (turn === null) {
          currentUser.sendMessage([
            `${MessageTypes.MOVE}-REJECTED`,
            { reason: `Invalid move` }
          ])
        } else {
          lobby.broadcast([
            `${MessageTypes.MOVE}-ACCEPTED`,
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
}

module.exports = GameHandlerFactory
