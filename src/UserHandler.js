const UserHandlerFactory = ({ hasCurrentUser, setCurrentUser, sendMessage, sendMessageAndClose, addUser, removeUser, hasUser }) => {
  return {
    register (user, ws) {
      if (hasCurrentUser()) {
        sendMessage([
          'REGISTER-REJECTED',
          { reason: 'User already registered' }
        ])
      } else if (!hasUser(user)) {
        addUser(user, ws)
        setCurrentUser(user)
        sendMessage(['REGISTER-ACCEPTED'])
      } else {
        sendMessage(['REGISTER-REJECTED'])
      }
    },

    leaveServer (user) {
      if (removeUser(user)) {
        sendMessageAndClose(['LEAVE-SERVER-ACCEPTED'])
      }
    }
  }
}

module.exports = UserHandlerFactory
