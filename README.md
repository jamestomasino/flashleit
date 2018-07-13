# flashleit ![license](https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square)

**flashleit** is a posix shell implementation of a Leitner spaced repetition system.

## Installation

### Install

`sudo make install`

_Note: On systems without admin access the binary can be run directly from the
git repo, but will lack `man` support._

### Uninstall

`sudo make uninstall`

## Using the Leitner System

Each day you use **flashleit** begins a `session`. During that session you will review a set of cards, marking each reviewed as either a success or a failure. Successes will advance the card to the next proficiency level. Failure will return the card back to proficiency level 1.

Each card is displayed on a schedule based on its current proficiency level.

- Proficiency level 1 cards are shown every session
- Proficiency level 2 cards are shown every two sessions
- Proficiency level 3 cards are shown every three sessions
- And so on

**flashleit** allows you to customize the number of proficiency levels you would like to use.

**Note**: Once a card reaches the maximum proficiency level it will not be shown again. This card  has been successfully memorized.

**Note**: Cards at proficiency level 1 will be shown repeatedly until successfully advanced to level 2 or the program is quit.

### Shuffle

Each category is shuffled before review.

### Review order

The highest proficiency level scheduled for each day's session will be displayed first. Once that is completed the lower proficiency levels will follow until all cards have been reviewed.

## Adding Cards

You may add a card to **flashleit** by running the program with the switch `-a`. You will be prompted for the card front and back values and a confirmation before the card is inserted into proficiency level 1.

## Deleting Cards

You may choose to delete a card during review. If you do so you will be asked to confirm deletion before it takes effect.

## Reviewing Memorized Cards

You can see a list of all cards which you have fully memorized by running the program with the switch `-c`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

[GPL3](LICENSE)
