const Umpire = require('../../src/umpire')

describe('umpire server start', function () {
  let port = 8080
  let umpire

  beforeEach(function () {
    umpire = Umpire({ port })
  })

  it('should show message in console when started', function () {
    spyOn(console, 'log')

    umpire.start()

    expect(console.log).toHaveBeenCalledWith(`Umpire server listening at port ${port}`)
  })
})
