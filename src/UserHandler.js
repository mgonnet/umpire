const UserHandlerFactory = (currentUser, { addUser, removeUser, hasUser }) => {
  return {
    register (user) {
      if (currentUser.hasName()) {
        currentUser.sendMessage([
          `REGISTER-REJECTED`,
          { reason: `User already registered` }
        ])
      } else if (!hasUser(user)) {
        currentUser.setName(user)
        addUser(currentUser)
        currentUser.sendMessage([`REGISTER-ACCEPTED`])
      } else {
        currentUser.sendMessage([`REGISTER-REJECTED`])
      }
    },

    leaveServer () {
      if (removeUser(currentUser)) {
        currentUser.sendMessageAndClose([`LEAVE-SERVER-ACCEPTED`])
      }
    }
  }
}

module.exports = UserHandlerFactory
