const Umpire = require(`../../src/umpire`).Umpire
const Chess = require(`chess.js`).Chess

describe(`umpire server start`, function () {
  const port = 8080
  let umpire

  beforeEach(function () {
    umpire = Umpire({ port, game: Chess })
  })

  afterEach(async function () {
    // Try to close in case something failed in the test case
    try {
      await umpire.close()
    } catch (e) {

    }
  })

  it(`should show message in console when started`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    await umpire.close()
    expect(console.log).toHaveBeenCalledWith(`Umpire server listening at port ${port}`)
  })

  it(`should show a message in console when receives any message`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    this.sendWsClientMessage({ url: `ws://localhost`, message: JSON.stringify([`HOLA`]) })
    await new Promise(function (resolve, reject) {
      setTimeout(async () => {
        expect(console.log).toHaveBeenCalledWith(`Received: ["HOLA"]`)
        resolve()
      }, 1000)
    })
    await umpire.close()
  })

  it(`should show a message in console when closed`, async function () {
    spyOn(console, `log`)
    await umpire.start()
    await umpire.close()
    expect(console.log).toHaveBeenCalledWith(`Umpire server closed`)
  })

  it(`should throw an exception if not provided with a game constructor`, function () {
    // @ts-ignore Validates that the exception is raised if the game is not provided
    expect(() => Umpire({ port })).toThrow()
  })
})
