const WebSocket = require('ws')

const Umpire = ({ port }) => {
  let wss
  let users = new Map()

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
              if (!users.has(data.name)) {
                users.set(data.name, ws)
                currentUser = data.name
                let response = JSON.stringify(['REGISTER-ACCEPTED'])
                ws.send(response)
              } else {
                let response = JSON.stringify(['REGISTER-REJECTED'])
                ws.send(response)
              }
            }

            if (type === 'LEAVE-SERVER') {
              if (users.delete(currentUser)) {
                let response = JSON.stringify(['LEAVE-SERVER-ACCEPTED'])
                ws.send(response)
              }
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
