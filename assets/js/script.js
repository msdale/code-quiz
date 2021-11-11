// Static global variables
var maxTime = 75; // seconds
var quizQuestions = [
  {
    "question":
      "Commonly used data types do not include:",
    "answers":
      [
        "alerts",
        "booleans",
        "strings",
        "numbers"
      ],
    "correct-answer-index":
      0
  },
  {
    "question":
      "The condition in an if/else statement is enclosed in _________",
    "answers":
      [
        "quotes",
        "curly brackets",
        "square brackets",
        "parenthesis"
      ],
    "correct-answer-index":
      3
  },
  {
    "question":
      "Arrays in javaScript can be used to store _________",
    "answers":
      [
        "numbers and strings",
        "other arrays",
        "booleans",
        "all of the above"
      ],
    "correct-answer-index":
      3
  },
  {
    "question":
      "String values must be enclosed within _________ when being assigned to variables",
    "answers":
      [
        "commas",
        "quotes",
        "curly brackets",
        "parenthesis"
      ],
    "correct-answer-index":
      1
  },
  {
    "question":
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    "answers":
      [
        "JavaScript",
        "terminal/bash",
        "for loops",
        "console.log"
      ],
    "correct-answer-index":
      3
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
  console.log("START OF removeAllChildNodes()");
  if (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  console.log("END OF removeAllChildNodes()");
}

/** Check answer and set status (correct or wrong)...then ask the next question */
var checkAnswer = function (event) {
  console.log("START OF checkAnswer()");
  var targetEl = event.target;
  var lastAnswerStatus = targetEl.getAttribute("data-answer-status");

  // Penalize wrong answers
  if (lastAnswerStatus.toLowerCase() === "wrong") {
    timeLeft = timeLeft - 10;
  }

  answerQuestions(lastAnswerStatus);
  console.log("END OF checkAnswer()");
};

/** Get the question and the answer choices */
var answerQuestions = function (lastAnswerStatus = null) {
  console.log("START OF answerQuestions()");

  // Setup page
  removeAllChildNodes(document.querySelector(".card-header"));
  removeAllChildNodes(document.querySelector(".card-footer"));
  removeAllChildNodes(document.querySelector(".card-body"));
  document.querySelector(".quiz h1").textContent = "";
  console.log(lastAnswerStatus);
  var answerListEl = document.createElement("ol");
  answerListEl.className = "answer-list";
  var cardBodyEl = document.querySelector(".card-body");

  // Ask the next question
  if (questionsAsked < numOfQuizQuestions) {
    removeAllChildNodes(document.querySelector(".answer-list"))
    var h2El = document.createElement("h2");
    h2El.textContent = quizQuestions[questionsAsked].question;
    h2El.style.textAlign = "left";
    answerListEl.appendChild(h2El);
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
      buttonEl.addEventListener("click", checkAnswer);
    }
    if (lastAnswerStatus) {
      var lastAnswerStatusEl = document.createElement("li");  
      lastAnswerStatusEl.innerHTML = (lastAnswerStatus + "!").italics();
      lastAnswerStatusEl.id = "last-answer-status";
      answerListEl.appendChild(lastAnswerStatusEl);
    }
    cardBodyEl.appendChild(answerListEl);

    questionsAsked++;
  } else { // When there are no more questions to ask...
    endQuiz();
  }
  console.log("END OF answerQuestions()");
};

/** Show high scores by 'initial - score' listing */
var showHighScores = function (clearArg) {
  console.log("START OF showHighScores()");
  Done = true; // turn off timers
  if (clearArg === "clear") {
    localStorage.clear();
    codeQuiz();
  }

  removeAllChildNodes(document.querySelector(".quiz"));
  removeAllChildNodes(document.querySelector(".card-header"));
  removeAllChildNodes(document.querySelector(".card-body"));
  removeAllChildNodes(document.querySelector(".card-footer"));

  // High Score elements
  var cardBodyEl = document.querySelector(".card-body");
  var highScorePageEl = document.createElement("ol");
  var highScoreTitleEl = document.createElement("h2");
  var highScoreListEl = document.createElement("ol");
  var highScoreDivEl = document.createElement("div");
  var highScoreEl;

  // Title
  highScoreTitleEl.textContent = "High scores";
  highScoreEl = document.createElement("li");
  highScoreEl.appendChild(highScoreTitleEl);
  highScorePageEl.appendChild(highScoreEl);

  // High score list
  highScoreListEl.style.backgroundColor = "#E8E8E8";
  highScoreListEl.style.paddingLeft = "20px";
  var scores = JSON.parse(localStorage.getItem("scores"))
  if (scores) {
    for (var i = 0; i < scores.length; i++) {
      highScoreEl = document.createElement("li");
      highScoreEl.textContent = scores[i].key + "-" + scores[i].val;
      highScoreEl.style.display = "list-item";
      highScoreEl.style.listStyleType = "decimal";
      highScoreEl.style.listStylePosition = "inside";
      highScoreListEl.appendChild(highScoreEl);

    }
  } else {
    var highScoreEl = document.createElement("li");
    highScoreEl.textContent = "No scores...play and record yours!";
    highScoreListEl.appendChild(highScoreEl);
  }
  highScorePageEl.appendChild(highScoreListEl);

  // The "High scores" page navigation buttons
  var goBackEl = document.createElement("button");
  goBackEl.id = "go-back";
  goBackEl.className = "btn";
  goBackEl.textContent = "Go Back";
  goBackEl.style.marginTop = "10px";
  highScoreDivEl.appendChild(goBackEl);
  var clearEl = document.createElement("button");
  clearEl.id = "clear";
  clearEl.className = "btn";
  clearEl.textContent = "Clear high scores";
  clearEl.style.marginTop = "10px";
  highScoreDivEl.appendChild(clearEl);
  highScorePageEl.appendChild(highScoreDivEl);

  // Activate the buttons
  clearEl.addEventListener("click", function () { showHighScores("clear") });
  goBackEl.addEventListener("click", codeQuiz);

  cardBodyEl.appendChild(highScorePageEl);

  console.log("END OF showHighScores()");
};

/** Store the SCORE! */
var storeScore = function () {
  console.log("START OF storeScore()");
  Done = true;
  initials = document.getElementById("initials-input").value.toUpperCase();
  if (!initials) {
    alert("You must enter your initials!");
    endQuiz();
    console.log("END OF storeScore()");
    return;
  }
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

  // Store high scores (local for now)
  localStorage.setItem("scores", JSON.stringify(scoresObj));

  // Go back to another round of the Quiz
  codeQuiz();
  console.log("END OF storeScore()");
}

/** End the Quiz */
var endQuiz = function () {
  console.log("START OF endQuiz()");
  Done = true; // just to make sure
  removeAllChildNodes(document.querySelector(".card-body"));
  
  // Setup for reporting score
  var cardBodyEl = document.querySelector(".card-body");  
  var reportScoreListEl = document.createElement("ol");
  reportScoreListEl.style.listStyleType = "none";
  var reportScoreFirstEl = document.createElement("li");
  var reportScoreSecondEl = document.createElement("li");
  var reportScoreH1El = document.createElement("h1");
  var reportScoreH2El = document.createElement("h2");
  reportScoreH1El.textContent = "All Done";
  reportScoreFirstEl.appendChild(reportScoreH1El);
  reportScoreH2El.style.fontSize = "1.2em";
  reportScoreH2El.textContent = "Your final score: " + timeLeft;
  reportScoreSecondEl.appendChild(reportScoreH2El);
  reportScoreListEl.appendChild(reportScoreFirstEl);
  reportScoreListEl.appendChild(reportScoreSecondEl);
  
  // Assign the global value for final score...
  // used by other functions
  finalScore = timeLeft;

  // Record initials and capture high score
  var initialsPromptEl = document.createElement("p");
  initialsPromptEl.textContent = "Enter Initials:"
  initialsPromptEl.setAttribute("id", "initials-prompt");

  var inputInitialsEl = document.createElement("input");
  inputInitialsEl.setAttribute("type", "text");
  inputInitialsEl.setAttribute("id", "initials-input");
  inputInitialsEl.setAttribute("placeholder", "initials");

  var buttonEl = document.createElement("button");
  buttonEl.className = "submit-btn";
  buttonEl.textContent = "submit";
  buttonEl.addEventListener("click", storeScore);

  var inputScoreEl = document.createElement("li");
  inputScoreEl.appendChild(initialsPromptEl);
  inputScoreEl.appendChild(inputInitialsEl);
  inputScoreEl.appendChild(buttonEl);
  reportScoreListEl.appendChild(inputScoreEl)

  cardBodyEl.appendChild(reportScoreListEl);
  
  console.log("END OF endQuiz()");
};

/** Start the Quiz */
var startQuiz = function () {
  console.log("START OF startQuiz()");
  Done = false;
  quizTimer();
  updateTimer();
  answerQuestions();
  console.log("END OF startQuiz()");
};

/** Build the WELCOME Page */
var buildWelcomePage = function () {
  console.log("START OF buildWelcomePage()");
  removeAllChildNodes(document.querySelector(".quiz"));
  removeAllChildNodes(document.querySelector(".card-header"));
  removeAllChildNodes(document.querySelector(".card-body"));
  removeAllChildNodes(document.querySelector(".card-footer"));

  // Quiz (top) element
  var quizEl = document.querySelector(".quiz");
  quizEl.innerHTML = "<Header></Header>";
  var quizHeaderEl = document.querySelector(".quiz header");

  // High scores and timer (part of Quiz element)
  var pHighScoresEl = document.createElement("p");
  pHighScoresEl.textContent = "View HighScores";
  pHighScoresEl.style.color = "#DB7093";
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
  cardHeaderEL.innerHTML = "<h2 style='text-align: center;'>Answer each question as quick as possible...seconds matter. If your answer is wrong, you will be penalized 10 seconds.<br> <br>Do well my friend!</h2>";

  // START QUIZ button
  var buttonEl = document.createElement("button");
  buttonEl.id = "start-quiz";
  buttonEl.className = "btn";
  buttonEl.textContent = "START QUIZ";
  var cardFooterEl = document.querySelector(".card-footer");
  cardFooterEl.appendChild(buttonEl);
  console.log("END OF buildWelcomePage()");
};

/** Take the Quiz */
var codeQuiz = function () {
  console.log("START OF codeQuiz()");
  // Dynamic global variables assigned
  timeLeft = maxTime;
  updateTime = 1; // seconds
  questionsAsked = 0;
  initials = "";
  finalScore = 0;

  buildWelcomePage();
  var startBtnEl = document.getElementById("start-quiz");
  startBtnEl.addEventListener("click", startQuiz);
  console.log("END OF codeQuiz()");
};

//*****************
//* TAKE THE QUIZ *
//*****************

codeQuiz();
