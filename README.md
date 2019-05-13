# umpire

## Sequence Diagrams

### User Connection to Umpire Server
![User Connection](./doc/sequenceDiagramsPng/userConnection.png)

### Lobby creation
![Lobby Creation](./doc/sequenceDiagramsPng/lobbyCreation.png)

## Listening Message types

| Message       |Message data     | Response type         | Response data |
| ------------- | -------------   |-----------------------|---------------|
| REGISTER      | {name: 'pepe'}  | REGISTER-ACCEPTED     |               |
|               |                 | REGISTER-REJECTED     |               |
| LEAVE-SERVER  |                 | LEAVE-SERVER-ACCEPTED |               |
| CREATE-LOBBY  | {name: 'lobby'} | CREATE-LOBBY-REJECTED | { reason: 'User already in lobby' } |
|               |                 | CREATE-LOBBY-REJECTED | { reason: 'Lobby name already exists' } |
|               |                 | CREATE-LOBBY-ACCEPTED |               |
| CLOSE-LOBBY   |                 | CLOSE-LOBBY-REJECTED  | { reason: 'Player is not the lobby creator' } |
|               |                 | CLOSE-LOBBY-REJECTED  | { reason: 'User is not in a lobby' } |
|               |                 | CLOSE-LOBBY-ACCEPTED  |               |
| JOIN-LOBBY    | {name: 'lobby'} | JOIN-LOBBY-REJECTED   | { reason: 'User is already in a lobby' } |
|               |                 | JOIN-LOBBY-REJECTED   | { reason: 'Lobby does not exist' } |
|               |                 | JOIN-LOBBY-ACCEPTED   |               |
| LEAVE-LOBBY   |                 | LEAVE-LOBBY-ACCEPTED  |               |
|               |                 | LEAVE-LOBBY-REJECTED  | { reason: 'Player is not the inside a lobby' } |


## [Specification status](doc/specStatus.md)

## References
1- Factory functions: https://medium.com/@vapurrmaid/should-you-use-classes-in-javascript-82f3b3df6195 