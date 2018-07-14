const utils       = require('./utils');
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
      'lastReviewed': null
    }
    cards.push(card)
    self.updateCards()
  },

  isCardReviewable : index => {
    let card = cards[index]
    let isReviewable = false
    if (card.level === 1) {
      isReviewable = true
    } else if (card.lastReviewed !== util.getDay()) {
      isReviewable = true
    }
    return isReviewable
  },

  moveCard : (index, level) => {
    if (cards.length < index && level <= settings.get('maxlevels')) {
      let card = cards[index]
      card.lastReviewed = util.getDay()
      card.level = level
    } else {
      throw new Error('Illegal operation: card or level out of bounds')
      utils.die()
    }
  },

  updateCards : () => {
    conf.set('cards', cards)
  },

}

