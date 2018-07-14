const inquirer   = require('inquirer')

var settings

module.exports = {

  init: programSettings => {
    settings = programSettings
  },

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

  optionsMenu: async () => {
    let choices = [
      'maxlevels',
      'revealDelay'
    ]
    return inquirer.prompt([
      {
        type: 'list',
        name: 'optionsmenu',
        message: 'Choose an option to change:',
        paginated: true,
        choices: choices,
      }
    ])
      .then(res => {
        let optionName = res.optionsmenu
        if (optionName === 'Exit to main menu') {
          return true
        }
        return inquirer.prompt([
          {
            type: 'input',
            name: 'option',
            message: 'New value for ' + optionName,
            default: settings.get(optionName),
          }
        ])
          .then(res => {
            let optionVal = res.option
            settings.set(optionName, optionVal)
          });
      });
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
          'Change settings',
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
        default: 'no',
      }
    ])
  },

  confirm: () => {
    return inquirer.prompt([
      {
        type: 'expand',
        message: 'Are you sure?',
        name: 'confirm',
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
        ],
      }
    ])
  },

}
