const utils       = require('./utils')
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

  get length () {
    return cards.length
  },

  addCard : (front, back, set) => {
    let card = {
      'front': front,
      'back': back,
      'level': 1,
      'lastReviewed': null,
      'set': set
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

  generateSessionCards : (sets) => {
    settings.updateSession()
    todaysCards = [] // reset list
    let levels = settings.getTodaysLevels()
    cards.map( (card, index) => {
      if (self.isCardReviewable(index, levels)) {
        if (sets.indexOf(card.set) !== -1 ||
           ((sets.indexOf(settings.get('nullSet')) !== -1 && !card.set ))) {
          todaysCards.push(index)
        }
      }
    })
    return todaysCards
  },

  getSets : () => {
    return cards.reduce( (acc, val) => {
      if (val.set) {
        let i = acc.length
        // if we already have set name in accumulator, return
        while (i--) {
          if (acc[i].name === val.set) {
            return acc
          }
        }
        // otherwise, add to set list
        acc.push({ name: val.set})
      }
      return acc
    },
      [{name: settings.get('nullSet'), checked: true}]
    )
  },

  reviewCard : (index, success) => {
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

