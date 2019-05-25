const MessageTypes = require(`./entities/MessageTypes`)

const UserHandlerFactory = (currentUser, { addUser, removeUser, hasUser }) => {
  return {
    register (user) {
      if (currentUser.hasName()) {
        currentUser.sendMessage([
          `${MessageTypes.REGISTER}-REJECTED`,
          { reason: `User already registered` }
        ])
      } else if (!hasUser(user)) {
        currentUser.setName(user)
        addUser(currentUser)
        currentUser.sendMessage([`${MessageTypes.REGISTER}-ACCEPTED`])
      } else {
        currentUser.sendMessage([
          `${MessageTypes.REGISTER}-REJECTED`,
          { reason: `User name taken - ${user}` }
        ])
      }
    },

    leaveServer () {
      if (removeUser(currentUser)) {
        currentUser.sendMessageAndClose([`${MessageTypes.LEAVE_SERVER}-ACCEPTED`])
      }
    }
  }
}

module.exports = UserHandlerFactory
