const WebSocket = require('ws')
const UserHandlerFactory = require('./UserHandler')

const Umpire = ({ port }) => {
  let wss
  let users = new Map()

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
      }
    }
  }

  const userHandler = UserHandlerFactory({ settersGetters: settersGetters.users })

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

        wss.on('connection', function connection (ws) {
          let currentUser

          ws.on('message', function incoming (message) {
            console.log(`Received: ${message}`)

            let [type, data] = JSON.parse(message)

            if (type === 'REGISTER') {
              currentUser = data.name
              userHandler.register(data.name, ws)
            }

            if (type === 'LEAVE-SERVER') {
              userHandler.leaveServer(currentUser, ws)
            }
          })
        })
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
