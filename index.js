#!/usr/bin/env node
'use strict'

const pkg         = require('./package.json')
const chalk       = require('chalk')
const clear       = require('clear')
const figlet      = require('figlet')
const program     = require('commander')
const Configstore = require('configstore')
const utils       = require('./lib/utils');
const settings    = require('./lib/settings');
const inquirer    = require('./lib/inquirer');

const l           = console.log
var diskConf    = new Configstore(pkg.name)

/* [x] Setup Program
 * [x] Check settings
 *   - [x] maxlevels
 *   - [x] session number
 * [ ] Check for switches
 *   - [ ] Check for debug
 *   - [ ] Check for card addition
 *   - [ ] Check for display complete
 *   - [x] Check for set maxlevels
 * [ ] Load Cards Array
 * [ ] Calculate proficiency levels to be displayed
 *   - [ ] Filter
 *   - [ ] Randomize each array
 * [ ] Start main display loop
 *   - [ ] Display Card
 *   - [ ] Flip on keypress
 *   - [ ] Success, Fail, Delete, Quit
 *   - [ ] Update Card data in conf
 *   - [ ] Check for remaining cards, loop or quit
 */


/* Settings
 *  - load from disk
 *  - update all local settings with disk settings
 *  - add any new local settings to disk (for updates)
 *  - if no disk settings, initialize
 */
if (diskConf.has('settings')) {
  let s, diskSettings = diskConf.get('settings')
  for (s in diskSettings) {
    settings[s] = diskSettings[s]
  }
  for (s in settings) {
    if (! diskSettings.hasOwnProperty(s)) {
      diskConf.set('settings.' + s, settings[s])
    }
  }
} else {
  diskConf.set('settings', settings)
}

/* Visual Styling
*/
var error = chalk.red // fallback
if (settings.errorColor) {
  error = chalk.hex(settings.errorColor)
}
if (settings.errorBGColor) {
  error = error.bgHex(settings.errorBGColor)
}
if (settings.errorBold) {
  error = error.bold
}

var info = chalk.red // fallback
if (settings.infoColor) {
  info = chalk.hex(settings.infoColor)
}
if (settings.infoBGColor) {
  info = info.bgHex(settings.infoBGColor)
}
if (settings.infoBold) {
  info = info.bold
}

var title = chalk.red // fallback
if (settings.titleColor) {
  title = chalk.hex(settings.titleColor)
}
if (settings.titleBGColor) {
  title = title.bgHex(settings.titleBGColor)
}
if (settings.titleBold) {
  title = title.bold
}

program
  .version('1.0.0')
  .option('-a, --add','Add a card')
  .option('-c, --complete','Show completed cards')
  .option('-m, --maxlevels <n>', 'Set maximum proficiency levels', parseInt)
  .option('-d, --debug')
  .parse(process.argv) // end with parse to parse through the input

// Check for arguments
if (program.complete) {
  l(info('Show completed cards'))
  utils.die()
}

if (program.add) {
  l(info('Add a card'))
  utils.die()
}

if (program.maxlevels > 1) {
  l(info('Set maximum proficiency levels to %s'), program.maxlevels)
  settings.maxlevels = program.maxlevels
  diskConf.set('settings.maxlevels', program.maxlevels)
  utils.die()
}

if (program.debug) {
  l(info( 'settings: %j'), settings)
}

const mainMenu = async () => {
  // Initialize Screen, display header
  clear()
  l(title(figlet.textSync(' flashleit ', { horizontalLayout: 'full' })))
  utils.br()

  // Main menu prompt
  const menuResponse = await inquirer.mainMenu();

  // Handle menu choices
  switch (menuResponse.mainmenu) {
    case 'Exit':
      await utils.die()
      break;
    case 'Add a new card':
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

  // Main menu prompt
  const newCardResponse = await inquirer.newCard();
  l(info(JSON.stringify(newCardResponse)))
  utils.br(2)
  await utils.pause(5)
  return;
}



mainMenu()
