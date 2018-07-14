#!/usr/bin/env node
'use strict'

const pkg         = require('./package.json');
const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const program     = require('commander')
const Configstore = require('configstore');
var CLI         = require('clui')

const diskConf    = new Configstore(pkg.name);
var Spinner     = CLI.Spinner;

// Default Settings
let settings = {
  maxlevels: 7,
}

// Get Settings from system config
if (diskConf.has('settings')) {
  settings = diskConf.get('settings')
}

/* [x] Setup Program
 * [x] Check options
 * [ ] Load Cards Array
 * [ ] Look up current session
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

function die () {
  // Add some space and start the exit countdown
  process.stdout.write('\n');
  var countdown = new Spinner(
    chalk.red(
      'Exiting in 5 seconds...  '
    ),
    ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']
  )
  countdown.start();
  var number = 5
  setInterval(() => {
    number--
    countdown.message( chalk.red( 'Exiting in ' + number + ' seconds...  '));
    if (number === 0) {
      clear()
      process.exit(0)
    }
  }, 1000)
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
console.log(
  chalk.yellow(
    figlet.textSync('flashleit', { horizontalLayout: 'full' })
  )
);

// Check for arguments
if (program.complete) {
  console.log(
    chalk.green(
      'Show completed cards'
    )
  )
  die();
}

if (program.add) {
  console.log(
    chalk.green(
      'Add a card'
    )
  )
  die();
}

if (program.maxlevels > 1) {
  console.log(
    chalk.green(
      'Set maximum proficiency levels to %s'
    ),
    program.maxlevels
  )
  settings.maxlevels = program.maxlevels
  diskConf.set('settings.maxlevels', program.maxlevels)
  die();
}

if (program.debug) {
  console.log(
    chalk.blue(
      'settings: %j'
    ),
    settings
  )
}

die();
