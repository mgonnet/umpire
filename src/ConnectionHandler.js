const UserHandlerFactory = require('./UserHandler')

const ConnectionHandlerFactory = ({ settersGetters }) => (ws) => {
  let currentUser

  const userHandler = UserHandlerFactory(settersGetters.users)

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
}

module.exports = ConnectionHandlerFactory
