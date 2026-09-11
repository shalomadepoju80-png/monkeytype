const wordList = `
the of and a to in is you that it he was for on are as with his they I at be
this have from or one had by word but not what all were we when your can said
there use an each which she do how their if will up other about out many then
them these so some her would make like him into time has look two more write
go see number no way could people my than first water been call who oil its now
find long down day did get come made may part over new sound take only little
work know place years live me back give most very after thing our just name good
sentence man think say great where help through much before line right too mean
old any same tell boy follow came want show also around form three small set put
end does another well large must big even such because turn here why ask went
men read need land different home us move try kind hand picture again change off
play spell air away animal house point page letter mother answer found study
still learn should America world high every near add food between own below
country plant last school father keep tree never start city earth eye light
thought head under story saw left few while along might close something seem next
hard open example begin life always those both paper together got group often
run important until children side feet car mile night walk white sea began grow
took river four carry state once book hear stop without second later miss idea
enough eat face watch far Indian real almost let above girl sometimes mountain
cut young talk soon list song being leave family body music color stand sun
questions fish area mark dog horse birds problem complete room knew since ever
piece told usually friends easy heard order red door sure become top ship across
today during short better best however low hours black products happened whole
measure remember early waves reached listen wind rock space covered fast several
hold himself toward five step morning passed vowel true hundred against pattern
numeral table north slowly money map farm pulled draw voice seen cold cried plan
notice south sing war ground fall king town unit figure certain field travel
wood fire upon done English road half ten fly gave box finally wait correct
quick brown fox jumps lazy typing keyboard computer practice speed accuracy
`.trim().split(/\s+/);


/* =========================
   TYPING TEST
========================= */

const wordsElement = document.getElementById("words");
const input = document.getElementById("input");
const timerElement = document.getElementById("timer");

const resultsElement = document.getElementById("results");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalCharacters = document.getElementById("finalCharacters");

let testTime = 30;
let timeLeft = testTime;
let timer = null;
let started = false;
let finished = false;

let currentWord = 0;
let typedCharacters = 0;
let correctCharacters = 0;


function randomWords(amount = 100) {
  const result = [];

  for (let i = 0; i < amount; i++) {
    result.push(
      wordList[Math.floor(Math.random() * wordList.length)]
    );
  }

  return result;
}


function createTest() {
  clearInterval(timer);

  started = false;
  finished = false;

  timeLeft = testTime;
  currentWord = 0;
  typedCharacters = 0;
  correctCharacters = 0;

  timerElement.textContent = timeLeft;

  resultsElement.classList.add("hidden");

  wordsElement.innerHTML = "";

  randomWords().forEach((word, index) => {
    const span = document.createElement("span");

    span.className = "word";
    span.textContent = word;

    if (index === 0) {
      span.classList.add("current");
    }

    wordsElement.appendChild(span);
  });

  input.value = "";
}


function startTimer() {
  if (started) return;

  started = true;

  timer = setInterval(() => {
    timeLeft--;

    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      finishTest();
    }
  }, 1000);
}


function finishTest() {
  clearInterval(timer);

  finished = true;
  input.blur();

  const elapsedMinutes = testTime / 60;

  const wpm = Math.round(
    (correctCharacters / 5) / elapsedMinutes
  );

  const accuracy =
    typedCharacters === 0
      ? 0
      : Math.round(
          (correctCharacters / typedCharacters) * 100
        );

  finalWpm.textContent = wpm;
  finalAccuracy.textContent = `${accuracy}%`;
  finalCharacters.textContent = typedCharacters;

  resultsElement.classList.remove("hidden");
}


input.addEventListener("input", () => {
  if (finished) return;

  startTimer();

  const words = document.querySelectorAll(".word");
  const word = words[currentWord];

  if (!word) {
    finishTest();
    return;
  }

  const typed = input.value;

  if (!word.textContent.startsWith(typed)) {
    word.classList.add("incorrect");
  } else {
    word.classList.remove("incorrect");
  }
});


document.addEventListener("keydown", event => {
  if (event.key !== " ") return;
  if (finished) return;

  event.preventDefault();

  const words = document.querySelectorAll(".word");
  const word = words[currentWord];

  if (!word) return;

  const typed = input.value.trim();

  if (!typed) return;

  typedCharacters += typed.length;

  for (
    let i = 0;
    i < Math.min(typed.length, word.textContent.length);
    i++
  ) {
    if (typed[i] === word.textContent[i]) {
      correctCharacters++;
    }
  }

  if (typed === word.textContent) {
    word.classList.add("correct");
  } else {
    word.classList.add("incorrect");
  }

  word.classList.remove("current");

  currentWord++;

  if (words[currentWord]) {
    words[currentWord].classList.add("current");
  }

  input.value = "";
});


