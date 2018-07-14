# flashleit ![license](https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square)

**flashleit** is a node implementation of a Leitner spaced repetition system.

## Installation

### Install

`npm i -g flashleit`

or

`yarn global add flashleit`

## Using the Leitner System

Each day you use **flashleit** begins a `session`. During that session you will
review a set of cards, marking each reviewed as either a success or a failure.
Successes will advance the card to the next proficiency level. Failure will
return the card back to proficiency level 1.

Each card is displayed on a schedule based on its current proficiency level.

- Proficiency level 1 cards are shown every session
- Proficiency level 2 cards are shown every two sessions
- Proficiency level 3 cards are shown every three sessions
- And so on

**flashleit** allows you to customize the number of proficiency levels you
would like to use.

**Note**: _Once a card reaches the maximum proficiency level it will not be
shown again. This card has been successfully memorized._

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

[GPL3](LICENSE)
