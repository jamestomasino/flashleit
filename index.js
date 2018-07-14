#!/usr/bin/env node
'use strict'

const chalk       = require('chalk')
const clear       = require('clear')
const figlet      = require('figlet')
const program     = require('commander')
const Configstore = require('configstore')

const pkg         = require('./package.json')
const cards       = require('./lib/card')
const utils       = require('./lib/utils');
const settings    = require('./lib/settings');
const inquirer    = require('./lib/inquirer');

const l           = console.log
var diskConf    = new Configstore(pkg.name)

/* [x] Setup Program
 * [x] Check settings
 *   - [x] maxlevels
 *   - [x] session number
 * [x] Load Cards Array
 * [ ] Calculate proficiency levels to be displayed
 *   - [ ] Filter
 *   - [ ] Randomize each array
 * [x] Main menu loop
 *   - [x] Exit
 * [ ] Start main display loop
 *   - [ ] Display Card
 *   - [ ] Flip on keypress
 *   - [ ] Success, Fail, Delete, Quit
 *   - [ ] Update Card data in conf
 *   - [ ] Check for remaining cards, loop or quit
 * [x] Add Cards
 *   - [x] Prompt for cards
 *   - [x] Collect data for front & back
 *   - [x] Push data to config
 *
 */

// Initialize Settings
settings.init(diskConf)

// Initialize Card Stock
cards.init(diskConf, settings)

// Visual Styling
var error = settings.getColorProfile('error')
var info = settings.getColorProfile('info')
var title = settings.getColorProfile('title')

/* Input Cycles
*/
const mainMenu = async () => {
  // Initialize Screen, display header
  clear()
  l(title(figlet.textSync(' flashleit ', { horizontalLayout: 'full' })))
  utils.br()

  // Main menu prompt
  const menuResponse = await inquirer.mainMenu();

  // Handle menu choices
  switch (menuResponse.mainmenu) {
    case 'exit':
      if (await confirm()) {
        await utils.die()
      }
      break;
    case 'add a new card':
      await newCard()
      break;
    default:
      mainMenu()
      break;
  }

  mainMenu();
}

const newCard = async () => {
  clear()
  const newCardResponse = await inquirer.newCard();
  cards.addCard(newCardResponse.cardFront, newCardResponse.cardBack)
  l(info('Card successfully added'))
  utils.br(2)
  await utils.pause()
  return;
}

const confirm = async () => {
  const confirmResponse = await inquirer.confirm();
  switch (confirmResponse.confirm) {
    case 'yes':
      return true
      break;
    case 'no':
      return false
      break;
  }
  return true;
}

const solveCard = async () => {
  const solveCardResponse = await inquirer.solveCard();
  switch (solveCardResponse.cardSuccess) {
    case 'yes':
      break;
    case 'no':
      break;
    case 'quit':
      break;
  }
  return;
}

/* Start main program loop
*/
program
  .version('1.0.0')
  .parse(process.argv)
mainMenu()
