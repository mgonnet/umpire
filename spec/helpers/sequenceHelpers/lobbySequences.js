async function createLobby ({ ws, lobbyName, expectedMessage }) {
  const createLobbyMessage = JSON.stringify([`CREATE-LOBBY`, { name: lobbyName }])
  ws.send(createLobbyMessage)
  const received = await this.waitForMessage(ws)

  if (!expectedMessage) {
    expectedMessage = `["CREATE-LOBBY-ACCEPTED",{"players":`
  }
  expect(received).toContain(expectedMessage)
}

async function joinLobby ({ ws, lobbyName, expectedMessage }) {
  const joinLobbyMessage = JSON.stringify([`JOIN-LOBBY`, { name: lobbyName }])
  ws.send(joinLobbyMessage)
  const received = await this.waitForMessage(ws)

  if (!expectedMessage) {
    expectedMessage = `["JOIN-LOBBY-ACCEPTED",{"players":`
  }

  expect(received).toContain(expectedMessage)
}

async function closeLobby ({ ws, expectedMessage }) {
  const closeLobbyMessage = JSON.stringify([`CLOSE-LOBBY`])
  ws.send(closeLobbyMessage)
  const received = await this.waitForMessage(ws)

  if (!expectedMessage) {
    expectedMessage = `["CLOSE-LOBBY-ACCEPTED"]`
  }

  expect(received).toBe(expectedMessage)
}

async function chooseRol ({ ws, rol, playerName, expectedMessage }) {
  const chooseRolMessage = JSON.stringify([`CHOOSE-ROL`, { rol }])
  ws.send(chooseRolMessage)
  const received = await this.waitForMessage(ws)

  if (!expectedMessage) {
    expectedMessage = `["CHOOSE-ROL-ACCEPTED",{"player":"${playerName}","rol":"${rol}"}]`
  }

  expect(received).toBe(expectedMessage)
}

beforeEach(function () {
  this.createLobby = createLobby
  this.joinLobby = joinLobby
  this.closeLobby = closeLobby
  this.chooseRol = chooseRol
})
