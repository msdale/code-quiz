//var timerEl = document.getElementById('countdown');
//var mainEl = document.getElementById('main');
//var readEl = document.getElementById('read');

//var message =
//  'Some say the world will end in 🔥, Some say in ice. From what I’ve tasted of desire, I hold with those who favor fire. But if it had to perish twice, I think I know enough of hate. To say that for destruction ice, Is also great, And would suffice.';
//var words = message.split(' ');
var maxTime = 75; // seconds
var timeLeft = maxTime;
var updateTime = 1; // seconds
var Done = false; //
var quizContent = [
  {
    "question": "My name is __________",
    "answers": [
      "Mark",
      "Cynsinatus",
      "Micheal",
      "Bezoinkal"],
    "correct-answer-index": 0
  },
  { "question": "My dog's name is __________", "answers": ["Gumba", "Zimbu", "Shadow", "Siggy", "Jojo"], "correct-answer-index": 2 }
];
var numOfQuizQuestions = quizContent.length;
var questionsAsked = 0;

/****************
  QUIZ TIMERS...
  Keep First!
*****************/

var quizTimer = function () {
  var quizTimeInterval = setInterval(function () {
    if (timeLeft > 0) {
      timeLeft--;
    } else {
      Done = true;
      clearInterval(quizTimeInterval);
      console.log("quizTimer is OFF");
    }
  }, 1000);
}

var updateTimer = function () {
  var updateTimeInterval = setInterval(function () {
    console.log("Time Left: " + timeLeft);
    console.log("Done: " + Done);
    if (timeLeft > 0 && !Done) {
      document.querySelector("#time-left").textContent = "Time:" + timeLeft;
      console.log("Timers Running");
    } else {
      document.querySelector("#time-left").textContent = "Time:--";
      clearInterval(updateTimeInterval);
      endQuiz();
    }
  }, updateTime * 1000);
};

var checkAnswer = function (event) {
  var targetEl = event.target;
  var lastAnswerStatus = targetEl.getAttribute("data-answer-status");
  console.log(lastAnswerStatus);  
  document.querySelector("#last-answer-status").textContent = "Last Answer was " + lastAnswerStatus.toUpperCase();

  answerQuestions();
};

var answerQuestions = function () {
  if (questionsAsked < numOfQuizQuestions) {
    removeAllChildNodes(document.querySelector(".card-body .answer-list"))
    document.querySelector(".card-header h2").textContent = quizContent[questionsAsked].question;
    var answerList = document.querySelector(".card-body .answer-list")
    for (var i = 0; i < quizContent[questionsAsked].answers.length; i++) {
      var answerEl = document.createElement("li");
      var buttonEl = document.createElement("button");
      buttonEl.className = "btn";
      buttonEl.textContent = (i + 1) + ". " + quizContent[questionsAsked].answers[i];
      if (quizContent[questionsAsked]["correct-answer-index"] === i) {
        buttonEl.setAttribute("data-answer-status", "right");
      } else {
        buttonEl.setAttribute("data-answer-status", "wrong");
      }
      buttonEl.setAttribute("data-index", i);
      answerEl.appendChild(buttonEl);
      answerList.appendChild(answerEl);
      buttonEl.addEventListener("click", checkAnswer);
    }

    questionsAsked++;
  } else {
    endQuiz();
  }
  console.log(answerList);
  console.log(JSON.stringify(quizContent))
};

var removeAllChildNodes = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

var endQuiz = function () {
  Done = true;
  removeAllChildNodes(document.querySelector(".card-body .answer-list"))
  document.querySelector(".quiz h1").textContent = "ALL DONE";
  document.querySelector(".card-header h2").textContent = "";
  console.log("ALL DONE");
};



var startQuiz = function () {

  document.querySelector("#start-quiz").remove();
  document.querySelector(".quiz h1").textContent = "";
  quizTimer();
  updateTimer();
  //if (questionsAsked < numOfQuizQuestions) {
  //removeAllChildNodes(document.querySelector(".card-body .answer-list"))
  answerQuestions();
  //questionsAsked++;
  //} else {
  //  removeAllChildNodes(document.querySelector(".card-body .answer-list"))
  //  document.querySelector(".quiz h1").textContent = "ALL DONE";
  //  document.querySelector(".card-header h2").textContent = "";
  //  console.log("ALL DONE");
  //}
  //endQuiz();
};

var codeQuiz = function () {
  var startBtnEl = document.getElementById("start-quiz");
  startBtnEl.addEventListener("click", startQuiz);
};

/*
function countdown() to be executed every 1000 milliseconds
  var timeInterval = setInterval(function() {
    if (timeLeft > 0) {
      mainEl.textContent = "COUNTDOWN: " + timeLeft;
      timeLeft--;
    } else {
      clearInterval(timeInterval);
      displayMessage();
    }
  }, 1000);
}
 
// Displays the message one word at a time
function displayMessage() {
  var wordCount = 0;
 
  // Uses the `setInterval()` method to call a function to be executed every 1000 milliseconds
  var msgInterval = setInterval(function() {
    // If there are no more words left in the message
    if (words[wordCount] === undefined) {
      // Use `clearInterval()` to stop the timer
      clearInterval(msgInterval);
    } else {
      // Display one word of the message
      mainEl.textContent = "WORD COUNT: " + (wordCount + 1);
      readEl.textContent = words[wordCount];
      wordCount++;
    }
  }, 500);
}
 
countdown();
*/

codeQuiz();
