const WebSocket = require(`ws`)
const ConnectionHandlerFactory = require(`./ConnectionHandler`)

/**
 *
 * @typedef {Object} UmpireServerOptions
 * @property {Number} [options.port] The port where to bind the server
 * @property {*} options.game
 * @property {import('http').Server} [options.server] A pre-created HTTP/S server to use
 */

/**
 *
 * @param {UmpireServerOptions} Options
 */
const Umpire = ({ port, game, server }) => {
  let wss
  const users = new Map()
  const lobbies = new Map()

  if (typeof (game) === `undefined`) {
    throw new Error(`Game constructor was not provided`)
  }

  const settersGetters = {
    users: {
      addUser (user) {
        users.set(user.getName(), user)
      },

      hasUser (user) {
        return users.has(user)
      },

      removeUser (user) {
        return users.delete(user.getName())
      }
    },

    lobbies: {
      addLobby (lobby) {
        lobbies.set(lobby.getLobbyName(), lobby)
      },

      hasLobby (lobbyName) {
        return lobbies.has(lobbyName)
      },

      removeLobby (lobby) {
        return lobbies.delete(lobby.getLobbyName())
      },

      getLobby (lobbyName) {
        return lobbies.get(lobbyName)
      }
    },

    game: {
      getGameConstructor () {
        return game
      }
    }
  }

  return {

    start () {
      return new Promise(function (resolve, reject) {
        wss = new WebSocket.Server(
          { port, server },
          () => {
            console.log(`Umpire server listening at port ${port}`)
            resolve()
          }
        )

        wss.on(`connection`, ConnectionHandlerFactory({ settersGetters }))

        setInterval(() => {
          wss.clients.forEach((ws) => {
            ws.ping()
          })
        }, 30 * 1000)
      })
    },

    close () {
      return new Promise(function (resolve, reject) {
        wss.close(() => {
          console.log(`Umpire server closed`)
          resolve()
        })
      })
    }
  }
}

module.exports = Umpire
