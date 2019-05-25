/**
 * @typedef MessageTypeEnum
 * @property {string} REGISTER "REGISTER"
 * @property {string} LEAVE_SERVER "LEAVE-SERVER"
 * @property {string} CREATE_LOBBY "CREATE-LOBBY"
 * @property {string} CLOSE_LOBBY "CLOSE-LOBBY"
 * @property {string} JOIN_LOBBY "JOIN-LOBBY"
 * @property {string} LEAVE_LOBBY "LEAVE-LOBBY"
 * @property {string} CHOOSE_ROL "CHOOSE-ROL"
 * @property {string} START_GAME "START-GAME"
 * @property {string} MOVE "MOVE"
 */

/** @type {MessageTypeEnum} */
const MessageTypes = {
  REGISTER: `REGISTER`,
  LEAVE_SERVER: `LEAVE-SERVER`,
  CREATE_LOBBY: `CREATE-LOBBY`,
  CLOSE_LOBBY: `CLOSE-LOBBY`,
  JOIN_LOBBY: `JOIN-LOBBY`,
  LEAVE_LOBBY: `LEAVE-LOBBY`,
  CHOOSE_ROL: `CHOOSE-ROL`,
  START_GAME: `START-GAME`,
  MOVE: `MOVE`
}

module.exports = MessageTypes
