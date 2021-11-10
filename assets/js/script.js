// Static global variables
var maxTime = 75; // seconds
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

// Dynamic global variables  (assigned in codeQuiz())
var timeLeft;
var updateTime; // seconds
var Done;
var questionsAsked;
var initials;
var finalScore;

//***************
//* QUIZ TIMERS * 
//***************

var quizTimer = function () {
  console.log("quizTimer timeLeft: " + timeLeft);
  var quizTimeInterval = setInterval(function () {

    if (timeLeft > 0 && !Done) {
      timeLeft--;
    } else {
      Done = true;
      clearInterval(quizTimeInterval);
      console.log("quizTimer is OFF");
    }

  }, 1000);
};

var updateTimer = function () {
  console.log("updateTimer timeLeft: " + timeLeft);
  var updateTimeInterval = setInterval(function () {

    if (timeLeft > 0 && !Done) {
      document.querySelector("#time-left").textContent = "Time:" + timeLeft;
    } else {
      document.querySelector("#time-left").textContent = "Time:--";
      Done = true;
      clearInterval(updateTimeInterval);
      console.log("updateTimer is OFF");
    }

  }, updateTime * 1000);
};

//******************
//* QUIZ FUNCTIONS * 
//******************

/** Cleaning crew (wherever needed) */
var removeAllChildNodes = function (parent) {
  if (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}

/** Check answer and set status (correct or wrong)...then ask the next question */
var checkAnswer = function (event) {
  var targetEl = event.target;
  var lastAnswerStatus = targetEl.getAttribute("data-answer-status");

  // Penalize wrong answers
  if (lastAnswerStatus.toLowerCase() === "wrong") {
    timeLeft = timeLeft - 10;
  }

  answerQuestions(lastAnswerStatus);
};

/** Get the question and the answer choices */
var answerQuestions = function (lastAnswerStatus = null) {
  // Setup page
  removeAllChildNodes(document.querySelector(".card-footer"));
  removeAllChildNodes(document.querySelector(".card-body"));
  console.log(lastAnswerStatus);
  if (lastAnswerStatus) {
    var cardFooter = document.querySelector(".card-footer");
    cardFooter.innerHTML = "<div id='last-answer-status'><I>" + lastAnswerStatus + "!</I></div>";
  }
  var answerListEl = document.createElement("ol");
  answerListEl.className = "answer-list";
  var cardBodyEl = document.querySelector(".card-body");

  // Ask the next question
  if (questionsAsked < numOfQuizQuestions) {
    removeAllChildNodes(document.querySelector(".answer-list"))
    document.querySelector(".card-header h2").textContent = quizQuestions[questionsAsked].question;
    //var cardBodyH2El = document.createElement("h2");
    //cardBodyH2El.textContent = quizQuestions[questionsAsked].question;
    //cardBodyEl.appendChild(cardBodyH2El);
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
      answerListEl.appendChild(answerEl);
      cardBodyEl.appendChild(answerListEl);
      buttonEl.addEventListener("click", checkAnswer);
    }

    questionsAsked++;
  } else { // When there are no more questions to ask...
    endQuiz();
  }
  console.log(JSON.stringify(quizQuestions[questionsAsked - 1]))
};

var showHighScores = function (clearArg) {
  Done = true; // turn off timers
  if (clearArg === "clear") {
    localStorage.clear();
    codeQuiz();
  }

  removeAllChildNodes(document.querySelector(".quiz"));
  removeAllChildNodes(document.querySelector(".card-header"));
  removeAllChildNodes(document.querySelector(".card-body"));
  removeAllChildNodes(document.querySelector(".card-footer"));

  // Welcome title 
  var quizEl = document.querySelector(".quiz");
  var h1El = document.createElement("h1");
  h1El.textContent = "High Scores";
  quizEl.appendChild(h1El);

  // Welcome card
  var cardBodyEl = document.querySelector(".card-body");
  //var cardHeaderEl = document.querySelector(".card-header");
  //cardHeaderEl.style.maxWidth = "30%";
  //cardHeaderEl.style.marginLeft = "500px";
  var highScoreListEl = document.createElement("ol");
  highScoreListEl.style.backgroundColor = "#E8E8E8";
  var scores = JSON.parse(localStorage.getItem("scores"))
  if (scores) {
    for (var i = 0; i < scores.length; i++) {
      var highScoreEl = document.createElement("li");
      highScoreEl.textContent = JSON.stringify(scores[i].key + "-" + scores[i].val);
      highScoreListEl.appendChild(highScoreEl);

    }
  } else {
    var highScoreEl = document.createElement("li");
    highScoreEl.textContent = "No scores recored";
    highScoreListEl.appendChild(highScoreEl);
  }
  //cardHeaderEl.appendChild(highScoreListEl);
  cardBodyEl.appendChild(highScoreListEl);

  var goBackEl = document.createElement("button");
  goBackEl.id = "go-back";
  goBackEl.className = "btn";
  goBackEl.textContent = "Go Back";
  var cardFooterEl = document.querySelector(".card-footer");
  cardFooterEl.appendChild(goBackEl);
  var clearEl = document.createElement("button");
  clearEl.id = "clear";
  clearEl.className = "btn";
  clearEl.textContent = "Clear high scores";
  var cardFooterEl = document.querySelector(".card-footer");
  cardFooterEl.appendChild(clearEl);

  clearEl.addEventListener("click", function () { showHighScores("clear") });
  goBackEl.addEventListener("click", codeQuiz);
  /*
  var cardHeaderEl = document.querySelector(".card-header");
  cardHeaderEl.style.maxWidth = "30%";
  cardHeaderEl.style.marginLeft = "500px";
  var highScoreListEl = document.createElement("ol");
  highScoreListEl.style.backgroundColor = "#E8E8E8";
  var scores = JSON.parse(localStorage.getItem("scores"))
  if (scores) {
    for (var i = 0; i < scores.length; i++) {
      var highScoreEl = document.createElement("li");
      highScoreEl.textContent = JSON.stringify(scores[i].key + "-" + scores[i].val);
      highScoreListEl.appendChild(highScoreEl);

    }
  } else {
    var highScoreEl = document.createElement("li");
    highScoreEl.textContent = "No scores recored";
    highScoreListEl.appendChild(highScoreEl);
  }
  cardHeaderEl.appendChild(highScoreListEl);

  var goBackEl = document.createElement("button");
  goBackEl.id = "go-back";
  goBackEl.className = "btn";
  goBackEl.textContent = "Go Back";
  var cardFooterEl = document.querySelector(".card-footer");
  cardFooterEl.appendChild(goBackEl);
  var clearEl = document.createElement("button");
  clearEl.id = "clear";
  clearEl.className = "btn";
  clearEl.textContent = "Clear high scores";
  var cardFooterEl = document.querySelector(".card-footer");
  cardFooterEl.appendChild(clearEl);

  clearEl.addEventListener("click", function () { showHighScores("clear") });
  goBackEl.addEventListener("click", codeQuiz);
  */
};

