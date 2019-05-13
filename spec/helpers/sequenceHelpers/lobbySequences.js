async function createLobby ({ ws, lobbyName, expectedMessage }) {
  let createLobbyMessage = JSON.stringify(['CREATE-LOBBY', { name: lobbyName }])
  ws.send(createLobbyMessage)
  let received = await this.waitForMessage(ws)

  if (!expectedMessage) {
    expectedMessage = `["CREATE-LOBBY-ACCEPTED"]`
  }
  expect(received).toBe(expectedMessage)
}

beforeEach(function () {
  this.createLobby = createLobby
})
