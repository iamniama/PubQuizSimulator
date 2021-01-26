const icons = ["🍻", "🥤", "🥂", "✨", "🔥"]
const remarks = ["i am the greatest!!", "You suck, player 1!", "lorem ipsem dolor", "eat my shorts!"]
const karenRemarks = ["IIIIYYYYEeeeaahhhhh I'm gonna need the manager here, like niao", "You're not my supervisor!!!", "Oh em gee barternder is hawt!", "Drink! EMPTY! uuughhh!", "bbbrrruuwuuuwuuuugggghhhhh", "YYYAAAAAAAYYYYYY!!!", "America's ()() BABY!"]
const dieuxRemarks = ["Bow before us", "You are but mortals...", "Fall..."]
const buzMarks = ["Boom, right in the nick of time", "Zing!", "Whoooosh", "*BOW*"]
let qChoices = ["a", "b", "c", "d"]

/* 
The Question object represents a trivia question, its 4 possible answers, and alternate text to be displayed as possible 
answers are removed from the board.  By default, a Game object contains 10 Questions
The prune method removes one possible answer from the list
The getChoices method gets all remaining answer letters, used by the NPCPlayer object to make its random selection.
*/

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

const fallbackString = "The other side was actually funnier..."
const questionAlpha = new Question("Which British actor has played James Bond the least number of times?", "Rowan Atkinson", "George Lazenby", "Sean Connery", "Daniel Craig", "a", "", "Zero is less than one", "Not thish one", "Quantum of Nope")
const questionBeta = new Question("Who played 'The Master' alongside Michelle Gomez's Missy in Doctor Who?", "Peter Capaldi", "Jon Hamm", "Jon Simm", "Mark Hamill", "c", "*GASP!!!*", "Different kind of Mad Man", " ", "Use the TARDIS, Luke!")
const questionDelta = new Question("Robert Downey, Jr released a full length studio album in 2004.  What was its title?", "Black Coffee Blues", "The Futurist", "Little Joe Sure Can Sing", "Rehab", "b", "Not even close", "", "Getting warm", "Maybe the same one, years apart?")
const questionGamma = new Question("What was the name of Iron Maiden frontman Bruce Dickinson's first solo album?", "The Wicker Man", "Brave New World", "Tattooed Millionaire", "Sorry, Eddie", "c", "Iron Maidens like Wicker Men", "There is more to Maiden than the singer", " ", "Actually, the other side was funnier")
const questionEpsilon = new Question("What are the two main ingredients of a Dark and Stormy (cocktail)?", "rum and coke", "bacardi 151 and bailey's irish cream", "dark rum and ginger beer", "tequila and kahlua", "c", "not even with a lime", "more like a cement mixer", " ", fallbackString)
const questionZeta = new Question("In what modern day country was Nikola Tesla born?", "Romania", "Argentina", "Belgium", "Croatia", "d", "no electric dracula", fallbackString, "mmm...electric chocolate", " ")
/*
const questionEta = new Question
const questionTheta = new Question
const questionIota = new Question
const questionKappa = new Question
const questionLamda = new Question
const questionMu = new Question
const questionNu = new Question
const questionXi = new Question
const questionOmicron = new Question
const questionPi = new Question
const questionRho = new Question
const questionSigma = new question
const questionTau = new Question
const questionUpsilon = new Question
*/

/* 
The Team object represents the player in the Game object and is the base class for the NPCTeam object 
*/

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

/* 
The NPCTeam object extends the Team class to include attributes used to simulate varying 
skill levels of opponents.  
The Earliest attribute represents the earliest second in the countdown that the Team will answer.  Higher = earlier
The AnswerChance attribute is the chance per tick (1 second) that the team will attempt to answer.  Higher = more likely
The chances attribute allows a team to have more than one random guess at an answer.  Higher = more likely to get a right answer

The guess method selects a random possible answer
the makeComment method allows NPCTeams to provide color commentary at the end of the round
*/


class NPCTeam extends Team {
    constructor(strname, intIcon, intGuesses, intEntryTime, intAnswerChance, colorCommentary){
        super(strname, intIcon);
        this.chances = intGuesses;
        this.Earliest = intEntryTime;
        this.AnswerChance = intAnswerChance;
        this.comments = colorCommentary;
    }
    guess(arrQList){
        return (arrQList[Math.floor(Math.random() * arrQList.length)])
    }
    makeComment(){
        if (this.wasRight || this.answered == false){
            return(this.comments[Math.floor(Math.random() * this.comments.length)])
        }else {
            return " "
        }
    }
}
// 4
const midworld = new NPCTeam("Midworld Lanes", 0, 1, 14, 40, remarks)
const drunky = new NPCTeam("Drunky Brewster", 2, 5, 2, 10, karenRemarks)
const buzzerBeaters = new NPCTeam("Buzzer Beaters", 4, 10, 3, 95, buzMarks)

