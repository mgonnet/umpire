const WebSocket = require('ws')
const ConnectionHandlerFactory = require('./ConnectionHandler')

const Umpire = ({ port }) => {
  let wss
  let users = new Map()
  let lobbies = new Map()

  const settersGetters = {
    users: {
      addUser (user, ws) {
        users.set(user, ws)
      },

      hasUser (user) {
        return users.has(user)
      },

      removeUser (user) {
        return users.delete(user)
      },

      sendMessageToUser (user, message) {
        users.get(user).send(JSON.stringify(message))
      }
    },

    lobbies: {
      addLobby ({ lobbyName, creator }) {
        lobbies.set(lobbyName, { creator, players: [creator] })
      },

      hasLobby (lobbyName) {
        return lobbies.has(lobbyName)
      },

      removeLobby (lobbyName) {
        return lobbies.delete(lobbyName)
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

        wss.on('connection', ConnectionHandlerFactory({ settersGetters }))
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
