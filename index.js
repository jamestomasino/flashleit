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

const l           = console.log

// pass access to settings to our cards and questions
cards.init(settings)
inquirer.init(settings)

// Visual Styling
var error = settings.getColorProfile('error')
var info  = settings.getColorProfile('info')
var title = settings.getColorProfile('title')
var front = settings.getColorProfile('front')
var back  = settings.getColorProfile('back')

function showTitle () {
  l(title(figlet.textSync(' flashleit ', { horizontalLayout: 'full' })))
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
      break;
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
  l(info('Card successfully added'))
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
  l(info('Saving settings...'))
  utils.br()
  await utils.pause(1)
  return
}

const showCards = async () => {
  let sets = cards.getSets()
  sets[0].checked = true
  let sessionSets = await inquirer.sessionSets(sets)
  let today = cards.generateSessionCards(sessionSets.sessionSets)
  today = utils.shuffle(today)
  let i = today.length
  if (i) {
    while (i--) {
      if (await showCard(today[i])) return
    }
  } else {
    l(info('All cards reviewed for today'))
    await utils.pause(1)
    return
  }
}

const showCard = async (index) => {
  clear()
  let c = cards.getCard(index)
  l(front(c.front))
  await utils.pause(settings.get('revealDelay'))
  l(back(c.back))
  const solveCardResponse = await inquirer.solveCard()
  switch (solveCardResponse.cardSuccess) {
    case 'yes':
      cards.updateCard(index, true)
      break
    case 'no':
      cards.updateCard(index, false)
      break
    case 'quit':
      return true // will quit card cycle
      break
  }
  return false
}

program
  .version(pkg.version)
  .parse(process.argv)
mainMenu()
