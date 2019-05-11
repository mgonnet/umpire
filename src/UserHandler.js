const UserHandlerFactory = ({ settersGetters }) => {
  return {
    register (user, ws) {
      if (!settersGetters.hasUser(user)) {
        settersGetters.addUser(user, ws)
        let response = JSON.stringify(['REGISTER-ACCEPTED'])
        ws.send(response)
      } else {
        let response = JSON.stringify(['REGISTER-REJECTED'])
        ws.send(response)
      }
    },

    leaveServer (user, ws) {
      if (settersGetters.removeUser(user)) {
        let response = JSON.stringify(['LEAVE-SERVER-ACCEPTED'])
        ws.send(response, () => ws.close())
      }
    }
  }
}

module.exports = UserHandlerFactory
