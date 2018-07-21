const inquirer   = require('inquirer')

var settings

module.exports = {

  init: programSettings => {
    settings = programSettings
  },

  newCard: (sets=[]) => {
    sets.unshift('Define a new set')
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
      },
      {
        name: 'set',
        type: 'list',
        message: 'Add to set',
        paginated: true,
        choices: sets,
      }
    ])
      .then( async function (res) {
        let set
        if (res.set === 'Define a new set') {
          let newsetRes = await inquirer.prompt([
            {
              type: 'input',
              name: 'newset',
              message: 'New set name'
            }
          ])
          set = newsetRes.newset
        } else {
          set = res.set
        }

        return {
          'cardFront': res.cardFront,
          'cardBack': res.cardBack,
          'set': set
        }
      })
  },

  optionsMenu: async () => {
    let keys = {
      'maxlevels': /[2-9][0-9]*/,
      'revealDelay': /[1-9][0-9]*/,
      'frontColor': /^#(?:[0-9a-f]{3}){1,2}$/i,
      'backColor': /^#(?:[0-9a-f]{3}){1,2}$/i,
      'Back to main menu': ''
    }
    let choices = []
    for (var s in keys) {
      if (s === 'Back to main menu') {
        choices.push(s)
      } else {
        choices.push(s + ' [' + settings.get(s) + ']')
      }
    }
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
        let optionName = res.optionsmenu.split(' ')[0]
        if (optionName === 'Back') {
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
            // check optionVal against regex for setting before saving
            let regex = keys[optionName]
            if (regex.test(optionVal)) {
              settings.set(optionName, optionVal)
            } else {
              console.log('\nInvalid format for setting\n')
            }
          })
      })
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

  sessionSets: (sets) => {
    return inquirer.prompt([
      {
        type: 'checkbox',
        name: 'sessionSets',
        message: 'Choose an option:',
        choices: sets,
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
        default: 'yes',
      }
    ])
  },

}
