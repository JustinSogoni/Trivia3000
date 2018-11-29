let currentQuestions = []
let currentQuestion = false
let currentQuestionNumber = 0
let highScore = 0
let score = 0
let firstErrorMessage = true; //used so the Error message below the Submit Answer! Button does not stack

//Selectors 
const startGameButton = $("#startGame"); 
const startGameWrapper = $("#start-game-wrapper");
const activeGameWrapper = $("#active-game-wrapper");
const currentScoreDiv = $("#current-score");
const highScoreDiv = $("#high-score");

//High Score persistances
if(!localStorage.getItem("storageHighScore")){
    localStorage.setItem("storageHighScore", "0"); // sets the undefined storage value to 0
}
else{
    highScore = localStorage.getItem("storageHighScore");
    updateScores(); // displays the correct answer once the page loads, otherwise we would have to wait until the game is played
}


// Add event listeners here!

startGameButton.click(function(){
    startGame();
});

$("#active-game-wrapper").on("click", ".submit-answer", function(){ // jQuery Event Delegation, since ".submit-answer" only exists when the renderQuestion functions is invoked
    scoreQuestion();
});


// Functions
function startGame () {
    $.getJSON('https://opentdb.com/api.php?amount=6&type=multiple', function(data){ 
        currentQuestions = [];  // resets the currentQuestion Array so the trivia questions do not accumulate 
        //extracts each returned trivia questions object from the returned data
        data.results.forEach(function(triviaQuestion){
            currentQuestions.push(triviaQuestion);
            score = 0; //accounts for when we reset the game 
            currentQuestionNumber = 0; 
            startGameWrapper.hide(); // It gets displayed in its original position using jQuery
            updateScores(); // when we play again, it resets the score back visually 
            nextQuestion();
           
        });
    });
}

function nextQuestion () {

	if (!currentQuestions[currentQuestionNumber]){
        finishGame();
    } 
    else {
    /*
    Since we incremented the question in nextQuestion (), we use currentQuestionNumber -1 to check the correct index. Alternatively, 
    we could have left it as currentQuestionNumber if we incremented the question in scoreQuestion() and modified the renderQuestion () function
    to display ${currentQuestionNumber + 1};
    */
	    currentQuestionNumber++;
	    currentQuestion = currentQuestions[currentQuestionNumber-1].question;
	    let answerOptions = [];                                             
	    currentQuestions[currentQuestionNumber-1].incorrect_answers.forEach(function(incorrectAnswers){
	        answerOptions.push(incorrectAnswers);
	    });
	    answerOptions.push(currentQuestions[currentQuestionNumber-1].correct_answer);
	    //console.log(currentQuestions[currentQuestionNumber-1].correct_answer) //console.logs the correct answer for easy checking
	    shuffleArray(answerOptions);
	    renderQuestion(currentQuestion, answerOptions)
	}
}

function scoreQuestion () {
	let checkedRadioButtonValue = $("input[type='radio']:checked").val(); // when a radio button is selected, it obtains the checked property
    let correctAnswer = currentQuestions[currentQuestionNumber-1].correct_answer;
    if (!checkedRadioButtonValue){
    	if (firstErrorMessage){
    		$("<div class='error'>Error: Select a Response</div>").insertAfter(".submit-answer");
    		firstErrorMessage = false;
    	}
    }
    else {
    	if(checkedRadioButtonValue === correctAnswer){
        score ++;
    	}
        if (score > highScore){
            highScore = score;
            localStorage.setItem("storageHighScore", highScore.toString());
        	}
        firstErrorMessage = true; //resets the error message for the next question
        updateScores();
        nextQuestion();
    }
    
}

function updateScores () {
    currentScoreDiv.text(`${score} / 6`);
    highScoreDiv.text(`${highScore}`);
}

function finishGame () {
    activeGameWrapper.hide();
    startGameWrapper.show();
    startGameButton.text("Play Again");
}

//Courtesy of https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Do not modify!
function renderQuestion (questionTitle, answerOptions) {
    $('#active-game-wrapper').show().empty()
    $(`<div class="question">
        <div class="question-number">Question #${currentQuestionNumber}</div>
        <div class="question-title">${questionTitle}</div>
        <div class="question-options">
            <div class="question-option">
                <label>
                    <input type="radio" name="answerChoice" value="${answerOptions[0]}">
                    ${answerOptions[0]}
                </label>
            </div>
            <div class="question-option">
                <label>
                    <input type="radio" name="answerChoice" value="${answerOptions[1]}">
                    ${answerOptions[1]}
                </label>
            </div>
            <div class="question-option">
                <label>
                    <input type="radio" name="answerChoice" value="${answerOptions[2]}">
                    ${answerOptions[2]}
                </label>
            </div>
            <div class="question-option">
                <label>
                    <input type="radio" name="answerChoice" value="${answerOptions[3]}">
                    ${answerOptions[3]}
                </label>
            </div>
        </div>
        <button class="submit-answer btn btn-primary btn-lg">Submit Answer!</button>
      </div>`)
    .appendTo($('#active-game-wrapper'))
}