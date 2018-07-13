#!/usr/bin/env node
'use strict'

const program = require('commander')
program
  .version('1.0.0')
  .option('-a, --add','Add a card')
  .option('-c, --complete','Show completed cards')
  .parse(process.argv); // end with parse to parse through the input

console.log('---')
if (program.add) {
  console.log('Add a card')
}
if (program.complete) {
  console.log('Show completed cards')
}
