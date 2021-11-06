//var timerEl = document.getElementById('countdown');
//var mainEl = document.getElementById('main');
//var readEl = document.getElementById('read');

//var message =
//  'Some say the world will end in 🔥, Some say in ice. From what I’ve tasted of desire, I hold with those who favor fire. But if it had to perish twice, I think I know enough of hate. To say that for destruction ice, Is also great, And would suffice.';
//var words = message.split(' ');
var maxTime = 75;

var quizContent = [
  {
    "question": "My name is __________",
    "answers": [
      "Mark",
      "Cynsinatus",
      "Micheal",
      "Bezoinkal"]
  },
  { "question": "My dog's name is __________", "answers": ["Gumba", "Zimbu", "Shadow", "Siggy", "Jojo"] }
];
var numOfQuizQuestions = quizContent.length;
var questionsAsked = 0;

var answerQuestion = function () {
  document.querySelector(".card-header h2").textContent = quizContent[questionsAsked].question;
  var answerList = document.querySelector(".card-body .answer-list")
  for (var i = 0; i < quizContent[questionsAsked].answers.length; i++) {
    var answerEl = document.createElement("li");
    var buttonEl = document.createElement("button");
    buttonEl.className = "btn";
    buttonEl.textContent = (i + 1) + ". " + quizContent[questionsAsked].answers[i];
    answerEl.appendChild(buttonEl);
    answerList.appendChild(answerEl);

  }
  console.log(answerList);
  console.log(JSON.stringify(quizContent))
};

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

var startQuiz = function () {
  document.querySelector("#start-quiz").remove();
  document.querySelector(".quiz h1").textContent = "";
  var questionInterval = setInterval(function () {
    if (questionsAsked < numOfQuizQuestions) {
      removeAllChildNodes(document.querySelector(".card-body .answer-list"))
      answerQuestion();
      questionsAsked++;
    } else {
      clearInterval(questionInterval);
      removeAllChildNodes(document.querySelector(".card-body .answer-list"))
      document.querySelector(".quiz h1").textContent = "ALL DONE";
      document.querySelector(".card-header h2").textContent = "";
      console.log("ALL DONE");
    }
  }, 10000);
};

var codeQuiz = function () {
  var startBtnEl = document.getElementById("start-quiz");
  startBtnEl.addEventListener("click", startQuiz);
};

/*
function countdown() {
  var timeLeft = 3;
 
  // TODO: Use the `setInterval()` method to call a function to be executed every 1000 milliseconds
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
