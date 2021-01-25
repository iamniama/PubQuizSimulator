const icons = ["🍻", "🥤", "🥂", "✨"]
const remarks = ["i am the greatest!!", "You suck, player 1!", "lorem ipsem dolor", "eat my shorts!"]
const dieuxRemarks = ["Bow before us", "You are but mortals...", "Fall..."]
let qChoices = ["a", "b", "c", "d"]

class Question {
    constructor (strQuestion, strA1, strA2, strA3, strA4, charCorrect, strJ1, strJ2, strJ3, strJ4){
        this.questionText = strQuestion;
        this.right = charCorrect;
        this.answers = [
            {letter: "a", answerText: strA1, jokeText: strJ1},
            {letter: "b", answerText: strA2, jokeText: strJ2},
            {letter: "c", answerText: strA3, jokeText: strJ3},
            {letter: "d", answerText: strA4, jokeText: strJ4}
        ]
    }
    prune(){
        for (let i=0;i<this.answers.length;i++) {
            if (this.answers[i].letter != this.right){
                this.answers.splice(i, 1)
                return(this.answers[i].letter)
            }
        }
    }
    getChoices(){
        let arrReturn = []
        for (let answer of this.answers){
            arrReturn.push(answer.letter)
        }
        return arrReturn
    }
}



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
        this.questions = this.getQuestions(intRounds);
        this.currentQuestion = 0;
        this.timer = setInterval(this.tick.bind(this), 1000);
        this.pointValue = 250;
        this.timeThreshold1 = 11;
        this.timeThreshold2 = 6;
    }
    getQuestions(rnds){
        return [new Question("Question 1?", "foo", "bar", "bat", "baz", "a", "oof", "rab", "tab", "zab"), new Question("Question 2?", "foo", "bar", "bat", "baz", "d", "oof", "rab", "tab", "zab"), new Question("Question 3", "foo", "bar", "bat", "baz", "c", "oof", "rab", "tab", "zab"), new Question("Question 4?", "fooz", "ballz", "bat", "baz", "c", "oof", "rab", "tab", "zab")]
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
        this.currentQuestion = this.questions[this.currentRound]
    }
    tick(){
        if (this.watchTimer && this.currentRoundTimer == 0){
            console.log(`Round ${this.currentRound} ends...`)
            this.currentRoundTimer = this.roundDuration
            this.pointValue = 250
            this.penalizeSkips()
            this.currentRound += 1
            if (this.currentRound <= this.rounds) {
                console.log(`End of round ${this.currentRound} scores:`)
                console.log(`Next round (${this.currentRound}/${this.rounds}) begins...`)
                console.log(`The question is:  ${this.currentQuestion.questionText}`)
                for (let player of this.players){
                    console.log(`${player.name}: ${player.score}`)
                }
                this.trashTalk()
                this.resetPlayers()
                this.currentQuestion = this.questions[this.currentRound - 1]
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
            //console.log(`${this.currentRoundTimer} seconds remain in round ${this.currentRound}, question is worth ${this.pointValue} points`)
            this.processGuesses(this.currentQuestion.getChoices(), this.currentQuestion.right, this.pointValue)

        }
        if (this.currentRoundTimer == this.timeThreshold1 || this.currentRoundTimer == this.timeThreshold2){
            this.pointValue -= 50
            this.currentQuestion.prune()
        }
    }
    start(){
        this.watchTimer = true
        this.pointValue = 250
        console.log(`new game starting...${this.watchTimer}`)
        console.log(`Round (${this.currentRound}/${this.rounds}) begins...`)
        this.currentQuestion = this.questions[0]
        console.log(`The question is:  ${this.currentQuestion.questionText}`)
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