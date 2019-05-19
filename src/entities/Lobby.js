const LobbyFactory = ({ lobbyName, creator }) => {
  const lobbyPlayers = [{ player: creator, rolSpecified: false, rol: undefined }]
  let game

  return {
    getLobbyName () {
      return lobbyName
    },

    isTheCreator (user) {
      return creator.getName() === user.getName()
    },

    addPlayer (player) {
      lobbyPlayers.push({ player, rolSpecified: false, rol: undefined })
    },

    removePlayer (player) {
      lobbyPlayers.splice(lobbyPlayers.indexOf(player))
    },

    broadcast (message) {
      lobbyPlayers.forEach(({ player }) => {
        player.sendMessage(message)
      })
    },

    forEachPlayer (customFunction) {
      lobbyPlayers.forEach(({ player }) => customFunction(player))
    },

    /**
     * Searches for myPlayer, assigns the rol and marks that myPlayer choosed a rol
     * @param {User} myPlayer
     * @param {string} rol
     */
    setPlayerRol (myPlayer, rol) {
      const lobbyPlayer = lobbyPlayers.find(({ player }) => player === myPlayer)
      lobbyPlayer.rolSpecified = true
      lobbyPlayer.rol = rol
    },

    getPlayersInfo () {
      return lobbyPlayers.map((lobbyPlayer) => {
        return {
          name: `${lobbyPlayer.player.getName()}`,
          rol: lobbyPlayer.rol
        }
      })
    },

    /**
     *
     * @param {*} gameConstructor
     * @returns {string} The rol that moves next
     */
    startGame (GameConstructor) {
      game = new GameConstructor()
      return game.turn()
    },

    isPlayerTurn (myPlayer) {
      const lobbyPlayer = lobbyPlayers.find(({ player }) => player.getName() === myPlayer.getName())
      return lobbyPlayer.rol === game.turn()
    },

    move (move) {
      game.move(move)
      return game.turn()
    }
  }
}

module.exports = LobbyFactory
