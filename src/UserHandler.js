const UserHandlerFactory = ({ addUser, removeUser, hasUser }) => {
  return {
    register (user, ws) {
      if (!hasUser(user)) {
        addUser(user, ws)
        let response = JSON.stringify(['REGISTER-ACCEPTED'])
        ws.send(response)
      } else {
        let response = JSON.stringify(['REGISTER-REJECTED'])
        ws.send(response)
      }
    },

    leaveServer (user, ws) {
      if (removeUser(user)) {
        let response = JSON.stringify(['LEAVE-SERVER-ACCEPTED'])
        ws.send(response, () => ws.close())
      }
    }
  }
}

module.exports = UserHandlerFactory
