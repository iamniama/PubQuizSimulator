class Game {
    constructor (intRounds, intRoundDuration, intPlayers){
        this.rounds = intRounds;
        this.currentRound = 1;
        this.roundDuration = intRoundDuration;
        this.currentRoundTimer = intRoundDuration;
        this.players = this.addPlayers(intPlayers);
        this.watchTimer = false;
        this.timer = setInterval(this.tick.bind(this), 1000);
        this.pointValue = 250;
        this.timeThreshold1 = 11;
        this.timeThreshold2 = 6;
    }
    addPlayers(intPlayers){
        console.log(`There will be ${intPlayers} players in this game`)
    }
    startRound(){
        this.currentRoundTimer = this.roundDuration
    }
    tick(){
        //console.log("Timer works...")
        //console.log(`watchTimer is ${this.watchTimer}, Current Round Timer: ${this.currentRoundTimer}`)
        if (this.watchTimer && this.currentRoundTimer == 0){
            console.log(`Round ${this.currentRound} ends...`)
            this.currentRoundTimer = this.roundDuration
            this.currentRound += 1
            this.pointValue = 250
            if (this.currentRound <= this.rounds) {
                console.log(`Round ${this.currentRound} begins...`)
            }else {
                console.log("Game over")
                this.watchTimer = false
                this.end()
            }
        }
        if (this.currentRoundTimer > 0 && this.watchTimer){
            this.currentRoundTimer -= 1
            console.log(`${this.currentRoundTimer} seconds remain in round ${this.currentRound}, question is worth ${this.pointValue} points`)

        }
        if (this.currentRoundTimer == this.timeThreshold1 || this.currentRoundTimer == this.timeThreshold2){
            this.pointValue -= 50
        }
    }
    start(){
        this.watchTimer = true
        this.pointValue = 250
        console.log(`new game starting...${this.watchTimer}`)
    }
    stop(){
        this.watchTimer = false
    }
    end(){
        clearInterval(this.timer)
    }
}

myGame = new Game(3, 15, 4)
myGame.start()