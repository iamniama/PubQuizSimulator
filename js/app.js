
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
    prune(){ // removes a random wrong answer from Question.answers and replaces it in UX with the alternate/joke text.  called at 50% and 75% round elapsed
        for (let i=0;i<this.answers.length;i++) {
            //console.log(`|${this.right}|${this.answers[i].letter}|`)
            let randCounter = Math.floor(Math.random() * this.answers.length)
            if (this.answers[randCounter].letter != this.right){
                console.log(`BINGLE|${this.right}|${this.answers[randCounter].letter}|`)
                document.querySelector(`#${this.answers[randCounter].letter}`).textContent = `${this.answers[randCounter].letter} : ${this.answers[randCounter].jokeText}`
                this.answers.splice(randCounter, 1)
                return(1)
            }
        }
    }
    getChoices(){  //gets the possible answer letters.  necessary since i am removing possible right answers at intervals.  this allows NPCTeams to avoid choosing eliminated answers
        let arrReturn = []
        for (let answer of this.answers){
            arrReturn.push(answer.letter)
        }
        return arrReturn
    }
}




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


// miscellaneous game data, questions, players, etc
const fallBackStrings = ["The other side was actually funnier", "Error: Joke found but not funny", "Insert witty remark here"]
const fallbackString = "Error: Joke found but not funny"
const icons = ["🍻", "🥤", "🥂", "✨", "🔥"]
const remarks = ["i am the greatest!!", "Your joke here", "lorem ipsem dolor", "eat my shorts!", "Muse fate how?  Bask me now!", "Sometimes, I think I'm nothing but a member function in a game class..."]
const karenRemarks = ["IIIIYYYYEeeeaahhhhh I'm gonna need the manager here, like niao", "You're not my supervisor!!!", "Oh em gee barternder is hawt!", "Drink! EMPTY! uuughhh!", "bbbrrruuwuuuwuuuugggghhhhh", "YYYAAAAAAAYYYYYY!!!", "America's ()() BABY!"]
const dieuxRemarks = ["Bow before us", "You are but mortals...", "Fall..."]
const buzMarks = ["Boom, right in the nick of time", "Zing!", "Whoooosh", "*BOW*", "Mic Check, Mic DROP!"]


const questionAlpha = new Question("Which British actor has played James Bond the least number of times?", "Rowan Atkinson", "George Lazenby", "Sean Connery", "Daniel Craig", "a", "", "Zero is less than one", "Not thish one", "Quantum of Nope")
const questionBeta = new Question("Who played 'The Master' alongside Michelle Gomez's Missy in Doctor Who?", "Peter Capaldi", "Jon Hamm", "Jon Simm", "Mark Hamill", "c", "*GASP!!!*", "Different kind of Mad Man", " ", "Use the TARDIS, Luke!")
const questionDelta = new Question("Robert Downey, Jr released a full length studio album in 2004.  What was its title?", "Black Coffee Blues", "The Futurist", "Little Joe Sure Can Sing", "Rehab", "b", "Not even close", "", "Getting warm", "Maybe the same one, years apart?")
const questionGamma = new Question("What was the name of Iron Maiden frontman Bruce Dickinson's first solo album?", "The Wicker Man", "Brave New World", "Tattooed Millionaire", "Sorry, Eddie", "c", "Iron Maidens like Wicker Men", "There is more to Maiden than the singer", " ", "Actually, the other side was funnier")
const questionEpsilon = new Question("What are the two main ingredients of a Dark and Stormy (cocktail)?", "rum and coke", "bacardi 151 and bailey's irish cream", "dark rum and ginger beer", "tequila and kahlua", "c", "not even with a lime", "more like a cement mixer", " ", fallbackString)
const questionZeta = new Question("In what modern day country was Nikola Tesla born?", "Romania", "Argentina", "Belgium", "Croatia", "d", "no electric dracula", fallbackString, "mmm...electric chocolate", " ")
const questionEta = new Question("What did the Romans call the modern day country of Scotland?", "Gaul", "Scotlandia", "Caledonia", "Brittania", "c", "The unmitigated...", fallBackStrings[0], "", "Close, but no haggis")
const questionTheta = new Question("What is the smallest country on the Earth?", "Vatican City", "Luxembourg", "Russia", "Italy", "a", "", "Smaller, and even more Lux", "Only on opposite day", "It fits within")
const questionIota = new Question("In bowling, what is the term for three strikes in a row?", "Beginner's Luck", "Hat Trick", "Triple", "Turkey", "d", "Also yes, but...", "Not cold, just regular", "Give thanks", "")
const questionKappa = new Question("What grain is sake made from?", "Rice", "Wheat", "Corn", "Barley", "a", "", "Gluten Free!", "Just...ew", "Nope")

