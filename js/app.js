const icons = ["🍻", "🥤", "🥂", "✨"]
const remarks = ["i am the greatest!!", "You suck, player 1!", "lorem ipsem dolor", "eat my shorts!"]
const dieuxRemarks = ["Bow before us", "You are but mortals...", "Fall..."]


class Team {
    constructor (strName, intIcon){
        this.name = strName;
        this.icon = icons[intIcon];
        this.answered = false;
        this.wasRight = false
        this.passed = false;
        this.score = 0;
    }
}

class NPCTeam extends Team {
    constructor(strname, intIcon, intGuesses, intEntryTime, intAnswerChance, colorCommentary){
        super(strname, intIcon);
        this.chances = intGuesses;
        this.Earliest = intEntryTime;
        this.AnswerChance = intAnswerChance;
        this.comments = colorCommentary;
    }
    guess(arrQList){
        return (arrQList[Math.floor(Math.random(1) * arrQList.length)])
    }
    makeComment(){
        if (this.wasRight || this.answered == false){
            return(this.comments[Math.floor(Math.random() * this.comments.length)])
        }else {
            return " "
        }
    }
}



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
        console.log(`There would be ${intPlayers} players in this game`)
        return ([new NPCTeam("Space Monkeys", 0, 2, 11, 80, remarks), new NPCTeam("Lab Rats", 1, 1, 12, 95, remarks), new NPCTeam("Drunky Brewster",2, 0, 2, 1, remarks), new NPCTeam("Les Dieux", 3, 10, 14, 99, dieuxRemarks)])
    }
    resetPlayers(){
        for (let player of this.players){
            player.answered = false
            player.wasRight = false
            player.passed = false
        }
    }
    trashTalk(){
        for (let player of this.players){
            let remark = player.makeComment()
            if (remark.length > 2){
                console.log(`${player.name} says "${remark}"`)
            }
            
        }
    }
    whoWon(){
        let winnerName = ""
        for (let i = 1; i < this.players.length;i++){
            if (this.players[i].score > this.players[i-1].score){
                winnerName = this.players[i].name
            }else {
                winnerName = this.players[i-1].name
            }

        }
        return winnerName
    }
    checkAnswer(player, options, correctAnswer, chances){
        for (let i=0; i<=chances;i++){
            if (player.guess(options) == correctAnswer){
                console.log(`Guess ${i} right`)
                return true
            }
            else{ 
                console.log(`Guess ${i} wrong`)
            }
            
        }
        return false
    }
    processGuesses(options, correctAnswer, score){
        for (let player of this.players){
            //console.log(`${player.name} has answered: ${player.answered}`)
            if (this.currentRoundTimer < player.Earliest && !player.answered){
                if (Math.floor(Math.random() * 100) < player.AnswerChance){
                    player.answered = true
                    if (this.checkAnswer(player, options,correctAnswer, player.chances)){
                        player.wasRight = true
                        console.log(`${player.name} ${player.icon} was right!`)
                        player.score += score
                    }else {
                        player.wasRight = false
                        console.log(`${player.name} ${player.icon} was wrong!`)
                        player.score -= 50
                    }
                    
                    
                }
            }
        }
    }
    penalizeSkips(){
        for (let player of this.players){
            if (player.answered == false){
                player.score -= 100
            }
        }
    }
    startRound(){
        this.currentRoundTimer = this.roundDuration
    }
    tick(){
        if (this.watchTimer && this.currentRoundTimer == 0){
            console.log(`Round ${this.currentRound} ends...`)
            this.currentRoundTimer = this.roundDuration
            this.currentRound += 1
            this.pointValue = 250
            this.penalizeSkips()
            if (this.currentRound <= this.rounds) {
                console.log(`Next round (${this.currentRound}/${this.rounds}) begins...`)
                console.log(`End of round ${this.currentRound} scores:`)
                for (let player of this.players){
                    console.log(`${player.name}: ${player.score}`)
                }
                this.resetPlayers()
                this.trashTalk()
            }else {
                console.log("Game over")
                console.log("Final Scores:")
                for (let player of this.players){
                    console.log(`${player.name}: ${player.score}`)
                }
                console.log(`${this.whoWon()} won the game! `)
                this.watchTimer = false
                this.end()
            }
        }
        if (this.currentRoundTimer > 0 && this.watchTimer){
            this.currentRoundTimer -= 1
            console.log(`${this.currentRoundTimer} seconds remain in round ${this.currentRound}, question is worth ${this.pointValue} points`)
            this.processGuesses(["a", "b", "c", "d"], "d", this.pointValue)

        }
        if (this.currentRoundTimer == this.timeThreshold1 || this.currentRoundTimer == this.timeThreshold2){
            this.pointValue -= 50
        }
    }
    start(){
        this.watchTimer = true
        this.pointValue = 250
        console.log(`new game starting...${this.watchTimer}`)
        console.log(`Round (${this.currentRound}/${this.rounds}) begins...`)
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