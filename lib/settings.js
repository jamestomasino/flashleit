const chalk       = require('chalk')

var conf, settings = {
  maxlevels: 7,
  session: 1,
  titleColor: '#000000',
  titleBGColor: '#FDFD96',
  titleBold: true,
  retFuncColor: '#FE0000',
  retFuncBGColor: '',
  retFuncBold: false,
  infoColor: '#0BBCEA',
  infoBGColor: '',
  infoBold: false,
}

var self = module.exports = {

  init: (diskConf) => {
    conf = diskConf

    if (conf.has('settings')) {
      let s, diskSettings = conf.get('settings')
      for (s in diskSettings) {
        settings[s] = diskSettings[s]
      }
    }

    conf.set('settings', settings)
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

  getColorProfile: keyID => {
    let color = self.get(keyID + 'Color')
    let bgColor = self.get(keyID + 'BGColor')
    let bold = self.get(keyID + 'Bold')
    let retFunc = chalk.white // default
    if (color) {
      retFunc = chalk.hex(color)
    }
    if (bgColor) {
      retFunc = retFunc.bgHex(bgColor)
    }
    if (bold) {
      retFunc = retFunc.bold
    }
    return retFunc
  },

}

