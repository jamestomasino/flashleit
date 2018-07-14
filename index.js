#!/usr/bin/env node
'use strict'

const pkg         = require('./package.json')
const chalk       = require('chalk')
const clear       = require('clear')
const figlet      = require('figlet')
const program     = require('commander')
const Configstore = require('configstore')
var CLI         = require('clui')

const l           = console.log
var diskConf    = new Configstore(pkg.name)
var Spinner     = CLI.Spinner
var Progress    = CLI.Progress;

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
let settings = {
  maxlevels: 7,
  session: 1
}
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

/* Color styles
*/
const error   = chalk.bold.red
const warn    = chalk.magentaBright
const info    = chalk.blue
const title   = chalk.black.bgYellow.bold

/* Shutdown function
 *  - display countdown spinner for shutdown
 *  - save all data
 *  - clear screen
 *  - exit
 */
function die () {
  process.stdout.write('\n');
  var thisProgressBar = new Progress(45);

  var countdown = new Spinner(
    warn(thisProgressBar.update(0)),
    ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']
  )
  countdown.start();
  var number = 1
  setInterval(() => {
    countdown.message(warn(thisProgressBar.update(number, 100)))
    number+=2
    if (number >= 100) {
      clear()
      process.exit(0)
    }
  }, 50)
}

program
  .version('1.0.0')
  .option('-a, --add','Add a card')
  .option('-c, --complete','Show completed cards')
  .option('-m, --maxlevels <n>', 'Set maximum proficiency levels', parseInt)
  .option('-d, --debug')
  .parse(process.argv); // end with parse to parse through the input

clear();

// Startup Screen
l(title(figlet.textSync(' flashleit ', { horizontalLayout: 'full' })));

// Check for arguments
if (program.complete) {
  l(info('Show completed cards'))
  die();
}

if (program.add) {
  l(info('Add a card'))
  die();
}

if (program.maxlevels > 1) {
  l(info('Set maximum proficiency levels to %s'), program.maxlevels)
  settings.maxlevels = program.maxlevels
  diskConf.set('settings.maxlevels', program.maxlevels)
  die();
}

if (program.debug) {
  l(info( 'settings: %j'), settings)
}

die();
