const Umpire = ({ port }) => ({
  start () {
    console.log(`Umpire server listening at port ${port}`)
  }
})

module.exports = Umpire
