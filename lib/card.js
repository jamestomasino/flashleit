var conf, cards = []
var settings = {}

var self = module.exports = {

  init: (diskConf, settings) => {
    conf = diskConf
    if (!conf.has('cards')) {
      conf.set('cards', [])
    }
    cards = conf.get('cards')
  },

  addCard : (front, back) => {
    let card = {
      'front': front,
      'back': back,
      'level': 1,
      'lastReviewed': new Date()
    }
    cards.push(card)
    self.updateCards()
  },

  updateCards : () => {
    conf.set('cards', cards)
  },

}