/* 
The Game object does the majority of the heavy lifting for PQS.
It manages the timer, tracks rounds, and contains all the other objects that the game uses,
such as the Teams and the Questions.

*/

class Game {
    constructor (intRounds, intRoundDuration, intPlayers){
        this.rounds = intRounds;
        this.currentRound = 0;
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
        /* return [new Question("How does that line begin?", "foo", "bar", "bat", "baz", "a", "oof", "rab", "tab", "zab"), 
        new Question("__the Vampire Slayer?", "foo", "bar", "bat", "Buffy", "d", "oof", "rab", "tab", "zab"), 
        new Question("__ to Picasso", "foo", "bar", "Balls", "baz", "c", "oof", "rab", "tab", "zab"), 
        new Question("Question 4?", "fooz", "ballz", "bat", "baz", "c", "oof", "rab", "tab", "zab")]
        */
       return [questionBeta, questionDelta, questionEpsilon]
    }
   
    addPlayers(intPlayers){
        console.log(`There would be ${intPlayers} players in this game`)
        return ([midworld, 
                buzzerBeaters, 
                drunky, 
                new NPCTeam("Les Dieux", 3, 5, 14, 89, dieuxRemarks)])
    }
    resetPlayers(){  //reset state values  for all Teams
        for (let player of this.players){
            player.answered = false
            player.wasRight = false
            player.passed = false
        }
    }
    trashTalk(){ // process color commentary at the end of a round
        for (let player of this.players){
            let remark = player.makeComment()
            if (remark.length > 2){
                console.log(`${player.name} says "${remark}"`)
            }
            
        }
    }
    whoWon(){
        let winners = []
        let highScore = 0
        for (let i = 1; i < this.players.length;i++){
            if (this.players[i].score > this.players[i-1].score){
                highScore = this.players[i].score
            }else {
                highScore = this.players[i-1].score
            }
        }
        for (let i = 1; i < this.players.length;i++){
            if (this.players[i].score == highScore){
                winners.push(this.players[i].name)
            }
        }
        return winners
    }
    checkAnswer(player, options, correctAnswer, chances){
        for (let i=0; i<=chances;i++){
            if (player.guess(options) == correctAnswer){
                //console.log(`Guess ${i} right`)
                return true
            }            
        }
        return false
    }
    processGuesses(options, correctAnswer, score){
        for (let player of this.players){
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
                for (let player of this.players){
                    console.log(`${player.name}: ${player.score}`)
                }
                this.trashTalk()
                console.log(`Next round (${this.currentRound}/${this.rounds}) begins...`)
                this.currentQuestion = this.questions[this.currentRound - 1]
                console.log(`The question is:  ${this.currentQuestion.questionText}`)
                console.log("Choices:")
                for (let i = 0;i < this.currentQuestion.answers.length;i++){
                    console.log(`${qChoices[i]}: ${this.currentQuestion.answers[i].answerText}`)
                }
                this.resetPlayers()
                
            }else {
                console.log("Game over, Final Scores:")
                for (let player of this.players){
                    console.log(`${player.name}: ${player.score}`)
                }
                if (this.whoWon().length >= 2){
                    console.log(`Game was tied ${this.whoWon().length} ways!`)
                    console.log("The winners are: ")
                }else {
                    console.log("The winner is: ")
                }
                for (let name of this.whoWon()){
                    console.log(`${name}`)
                }
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
            console.log(`Question: ${this.currentQuestion.questionText}`)
            console.log("Choices:")
            for (let answer of this.currentQuestion.answers){
                console.log(`${answer.letter}: ${answer.answerText}`)
            }
        }
    }
    start(){ // populates and kicks off the first round, and tells the Game to watch the timer
        this.watchTimer = true
        this.pointValue = 250
        console.log(`new game starting...${this.watchTimer}`)
        this.currentRound += 1
        console.log(`Round (${this.currentRound}/${this.rounds}) begins...`)
        this.currentQuestion = this.questions[0]
        console.log(`The question is:  ${this.currentQuestion.questionText}`)
        console.log("Choices:")
        for (let i = 0;i < this.currentQuestion.answers.length;i++){
            console.log(`${qChoices[i]}: ${this.currentQuestion.answers[i].answerText}`)
        }
    }
    stop(){
        this.watchTimer = false
    }
    end(){
        clearInterval(this.timer)
        return true
    }
}

myGame = new Game(3, 15, 4)
myGame.start()