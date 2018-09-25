const pkg = require('../package.json')
const Configstore = require('configstore')
const chalk = require('chalk')
const utils = require('./utils')

const settings = {
  maxlevels: 7,
  session: 0,
  failToZero: true,
  lastAccessDate: null,
  revealDelay: 2,
  titleColor: '#000000',
  titleBGColor: '#FDFD96',
  titleBold: true,
  retFuncColor: '#FE0000',
  retFuncBGColor: '',
  retFuncBold: false,
  infoColor: '#0BBCEA',
  infoBGColor: '',
  infoBold: false,
  frontColor: '#E8BE6A',
  backColor: '#94E86A',
  nullSet: 'Unsorted',
  newSetString: 'New set',
}
var conf = new Configstore(pkg.name, { 'settings': settings })

var self = module.exports = {

  updateSession: () => {
    var today = utils.getDay()
    if (self.get('lastAccessDate') !== today) {
      self.set('lastAccessDate', today)
      self.set('session', parseInt(self.get('session'), 10) + 1)
    }
  },

  get: key => {
    if (settings.hasOwnProperty(key)) {
      return settings[key]
    } else {
      return null
    }
  },

  set: (key, value) => {
    settings[key] = value
    conf.set('settings', settings)
  },

  get conf () {
    return conf
  },

  getMessageFunc: keyID => {
    let color = self.get(keyID + 'Color')
    let bgColor = self.get(keyID + 'BGColor')
    let bold = self.get(keyID + 'Bold')
    let retFunc = chalk.white // default
    if (color) retFunc = chalk.hex(color)
    if (bgColor) retFunc = retFunc.bgHex(bgColor)
    if (bold) retFunc = retFunc.bold
    return (message) => {
      console.log(retFunc(message))
    }
  },

  getTodaysLevels: () => {
    let session = self.get('session') || 1
    let level = parseInt(self.get('maxlevels'), 10) || 2
    level-- // cards at or above max level are never reviewed
    let validLevels = []
    while (level--) {
      if (session % level === 0) {
        validLevels.push(level)
      }
    }
    return validLevels
  }

}
