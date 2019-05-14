const UserFactory = ({ lobby, userName, ws }) => {
  if (!userName) {
    userName = void (0)
  }

  return {
    sendMessage (message) {
      ws.send(JSON.stringify(message))
    },

    sendMessageAndClose (message) {
      ws.send(JSON.stringify(message), () => ws.close())
    },

    setName (name) {
      userName = name
    },

    hasName () {
      return !!userName
    },

    getName () {
      return userName
    },

    isInLobby () {
      return !!lobby
    },

    setLobby (myLobby) {
      lobby = myLobby
    },

    leaveLobby () {
      lobby = void (0)
    },

    getLobby () {
      return lobby
    }
  }
}

module.exports = UserFactory
