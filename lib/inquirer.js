const inquirer   = require('inquirer')

module.exports = {

  newCard: () => {
    return inquirer.prompt([
      {
        name: 'cardFront',
        type: 'editor',
        message: 'Enter the front of your card:\n',
        validate: function( value ) {
          if (value.length) {
            return true
          } else {
            return 'Please try again.'
          }
        }
      },
      {
        name: 'cardBack',
        type: 'editor',
        message: 'Enter the back of your card:\n',
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return 'Please try again.'
          }
        }
      }
    ])
  },

  mainMenu: () => {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'mainmenu',
        message: 'Choose an option:',
        choices: [
          'Start a practice session',
          'Add a new card',
          'Exit',
        ],
        filter: function(val) {
          return val.toLowerCase()
        },
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return 'Please try again'
          }
        }
      },
    ])
  },

  solveCard: () => {
    return inquirer.prompt([
      {
        type: 'expand',
        message: 'Did you answer correctly?',
        name: 'cardSuccess',
        choices: [
          {
            key: 'y',
            name: 'Yes',
            value: 'yes'
          },
          {
            key: 'n',
            name: 'No',
            value: 'no'
          },
          new inquirer.Separator(),
          {
            key: 'q',
            name: 'Quit to main menu',
            value: 'quit'
          },
        ],
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return 'Please try again'
          }
        }
      }
    ])
  },

  confirm: () => {
    return inquirer.prompt([
      {
        type: 'confirm',
        message: 'Are you sure?',
        name: 'confirm',
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return 'Please try again'
          }
        }
      }
    ])
  },

}
