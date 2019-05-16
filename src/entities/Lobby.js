const LobbyFactory = ({ lobbyName, creator }) => {
  const lobbyPlayers = [{ player: creator, rolSpecified: false, rol: undefined }]

  return {
    getLobbyName () {
      return lobbyName
    },

    getCreator () {
      return creator
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
     * @param {Player} myPlayer
     * @param {string} rol
     */
    setPlayerRol (myPlayer, rol) {
      const lobbyPlayer = lobbyPlayers.find(({ player }) => player === myPlayer)
      lobbyPlayer.rolSpecified = true
      lobbyPlayer.rol = rol
    }
  }
}

module.exports = LobbyFactory
