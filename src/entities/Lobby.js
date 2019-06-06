/**
 * @typedef {Object} LobbyPlayer
 * @property {*} player
 * @property {boolean} rolSpecified Indicates if the player choosed a rol
 * @property {string} rol
 *
 */

/**
 *
 * @param {Object} options
 * @param {string} options.lobbyName
 * @param {*} options.creator
 */
const LobbyFactory = ({ lobbyName, creator }) => {
  /** @type {LobbyPlayer[]} */
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

    /**
     *
     * @param {string} message
     * @param {string[]} [exceptions] An array of players that shouldn't receive the message
     */
    broadcast (message, exceptions = []) {
      lobbyPlayers.forEach(({ player }) => {
        if (!exceptions.includes(player.getName())) {
          player.sendMessage(message)
        }
      })
    },

    forEachPlayer (customFunction) {
      lobbyPlayers.forEach(({ player }) => customFunction(player))
    },

    /**
     * Searches for myPlayer, assigns the rol and marks that myPlayer choosed a rol
     *
     * @param {*} myPlayer
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

    getLobbyInfo () {
      return {
        players: this.getPlayersInfo(),
        creator: creator.getName()
      }
    },

    /**
     *
     * @param {*} GameConstructor
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

    /**
     *
     * @param {*} move
     * @returns {string | null} Returns the next turn, or null if the move is invalid
     */
    move (move) {
      if (game.move(move) !== null) {
        return game.turn()
      } else {
        return null
      }
    },

    /**
     * Returns true if the game started in this lobby
     *
     * @returns {boolean}
     */
    gameStarted () {
      return !!game
    }
  }
}

module.exports = LobbyFactory
