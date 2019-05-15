const WebSocket = require(`ws`)
const ConnectionHandlerFactory = require(`./ConnectionHandler`)

const Umpire = ({ port }) => {
  let wss
  const users = new Map()
  const lobbies = new Map()

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
    }
  }

  return {

    start () {
      return new Promise(function (resolve, reject) {
        wss = new WebSocket.Server(
          { port },
          () => {
            console.log(`Umpire server listening at port ${port}`)
            resolve()
          }
        )

        wss.on(`connection`, ConnectionHandlerFactory({ settersGetters }))
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