/** Store the SCORE! */
var storeScore = function () {
  Done = true;
  initials = document.getElementById("initials-input").value;
  if (!initials) {
    alert("You must enter your initials!");
    endQuiz();
  }
  var initialsWithScore = initials + "-" + finalScore;
  var scores = localStorage.getItem("scores");
  var scoresObj;
  if (scores) {
    // Add more scores
    scoresObj = JSON.parse(scores);
    var found = false;
    // Look for player initials...
    for (var i = 0; i < scoresObj.length; i++) {
      if (scoresObj[i].key === initials) {
        found = true;
        // Found um! Update best score
        if (scoresObj[i].val < finalScore) {
          scoresObj[i].val = finalScore;
        }
      }
    }
    // Add newcomers
    if (!found) {
      scoresObj.push({ key: initials, val: finalScore });
    }
  } else { // or add the first player
    scoresObj = [{ key: initials, val: finalScore }];
  }

  // Sort by highest score descending
  scoresObj = scoresObj.sort(function (a, b) {
    return b.val - a.val;
  });

  // Store high scores
  localStorage.setItem("scores", JSON.stringify(scoresObj));

  //removeAllChildNodes(document.querySelector(".answer-list"));
  //document.querySelector(".quiz h1").textContent = "";
  //document.querySelector(".card-header h2").textContent = "";
  //console.log("TRYA GIN");
  codeQuiz();
}

var endQuiz = function () {
  Done = true; // just to make sure
  removeAllChildNodes(document.querySelector(".answer-list"))
  //document.querySelector(".answer-list").remove();
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
  //document.querySelector("start-quiz").remove();
  //document.querySelector(".quiz h1").textContent = "";
  Done = false;
  quizTimer();
  updateTimer();
  answerQuestions();
};

var buildWelcomePage = function () {
  removeAllChildNodes(document.querySelector(".quiz"));
  removeAllChildNodes(document.querySelector(".card-header"));
  removeAllChildNodes(document.querySelector(".card-body"));
  removeAllChildNodes(document.querySelector(".card-footer"));

  // Quiz (top) element
  var quizEl = document.querySelector(".quiz");
  quizEl.innerHTML = "<Header></Header>";
  var quizHeaderEl = document.querySelector(".quiz header");

  // High scores and timer
  var pHighScoresEl = document.createElement("p");
  pHighScoresEl.textContent = "View HighScores";
  pHighScoresEl.id = "high-scores";
  pHighScoresEl.addEventListener("click", showHighScores);
  quizHeaderEl.appendChild(pHighScoresEl);
  var pTimerEl = document.createElement("p");
  pTimerEl.textContent = "Time:--";
  pTimerEl.id = "time-left";
  quizHeaderEl.appendChild(pTimerEl);


  // Welcome title
  var h1El = document.createElement("h1");
  h1El.textContent = "Coding Quiz Challenge";
  quizEl.appendChild(h1El);

  // Welcome card
  var cardHeaderEL = document.querySelector(".card-header");
  cardHeaderEL.innerHTML = "<h2>Answer each question as quick as possible...seconds matter. If your answer is wrong, you will be penalized 10 seconds.<br> <br>Do well my friend!</h2>";

  // START QUIZ button
  var buttonEl = document.createElement("button");
  buttonEl.id = "start-quiz";
  buttonEl.className = "btn";
  buttonEl.textContent = "START QUIZ";
  var cardFooterEl = document.querySelector(".card-footer");
  cardFooterEl.appendChild(buttonEl);
};

var codeQuiz = function () {
  // Dynamic global variables assigned
  timeLeft = maxTime;
  updateTime = 1; // seconds
  questionsAsked = 0;
  initials = "";
  finalScore = 0;

  buildWelcomePage();
  var startBtnEl = document.getElementById("start-quiz");
  startBtnEl.addEventListener("click", startQuiz);
};

//*****************
//* TAKE THE QUIZ *
//*****************

codeQuiz();
