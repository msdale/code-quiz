var maxTime = 75; // seconds
var timeLeft = maxTime;
var updateTime = 1; // seconds
var Done = false;
var quizQuestions = [
  {
    "question":
      "My name is __________",
    "answers":
      [
        "Mark",
        "Cynsinatus",
        "Micheal",
        "Bezoinkal"
      ],
    "correct-answer-index":
      0
  },
  {
    "question":
      "My dog's name is __________",
    "answers":
      [
        "Gumba",
        "Zimbu",
        "Shadow",
        "Siggy",
        "Jojo"
      ],
    "correct-answer-index":
      2
  }
];
var numOfQuizQuestions = quizQuestions.length;
var questionsAsked = 0;
var initials = "";
var finalScore = 0;

//***************
//* QUIZ TIMERS * 
//***************

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

    if (timeLeft > 0 && !Done) {
      document.querySelector("#time-left").textContent = "Time:" + timeLeft;
      console.log("Timers Running");
    } else {
      document.querySelector("#time-left").textContent = "Time:--";
      clearInterval(updateTimeInterval);
      if (!Done) {
        endQuiz();
      }
    }

  }, updateTime * 1000);

};

//******************
//* QUIZ FUNCTIONS * 
//******************

var checkAnswer = function (event) {

  var targetEl = event.target;
  var lastAnswerStatus = targetEl.getAttribute("data-answer-status");
  document.querySelector("#last-answer-status I").textContent = lastAnswerStatus + "!";

  answerQuestions();

};

var answerQuestions = function () {
  if (questionsAsked < numOfQuizQuestions) {
    removeAllChildNodes(document.querySelector(".card-body .answer-list"))
    document.querySelector(".card-header h2").textContent = quizQuestions[questionsAsked].question;
    var answerList = document.querySelector(".card-body .answer-list")
    for (var i = 0; i < quizQuestions[questionsAsked].answers.length; i++) {
      var answerEl = document.createElement("li");
      var buttonEl = document.createElement("button");
      buttonEl.className = "btn";
      buttonEl.textContent = (i + 1) + ". " + quizQuestions[questionsAsked].answers[i];
      if (quizQuestions[questionsAsked]["correct-answer-index"] === i) {
        buttonEl.setAttribute("data-answer-status", "Correct");
      } else {
        buttonEl.setAttribute("data-answer-status", "Wrong");
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
  console.log(JSON.stringify(quizQuestions))
};

var removeAllChildNodes = function (parent) {
  if (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}

var storeScore = function () {
  initials = document.getElementById("initials-input").value;
  if (!initials) {
    alert("You must enter your initials!");
    endQuiz();
  }
  var initialsWithScore = initials + "-" + finalScore;
  var scores = localStorage.getItem("scores");
  var scoresObj;
  if (scores) {
    // add more scores
    scoresObj = JSON.parse(scores);
    var found = false;
    for (var i = 0; i < scoresObj.length; i++) {
      if (scoresObj[i].key === initials) {
        found = true;
        if (scoresObj[i].val < finalScore) {
          scoresObj[i].val = finalScore;
        }
      }
    }
    if (!found) {
      scoresObj.push({ key: initials, val: finalScore });
    }
  } else {
    scoresObj = [{ key: initials, val: finalScore }];
  }

  scoresObj = scoresObj.sort(function (a, b) {
    return b.val - a.val;
  });
  localStorage.setItem("scores", JSON.stringify(scoresObj));
}

var endQuiz = function () {
  Done = true; // just to make sure
  removeAllChildNodes(document.querySelector(".card-body .answer-list"))
  document.querySelector(".answer-list").remove();
  document.querySelector(".quiz h1").textContent = "All Done";
  var lastAnswerStatusEl = document.getElementById("last-answer-status");
  if (lastAnswerStatusEl) {
    lastAnswerStatusEl.remove();
  }
  var h2El = document.querySelector(".card-header h2");
  h2El.style.minWidth = "200px";
  h2El.textContent = "Your final score: " + timeLeft;
  finalScore = timeLeft;

  var initialsPromptEl = document.createElement("div");
  initialsPromptEl.textContent = "Enter Initials:"
  initialsPromptEl.setAttribute("id", "initials-prompt");

  var inputInitialsEl = document.createElement("input");
  inputInitialsEl.setAttribute("type", "text");
  inputInitialsEl.setAttribute("id", "initials-input");
  inputInitialsEl.setAttribute("placeholder", "initials");

  var buttonEl = document.createElement("button");
  buttonEl.className = "submit-btn";
  buttonEl.textContent = "submit";

  var cardBodyEl = document.querySelector(".card-body");
  cardBodyEl.appendChild(initialsPromptEl);
  cardBodyEl.appendChild(inputInitialsEl);
  cardBodyEl.appendChild(buttonEl);

  buttonEl.addEventListener("click", storeScore);

};

var startQuiz = function () {
  document.querySelector("#start-quiz").remove();
  document.querySelector(".quiz h1").textContent = "";
  quizTimer();
  updateTimer();
  answerQuestions();
};

var codeQuiz = function () {
  var startBtnEl = document.getElementById("start-quiz");
  startBtnEl.addEventListener("click", startQuiz);
};

//*****************
//* TAKE THE QUIZ *
//*****************

codeQuiz();
