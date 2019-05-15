const LobbyFactory = ({ lobbyName, creator }) => {
  const players = [creator]

  return {
    getLobbyName () {
      return lobbyName
    },

    getCreator () {
      return creator
    },

    addPlayer (player) {
      players.push(player)
    },

    removePlayer (player) {
      players.splice(players.indexOf(player))
    },

    broadcast (message) {
      players.forEach((player) => {
        player.sendMessage(message)
      })
    },

    forEachPlayer (customFunction) {
      players.forEach(customFunction)
    }
  }
}

module.exports = LobbyFactory
