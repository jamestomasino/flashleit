#!/usr/bin/env node
'use strict'

const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const program     = require('commander')
const Configstore = require('configstore');
var CLI         = require('clui')

const conf        = new Configstore('flashleit');
var Spinner     = CLI.Spinner;

program
  .version('1.0.0')
  .option('-a, --add','Add a card')
  .option('-c, --complete','Show completed cards')
  .parse(process.argv); // end with parse to parse through the input

clear();
console.log(
  chalk.yellow(
    figlet.textSync('flashleit', { horizontalLayout: 'full' })
  )
);

if (program.add) {
  console.log(
    chalk.green(
      'Add a card'
    )
  )
}
if (program.complete) {
  console.log(
    chalk.green(
      'Show completed cards'
    )
  )
}


var countdown   = new Spinner(
  chalk.red(
    'Exiting in 5 seconds...  '
  ),
  ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']
);
countdown.start();
var number = 5;
setInterval(function () {
  number--;
  countdown.message(
    chalk.red(
      'Exiting in ' + number + ' seconds...  '
    )
  );
  if (number === 0) {
    process.stdout.write('\n');
    process.exit(0);
  }
}, 1000);

