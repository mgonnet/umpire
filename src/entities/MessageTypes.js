/**
 * @typedef {string} MessageType
 */

/** @enum {MessageType} */
const MessageTypes = {
  REGISTER: `REGISTER`,
  LEAVE_SERVER: `LEAVE-SERVER`,
  CREATE_LOBBY: `CREATE-LOBBY`,
  CLOSE_LOBBY: `CLOSE-LOBBY`,
  JOIN_LOBBY: `JOIN-LOBBY`,
  LEAVE_LOBBY: `LEAVE-LOBBY`,
  CHOOSE_ROL: `CHOOSE-ROL`,
  START_GAME: `START-GAME`,
  MOVE: `MOVE`,
  JOINED_LOBBY: `JOINED-LOBBY`,
  CHOOSED_ROL: `CHOOSED-ROL`
}

module.exports = MessageTypes
