const utils       = require('./utils');
var settings = {}
var cards = []
var todaysCards = []

var self = module.exports = {

  init: (diskSettings) => {
    settings = diskSettings
    if (!settings.conf.has('cards')) {
      settings.conf.set('cards', [])
    }
    cards = settings.conf.get('cards')
  },

  updateCards : () => {
    settings.conf.set('cards', cards)
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

  getCard : index => {
    return cards[index]
  },

  isCardReviewable : (index, validLevels) => {
    let card = cards[index]
    let isReviewable = false
    if (card.level === 1) {
      isReviewable = true
    } else if (card.lastReviewed !== utils.getDay()) {
      if (validLevels.indexOf(card.level) !== -1) {
        isReviewable = true
      }
    }
    return isReviewable
  },

  generateSessionCards : () => {
    settings.updateSession()
    todaysCards = [] // reset list
    let levels = settings.getTodaysLevels()
    cards.map( (card, index) => {
      if (self.isCardReviewable(index, levels)) {
        todaysCards.push(index)
      }
    })
    return todaysCards
  },

  updateCard : async (index, success) => {
    if (index < cards.length) {
      let card = cards[index]
      card.lastReviewed = utils.getDay()
      if (success) {
        card.level++
      } else {
        if (card.level !== 1) {
          card.level = 1
        }
      }
      self.updateCards()
    }
  },

}

