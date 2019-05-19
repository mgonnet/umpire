/**
 *  @typedef {import('ws')} WebSocket
 */

/**
 * @typedef {Object} Message
 * @property {string} messageType The message type
 * @property {Object} messageData The message data
 */

/**
 *
 * @param {WebSocket} ws
 */
const UserFactory = (ws) => {
  let userName
  let lobby

  return {

    /**
     *
     * @param {Message} message
     */
    sendMessage (message) {
      ws.send(JSON.stringify(message))
    },

    /**
     *
     * @param {Message} message
     */
    sendMessageAndClose (message) {
      ws.send(JSON.stringify(message), () => ws.close())
    },

    /**
     *
     * @param {string} name
     */
    setName (name) {
      userName = name
    },

    hasName () {
      return !!userName
    },

    /**
     * @returns {string}
     */
    getName () {
      return userName
    },

    /**
     * @returns {boolean}
     */
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
