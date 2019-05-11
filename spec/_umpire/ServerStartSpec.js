const Umpire = require('../../src/umpire')

describe('umpire server start', function () {
  let port = 8080
  let umpire

  beforeEach(function () {
    umpire = Umpire({ port })
  })

  it('should show message in console when started', async function () {
    spyOn(console, 'log')
    await umpire.start()
    await umpire.close()
    expect(console.log).toHaveBeenCalledWith(`Umpire server listening at port ${port}`)
  })

  it('should show a message in console when receives any message', async function () {
    spyOn(console, 'log')
    await umpire.start()
    this.sendWsClientMessage({ url: 'ws://localhost', message: 'hola' })
    await new Promise(function (resolve, reject) {
      setTimeout(async () => {
        expect(console.log).toHaveBeenCalledWith(`Received: hola`)
        resolve()
      }, 1000)
    })
    await umpire.close()
  })
})
