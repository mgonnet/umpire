const WebSocket = require('ws')

const Umpire = ({ port }) => {
  let wss
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
          ws.on('message', function incoming (message) {
            console.log(`Received: ${message}`)
          })
        })
      })
    },

    close () {
      return new Promise(function (resolve, reject) {
        wss.close(() => {
          resolve()
        })
      })
    }
  }
}

module.exports = Umpire
