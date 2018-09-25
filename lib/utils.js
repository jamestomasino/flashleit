const chalk = require('chalk')
var CLI = require('clui')
var Spinner = CLI.Spinner
var Progress = CLI.Progress
var thisProgressBar = new Progress(45)
var countdown = new Spinner(
  chalk.magentaBright(thisProgressBar.update(0)),
  ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']
)

var self = module.exports = {

  pause: (time = 2) => {
    let increment = (100 / 20) / time
    return new Promise((resolve) => {
      self.br()
      countdown.start()
      var number = 1
      var pauseInterval = setInterval(() => {
        number += increment
        countdown.message(chalk.magentaBright(thisProgressBar.update(number, 100)))
        if (number >= 100) {
          clearInterval(pauseInterval)
          countdown.stop()
          resolve()
        }
      }, 50)
    })
  },

  br: (lines = 1) => {
    while (lines--) {
      process.stdout.write('\n')
    }
  },

  die: async (lines) => {
    await self.pause(1)
    self.br(lines)
    process.exit(0)
  },

  getDay: () => {
    var d = new Date()
    d.setHours(0, 0, 0, 0)
    return d.toString()
  },

  shuffle: (array) => {
    var currentIndex = array.length
    var temporaryValue
    var randomIndex
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  },

}
