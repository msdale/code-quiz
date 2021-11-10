// Static global variables
var maxTime = 75; // seconds
var quizQuestions = [
  {
    "question":
      "Commonly used data types do not include:",
    "answers":
      [
        "strings",
        "booleans",
        "alerts",
        "numbers"
      ],
    "correct-answer-index":
      2
  },
  {
    "question":
      "The condition in and if/else statement is enclosed in _________",
    "answers":
      [
        "quotes",
        "curly brackets",
        "parenthesis",
        "square brackets"
      ],
    "correct-answer-index":
      2
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
        "curly brackets",
        "quotes",
        "parenthesis"
      ],
    "correct-answer-index":
      2  
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
  removeAllChildNodes(document.querySelector(".card-footer"));
  removeAllChildNodes(document.querySelector(".card-body"));
  document.querySelector(".quiz h1").textContent = "";
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
    document.querySelector(".card-header h2").style.textAlign = "left";
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

  // High Score title
  var cardHeaderEl = document.querySelector(".card-header");
  var cardHeaderH2El = document.createElement("h2");
  cardHeaderH2El.textContent = "High Scores";
  cardHeaderH2El.style.textAlign = "center";
  cardHeaderEl.appendChild(cardHeaderH2El);

  // High Score card
  var cardBodyEl = document.querySelector(".card-body");
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

  // Activate "Go back" and "Clear high scores" buttons
  clearEl.addEventListener("click", function () { showHighScores("clear") });
  goBackEl.addEventListener("click", codeQuiz);
  console.log("END OF showHighScores()");
};

/** Store the SCORE! */
var storeScore = function () {
  console.log("START OF storeScore()");
  Done = true;
  initials = document.getElementById("initials-input").value;
  if (!initials) {
    alert("You must enter your initials!");
    endQuiz();
    console.log("END OF storeScore()");
    return;
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
  removeAllChildNodes(document.querySelector(".answer-list"))
  removeAllChildNodes(document.querySelector(".card-body"));
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
  cardHeaderEL.innerHTML = "<h2 style='text-align: left;'>Answer each question as quick as possible...seconds matter. If your answer is wrong, you will be penalized 10 seconds.<br> <br>Do well my friend!</h2>";

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