const questionLamda = new Question("What is the only vitamin not found in eggs?", "Vitamin A", "Vitamin C", "Vitamin E", "Vitamin Q", "b", "Too obvious...", "", "So close...", "Get real!")
const questionMu = new Question("What Beatles song was banned from the BBC because of its lyrics?", "I am the Walrus", "The Girl Can't Help It", "Love Me Do", "Come Together", "a", "", "But the BBC didn't mind...", "They Love Me Did", "Maybe at the zoo?")
const questionNu = new Question("What was singer David Bowie's last name at birth?", "Bowie", "Smith", "Jones", "Lancaster", "c", "A little obvious...", "Alias Smith and...", "", "You'd almost think...")
const questionXi = new Question("In Buffy: the Vampire Slayer, what was Angel's real first name?", "John", "Max", "Sean", "Liam", "d", fallBackStrings[Math.floor(Math.random() * fallBackStrings.length)], "Too German...", "Right country...", "")
const questionOmicron = new Question
const questionPi = new Question
const questionRho = new Question
const questionSigma = new Question
const questionTau = new Question
const questionUpsilon = new Question

const standardTeams = [new NPCTeam("Algorithm Section", 3, 1, 14, 50, remarks), new NPCTeam("Generica", 3, 1, 14, 50, remarks)]
const loserTeams = [new NPCTeam("Drunky Brewster", 2, 5, 2, 10, karenRemarks)]
const heroTeams = [new NPCTeam("Buzzer Beaters", 4, 10, 3, 95, buzMarks), new NPCTeam("Die Ubernerden", 1, 3, 13, 80, dieuxRemarks)]
const theQuestions = [questionXi, questionAlpha, questionBeta, questionDelta, questionEpsilon, questionGamma, questionZeta, questionEta, questionTheta, questionIota, questionKappa, questionLamda, questionMu, questionNu]


/* 
The Game object does the majority of the heavy lifting for PQS.
It manages the timer, tracks rounds, and contains all the other objects that the game uses,
such as the Teams and the Questions.

*/

