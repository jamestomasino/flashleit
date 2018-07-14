const chalk       = require('chalk')
var CLI         = require('clui')
var Spinner     = CLI.Spinner
var Progress    = CLI.Progress

var self = module.exports = {

  /* Pause function
   *  - display progressbar
   *  - display spinner
   *  - wait for time, default
   *  - return
   */
  pause: (time=2) => {
    let increment = (100 / 20) / time
    return new Promise((resolve) => {
      self.br()
      var thisProgressBar = new Progress(45)
      var countdown = new Spinner(
        chalk.magentaBright(thisProgressBar.update(0)),
        ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']
      )
      countdown.start()
      var number = 1
      setInterval(() => {
        number+=increment
        countdown.message(chalk.magentaBright(thisProgressBar.update(number, 100)))
        if (number >= 100) {
          resolve()
        }
      }, 50)
    })
  },

  br: () => {
    process.stdout.write('\n')
  },

  die: async () => {
    await self.pause(2)
    self.br()
    process.exit(0)
  }

}