document.querySelectorAll("[data-time]").forEach(button => {
  button.addEventListener("click", () => {
    testTime = Number(button.dataset.time);

    document
      .querySelectorAll("[data-time]")
      .forEach(btn => btn.classList.remove("selected"));

    button.classList.add("selected");

    createTest();
  });
});


document.getElementById("restart").addEventListener(
  "click",
  createTest
);


/* =========================
   PAGE NAVIGATION
========================= */

const pages = {
  typing: document.getElementById("typingPage"),
  practice: document.getElementById("practicePage"),
  units: document.getElementById("unitsPage"),
  leaderboard: document.getElementById("leaderboardPage")
};


document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {

    const page = button.dataset.page;

    Object.values(pages).forEach(section => {
      section.classList.add("hidden-page");
    });

    pages[page].classList.remove("hidden-page");

    document
      .querySelectorAll(".nav-btn")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    if (page === "typing") {
      input.focus();
    }
  });
});


/* =========================
   100 UNIT COURSE
========================= */

const unitsGrid = document.getElementById("unitsGrid");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

let completedUnits =
  Number(localStorage.getItem("monkeyTypingCompletedUnits")) || 0;


/*
  This creates 100 units automatically.
  Later we can replace these with real lessons.
*/

function createUnits() {
  unitsGrid.innerHTML = "";

  for (let i = 1; i <= 100; i++) {

    const unit = document.createElement("div");

    const locked = i > completedUnits + 1;
    const completed = i <= completedUnits;

    unit.className = "unit";

    if (locked) {
      unit.classList.add("locked");
    }

    if (completed) {
      unit.classList.add("completed");
    }

    let status = "Ready";

    if (completed) {
      status = "✓ Completed";
    } else if (locked) {
      status = "🔒 Locked";
    } else {
      status = "▶ Current";
    }

    unit.innerHTML = `
      <div class="unit-number">UNIT ${i}</div>
      <h3>${getUnitName(i)}</h3>
      <p>Typing lesson and practice.</p>

      <div class="status">${status}</div>

      <button ${locked ? "disabled" : ""}>
        ${completed ? "Review" : "Start"}
      </button>
    `;

    const button = unit.querySelector("button");

    if (!locked) {
      button.addEventListener("click", () => {
        startUnit(i);
      });
    }

    unitsGrid.appendChild(unit);
  }

  updateProgress();
}


function getUnitName(unit) {
  if (unit <= 10) return "Keyboard Basics";
  if (unit <= 20) return "Home Row";
  if (unit <= 30) return "Top Row";
  if (unit <= 40) return "Bottom Row";
  if (unit <= 50) return "Common Words";
  if (unit <= 60) return "Speed Practice";
  if (unit <= 70) return "Accuracy Practice";
  if (unit <= 80) return "Sentence Practice";
  if (unit <= 90) return "Advanced Typing";

  return "Final Challenge";
}


function updateProgress() {
  progressText.textContent = `${completedUnits} / 100`;

  const percent = Math.max(
    1,
    (completedUnits / 100) * 100
  );

  progressFill.style.width = `${percent}%`;
}


function startUnit(unitNumber) {

  alert(
    `Starting Unit ${unitNumber}!\n\n` +
    `This is where the lesson for Unit ${unitNumber} will open.`
  );

  /*
    Later this will open the actual unit:
    Lesson → Practice → Test → Completion
  */
}


createUnits();


/* =========================
   PRACTICE BUTTON
========================= */

document.querySelector(".start-practice")
  .addEventListener("click", () => {

    document
      .querySelectorAll(".nav-btn")
      .forEach(btn => btn.classList.remove("active"));

    document
      .querySelector('[data-page="typing"]')
      .classList.add("active");

    Object.values(pages).forEach(section => {
      section.classList.add("hidden-page");
    });

    pages.typing.classList.remove("hidden-page");

    createTest();
    input.focus();
  });


/* =========================
   START
========================= */

createTest();

document.addEventListener("click", () => {
  if (
    !finished &&
    !pages.typing.classList.contains("hidden-page")
  ) {
    input.focus();
  }
});
