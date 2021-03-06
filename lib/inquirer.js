const inquirer = require('inquirer')

var settings

const self = module.exports = {

  init: programSettings => {
    settings = programSettings
  },

  getSetorNew: async (sets = []) => {
    // Manually add option for new set to top
    sets.unshift(settings.get('newSetString'))
    return inquirer.prompt([
      {
        name: 'set',
        type: 'list',
        message: 'Add to set:',
        paginated: true,
        choices: sets,
      }
    ])
      .then(async (res) => {
        let set
        if (res.set === settings.get('newSetString')) {
          let newSetRes = await inquirer.prompt([
            {
              type: 'input',
              name: 'newset',
              message: 'New set name:'
            }
          ])
          set = newSetRes.newset
        } else {
          set = res.set
        }
        return set
      })
  },

  newCard: (sets = []) => {
    return inquirer.prompt([
      {
        name: 'cardFront',
        type: 'editor',
        message: 'Enter the front of your card:\n',
        validate: function (value) {
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
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please try again.'
          }
        }
      },
    ])
      .then(async (res) => {
        return {
          'cardFront': res.cardFront,
          'cardBack': res.cardBack,
          'set': await self.getSetorNew(sets)
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
            message: 'New value for ' + optionName + ':',
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
        message: 'Main Menu:',
        choices: [
          'Start a practice session',
          'Add a new card',
          'Change settings',
          'Exit',
        ],
        filter: function (val) {
          return val.toLowerCase()
        },
        validate: function (value) {
          if (value.length) {
            return true
          } else {
            return 'Please try again'
          }
        }
      },
    ])
  },

  chooseSessionSets: (sets) => {
    return inquirer.prompt([
      {
        type: 'checkbox',
        name: 'sessionSets',
        message: 'Choose sets to review:',
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
      .then(res => {
        switch (res.cardSuccess) {
          case 'yes':
            return true
          case 'no':
            return false
          case 'quit':
          default:
            return 'quit'
        }
      })
  },

  confirm: () => {
    return inquirer.prompt([
      {
        type: 'expand',
        message: 'Confirm?',
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