class Game {
    constructor (intRounds, intRoundDuration, intPlayers){
        this.internalCounter = 0;
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
        this.timeThreshold1 = Math.floor(intRoundDuration * .5);
        this.timeThreshold2 = Math.floor(intRoundDuration * .25);
        this.userOK = true;
        this.chatSound = new Audio("./rsrc/ding.mp3")
    }
    getQuestions(rnds){  //build the initial question pool 
       const qList = []
       for (let i = 0;i < rnds;i++){
           let qIndex = Math.floor(Math.random() * theQuestions.length)
           qList.push(theQuestions[qIndex])
           theQuestions.splice(qIndex, 1)
           console.log(`There are ${theQuestions.length} questions left in the pool`)
       }
       return(qList)
    }
    setCookie(strValue, expHours, keyName){  //not used, I got lazy and did this outside the object
        let dt = new Date()
        d.setTime(d.getTime() + (expHours * 60 * 60 * 1000))
        document.cookie = `${keyName} = ${strValue}; expires=${dt.toUTCString};path=/`
    }
    addPlayers(){ //populate the list of players
        const player = new Team("Name", 1)
        return ([player, 
                heroTeams[Math.floor(Math.random() * heroTeams.length)], 
                loserTeams[Math.floor(Math.random() * loserTeams.length)], 
                standardTeams[Math.floor(Math.random() * standardTeams.length)]])
    }
    processGuesses(options, correctAnswer, score){ //runs every second, processes NPC turns and guesses
        for (let i = 1;i< this.players.length;i++) {
        //for (let player of this.players){
            if (this.currentRoundTimer < this.players[i].Earliest && !this.players[i].answered){
                if (Math.floor(Math.random() * 100) < this.players[i].AnswerChance){
                    this.players[i].answered = true
                    if (this.checkAnswer(this.players[i], options,correctAnswer, this.players[i].chances)){
                        this.players[i].wasRight = true
                        document.querySelector(`div[player="${i}"]`).style.backgroundColor = "green"
                        //console.log(`${player.name} ${player.icon} was right!`)
                        this.players[i].score += score
                        document.querySelector(`h4[player="${i}"]`).textContent = this.players[i].score
                    }else {
                        this.players[i].wasRight = false
                        //console.log(`${player.name} ${player.icon} was wrong!`)
                        document.querySelector(`div[player="${i}"]`).style.backgroundColor = "red"
                        this.players[i].score -= 50
                        document.querySelector(`h4[player="${i}"]`).textContent = this.players[i].score
                    }
                    
                    
                }
            }
        }
    }
    penalizeSkips(){ //take away points if teams don't answer
        for (let i = 0;i < this.players.length; i++){
            if (this.players[i].answered == false){
                this.players[i].score -= 100
                document.querySelector(`h4[player="${i}"]`).textContent = this.players[i].score
            }
        }
    }
    resetPlayers(){  //reset state values  for all Teams
        this.userOK = true
        for (let i = 0; i < this.players.length;i++){
            this.players[i].answered = false
            this.players[i].wasRight = false
            this.players[i].passed = false
            this.clearPlayerPanels()
        }
    }
    clearPlayerPanels(){  //clear red/green after round
        for (let i=0;i<this.players.length;i++){
            document.querySelector(`div[player="${i}"]`).style.backgroundColor = "white"
        }
    }
    setupPlayers(){ //populate initial values for players on the board
        for (let i = 0; i< this.players.length;i++){
            document.querySelector(`h3[player="${i}"]`).textContent = this.players[i].name
        }
    }
    trashTalk(){ // process color commentary at the end of a round
        for (let i=1;i<this.players.length;i++){
            let remark = this.players[i].makeComment()
            if (remark.length > 2){
                console.log(`${this.players[i].name} says "${remark}"`)
                document.querySelector("#chatboxx").innerHTML += `${this.players[i].name}:  ${remark} <br /><br />`
                this.chatSound.play()
                document.querySelector("#chatboxx").scrollTop = document.querySelector("#chatboxx").textContent.length
            }

            
        }
    }
    whoWon(){  //pretty self explanatory, who won the game?
        let winners = []
        let highScore = this.players[0].score
        for (let i = 1; i < this.players.length;i++){
            if (this.players[i].score > highScore){
                console.log(`i: ${this.players[i].name}: ${this.players[i].score}`)
                console.log(`i-1: ${this.players[i-1].name}: ${this.players[i-1].score}`)
                highScore = this.players[i].score
                console.log(`current high score: ${highScore}`)
            } /*else {
                highScore = this.players[i-1].score
            }*/
        }
        console.log(`high score is ${highScore}`)
        for (let i = 0; i < this.players.length;i++){
            if (this.players[i].score == highScore){
                winners.push(this.players[i].name)
            }
        }
        return winners
    }
    checkAnswer(player, options, correctAnswer, chances){  //check the NPCTeam guess, handles the number of chances for the advantage system
        for (let i=0; i<=chances;i++){
            if (player.guess(options) == correctAnswer){
                //console.log(`Guess ${i} right`)
                return true
            }            
        }
        return false
    }
    setupPlayers(){
        for (let i = 0; i< this.players.length;i++){
            document.querySelector(`h3[player="${i}"]`).textContent = this.players[i].name
        }
    }
    startRound(){  //start a new round in the game
        //document.querySelector('#start-game').classList.toggle("btn-disabled")
        this.currentRound += 1
        this.watchTimer = true
        this.resetPlayers()
        this.pointValue = 250
        this.currentQuestion = this.questions[this.currentRound - 1]
        this.currentRoundTimer = this.roundDuration
        document.querySelector("#question-disp").textContent = `${this.currentRound}: ${this.currentQuestion.questionText}`
        for (let i = 0;i < this.currentQuestion.answers.length;i++){
            console.log(`${qChoices[i]}: ${this.currentQuestion.answers[i].answerText}`)
            //document.querySelector(`#${this.currentQuestion.answers[i].letter}`).textContent = `${this.answers[i].letter} : ${this.currentQuestion.answers[i].answerText}`
            document.querySelector(`#${this.currentQuestion.answers[i].letter}`).textContent = `${this.currentQuestion.answers[i].letter}: ${this.currentQuestion.answers[i].answerText}`
        }
    }
    startGame(evt){  //start the game
        this.watchTimer = true
        //this.setupPlayers()
        this.startRound()
        document.querySelector("#start-game").classList.toggle("btn-disabled")
        for (let ele of document.querySelectorAll(".question-panel")){
            ele.style.opacity = "1"
        }
        document.querySelector("#timer").style.opacity = "1"
        
    }
    pause(){  //stop watching the timer until we resume the game by setting watchTimer to true
        this.watchTimer = false
        this.enableNextRound()
    }
    endRound(){  //process end of round actions
        this.penalizeSkips()
        //this.currentRound += 1
        this.trashTalk()
        this.pause()
        if (this.currentRound >= this.rounds) {
            this.endGame()
        }
    }
    endGame(){  //end the game and calculate total score
        console.log("Game over, Final Scores:")
                let resultHTML = "Game Over! <br /><br />"
                for (let player of this.players){
                    console.log(`${player.name}: ${player.score}`)
                }
                if (this.whoWon().length >= 2){
                    console.log(`Game was tied ${this.whoWon().length} ways!`)
                    resultHTML += `Game was tied ${this.whoWon().length} ways! <br />`
                    console.log("The winners are: ")
                    resultHTML += "The winners are: <br />"
                }else {
                    console.log("The winner is: ")
                    resultHTML += "The winner is: <br />"
                }
                for (let name of this.whoWon()){
                    console.log(`${name}`)
                    resultHTML += `${name} <br />`
                }
                document.querySelector("#question-disp").innerHTML = resultHTML
                this.watchTimer = false
                this.enableNextRound()
                this.end()
                for (let ele of document.querySelectorAll(".question-panel")){
                    ele.style.opacity = "0"
                }
                document.querySelector("#question-disp").style.opacity = "1"
                document.querySelector("#timer").style.opacity = "0"
    }
    enableNextRound(){ //allow the user to click the next round button
        document.querySelector('#next-round').classList.toggle("btn-disabled")
    }
    tick() {  //each second of the interval
        this.internalCounter += 1
        if (this.currentRoundTimer == 0 && this.watchTimer){
            this.endRound()
            if (this.currentRound <= this.rounds && this.watchTimer){
                this.enableNextRound()
            }
        }
        if (this.currentRoundTimer > 0 && this.watchTimer){
            this.currentRoundTimer -= 1
            document.querySelector("#timer").textContent = `${this.currentRoundTimer} / ${this.pointValue}`
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
    end(){ //stop the timer
        clearInterval(this.timer)
        return true
    }
}
const myGame = new Game(10, 15, 4)  
if (document.cookie.split(';').some((item) => item.trim().startsWith('team='))) {
    myGame.players[0].name = document.cookie.split('; ').find(row => row.startsWith('team')).split('=')[1];
} else {
    playerName = prompt("What is your Team Name?", "Hairy Potters")
    myGame.players[0].name = playerName
    document.cookie = `team=${playerName}`
}

myGame.setupPlayers()
const myStartGame = myGame.startGame.bind(myGame)
const myNextRound = myGame.startRound.bind(myGame)
//myGame.startGame()
//myGame.startGame.bind(this)
//myGame.startRound.bind(this)

document.querySelector("#start-game").addEventListener("click", () => {
    myStartGame();})

document.querySelector("#next-round").addEventListener("click", () => {
    myGame.enableNextRound()    
    myNextRound();})

//ev => this.OnEvent(ev)

/*
document.querySelector("#start-game").addEventListener("click", (evt) => {
    myGame.startGame()
})
document.querySelector("#next-round").addEventListener("click", (evt) => {
    myGame.startRound()
})
*/
const playerGuess = (letter) => {
  if (myGame.players[0].answered == false) {
    myGame.players[0].answered = true
    if (letter == myGame.currentQuestion.right) {
      myGame.players[0].score += myGame.pointValue
      myGame.players[0].wasRight = true
      //document.querySelector(`div[player="0"]`).textContent = myGame.players[0].score
      document.querySelector(`div[player="0"]`).style.backgroundColor = 'green'
    } else if ((letter = 'x')) {
      myGame.players[0].passed = true
    } else {
      document.querySelector(`div[player="0"]`).style.backgroundColor = 'red'
      myGame.players[0].score -= 50
    }
  }
  document.querySelector(`h4[player="0"]`).textContent = myGame.players[0].score
}

document.querySelector("#answers").addEventListener("click", (evt=> {
    playerGuess(evt.target.id)
}))

for (div of document.querySelectorAll("#answer")){
    div.addEventListener("click", (evt) =>{
        console.log(`user clicked ${evt.target.id}`)
        playerGuess(evt.target.id)
    })
}


document.querySelector("#instructions").addEventListener("click", (evt)=> {
    document.querySelector("#instructions").style.display = "none"
})
