async function createLobby ({ ws, lobbyName, expectedMessage }) {
  let createLobbyMessage = JSON.stringify([`CREATE-LOBBY`, { name: lobbyName }])
  ws.send(createLobbyMessage)
  let received = await this.waitForMessage(ws)

  if (!expectedMessage) {
    expectedMessage = `["CREATE-LOBBY-ACCEPTED"]`
  }
  expect(received).toBe(expectedMessage)
}

async function joinLobby ({ ws, lobbyName, expectedMessage }) {
  let joinLobbyMessage = JSON.stringify([`JOIN-LOBBY`, { name: lobbyName }])
  ws.send(joinLobbyMessage)
  let received = await this.waitForMessage(ws)

  if (!expectedMessage) {
    expectedMessage = `["JOIN-LOBBY-ACCEPTED"]`
  }

  expect(received).toBe(expectedMessage)
}

async function closeLobby ({ ws, expectedMessage }) {
  let closeLobbyMessage = JSON.stringify([`CLOSE-LOBBY`])
  ws.send(closeLobbyMessage)
  let received = await this.waitForMessage(ws)

  if (!expectedMessage) {
    expectedMessage = `["CLOSE-LOBBY-ACCEPTED"]`
  }

  expect(received).toBe(expectedMessage)
}

beforeEach(function () {
  this.createLobby = createLobby
  this.joinLobby = joinLobby
  this.closeLobby = closeLobby
})
