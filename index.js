#!/usr/bin/env node
'use strict'

const pkg         = require('./package.json')
const chalk       = require('chalk')
const clear       = require('clear')
const figlet      = require('figlet')
const program     = require('commander')

const cards       = require('./lib/card')
const utils       = require('./lib/utils')
const settings    = require('./lib/settings')
const inquirer    = require('./lib/inquirer')

// pass access to settings to our cards and questions
cards.init(settings)
inquirer.init(settings)

// Visual Styling
var error = settings.getMessageFunc('error')
var info  = settings.getMessageFunc('info')
var title = settings.getMessageFunc('title')
var front = settings.getMessageFunc('front')
var back  = settings.getMessageFunc('back')

function showTitle () {
  title(figlet.textSync(' flashleit ', { horizontalLayout: 'full' }))
  utils.br()
}

const mainMenu = async () => {
  // Initialize Screen, display header
  clear()
  showTitle()
  // Main menu prompt
  const menuResponse = await inquirer.mainMenu()

  // Handle menu choices
  switch (menuResponse.mainmenu) {
    case 'exit':
      if (await confirm()) {
        await utils.die()
      }
      break
    case 'add a new card':
      await newCard()
      break
    case 'start a practice session':
      await showCards()
      break
    case 'change settings':
      await showOptions()
      break
    default:
      mainMenu()
      break
  }

  // Loop back to main menu
  mainMenu()
}

const newCard = async () => {
  clear()
  const newCardResponse = await inquirer.newCard(cards.getSets())
  cards.addCard(newCardResponse.cardFront, newCardResponse.cardBack, newCardResponse.set)
  info('Card successfully added')
  utils.br(2)
  await utils.pause()
  return
}

const confirm = async () => {
  const confirmResponse = await inquirer.confirm()
  switch (confirmResponse.confirm) {
    case 'yes':
      return true
      break
    case 'no':
      return false
      break
  }
  return true
}

const showOptions = async () => {
  clear()
  showTitle()
  await inquirer.optionsMenu()
  info('Saving settings...')
  utils.br()
  await utils.pause(1)
  return
}

const showCards = async () => {
  let sets = cards.getSets()
  sets[0].checked = true
  let sessionSets = await inquirer.chooseSessionSets(sets)
  let today = cards.generateSessionCards(sessionSets.sessionSets)
  today = utils.shuffle(today)
  let i = today.length
  if (i) {
    while (i--) {
      if (await showCard(today[i])) return
    }
  } else {
    info('All cards reviewed for today')
    await utils.pause(1)
    return
  }
}

const showCard = async (index) => {
  clear()
  let c = cards.getCard(index)
  front(c.front)
  await utils.pause(settings.get('revealDelay'))
  back(c.back)
  const solveCardResponse = await inquirer.solveCard()
  if (solveCardResponse === 'quit') {
    return true
  } else {
    cards.reviewCard(index, solveCardResponse)
  }
  return false
}

program
  .version(pkg.version)
  .parse(process.argv)
mainMenu()
