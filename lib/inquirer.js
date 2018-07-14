const inquirer   = require('inquirer')

module.exports = {

  newCard: () => {
    return inquirer.prompt([
      {
        name: 'cardFront',
        type: 'editor',
        message: 'Enter the front of your card',
        validate: function( value ) {
          if (value.length) {
            return true
          } else {
            return 'Enter the front of your card'
          }
        }
      },
      {
        name: 'cardBack',
        type: 'editor',
        message: 'Enter the back of your card:',
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return 'You must have a card back. Please try again.'
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
          {
            name: 'Add a new card',
            disabled: 'Not yet available'
          },
          {
            name: 'Delete a card',
            disabled: 'Not yet available'
          },
          'Exit',
        ],
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
}
