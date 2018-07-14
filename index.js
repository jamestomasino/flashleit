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

if (diskConf.has('settings')) {
  let s, diskSettings = diskConf.get('settings')
  for (s in diskSettings) {
    settings[s] = diskSettings[s]
    l(s, settings[s])
    utils.die()
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
const error   = chalk.hex(settings.errorColor)
const info    = chalk.hex(settings.infoColor)
const title   = chalk.black.bgHex(settings.titleColor).bold

/* Shutdown function
 *  - display pause
 *  - save all data
 *  - clear screen
 *  - exit
 */
program
  .version('1.0.0')
  .option('-a, --add','Add a card')
  .option('-c, --complete','Show completed cards')
  .option('-m, --maxlevels <n>', 'Set maximum proficiency levels', parseInt)
  .option('-d, --debug')
  .parse(process.argv) // end with parse to parse through the input

// Initialize Screen, display header
clear()
l(title(figlet.textSync(' flashleit ', { horizontalLayout: 'full' })))
utils.br()

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

utils.die()
