class Game {
    constructor (intRounds, intRoundDuration, intPlayers){
        this.rounds = intRounds;
        this.currentRound = 1;
        this.roundDuration = intRoundDuration;
        this.currentRoundTimer = intRoundDuration;
        this.players = this.addPlayers(intPlayers);
        this.watchTimer = false;
        this.timer = setInterval(this.tick, 1000)
    }
    addPlayers(intPlayers){
        console.log(`There will be ${intPlayers} players in this game`)
    }
    tick(){
        if (this.watchTimer && this.currentRoundTimer == 0){
            console.log(`Round ${this.currentRound} ends...`)
            this.currentRoundTimer = this.roundDuration
            this.currentRound += 1
            console.log(`Round ${this.currentRound} begins...`)
        }
        if (this.currentRoundTimer > 0 && this.watchTimer){
            this.currentRoundTimer -= 1
            console.log(`${this.currentRoundTimer} seconds remain in round ${this.currentRound}`)

        }
    }
    start(){
        this.watchTimer = true
    }
    stop(){
        this.watchTimer = false
    }
}

myGame = new Game(3, 15, 4)
myGame.start()