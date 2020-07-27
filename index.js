const { GuessBot, startWord, guessWord } = require('./bots/guess_bot.js')

const BANDIT_BOT_ID = '<@U017GNL24JY>'

class MyBot extends GuessBot {
  constructor () {
    super()
    this.banditBotId = BANDIT_BOT_ID
    this.start()
    this.actions = {}
    this.maxValue = 100
  }

  updateActions(action, value) {
    this.actions[action] = value
  }
  // store guesses and points

  handleGameStart(actionSpace, banditBotId) {
    if (banditBotId) {
      this.banditBotId = `<@${banditBotId}>`
    }
    this.space = actionSpace
    actionSpace.map(s => this.updateActions(s, null))
    this.send(`Wow this is hard, what should I choose? ${this.space.join(', ')}`)
    this.makeGuess(this.getGuess())
  }

  handleReward ({reward, guess, totalScore, remaining}, banditBotId) {
    this.send(`I ${guess}ed and got ${reward} points.`)

    // This is where your guess logic goes. The idea is to maximize your total points.
    // Currently, I'm just iterating over the whole action space.
    if (remaining > 0 && reward === this.maxValue) {
      this.makeGuess(guess)
    }
  }

  handleGameOver ({ totalScore }, banditBotId) {
    this.send(`I scored a total of ${totalScore} points.`)
  }

  getGuess() {
    var guesses = Object.keys(this.actions).filter(k => this.actions[k] === null)
    if (guesses.length > 0) {
      return guesses[0]
    } else {
      const guess = Math.max.apply(null,Object.keys(this.actions).map(k => this.actions[k] ));
      console.log(guess)
      return guess
    }
  }

  makeGuess (guess) {
    this.send(`${this.banditBotId} ${guessWord} ${guess}`)
  }

  start () {
    this.send(`${this.banditBotId} ${startWord}`)
  }
}

const bot = new MyBot()
