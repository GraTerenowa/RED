/*
  DIAMENTOWY TESTAMENT — PART I
  ----------------------------
  EDIT ONLY THIS SECTION WHEN YOU WANT TO CHANGE THE GAME:

  1. Put the correct answer / answers for every quest in QUESTS.
  2. Set answerType to "text" or "number" for each quest.
  3. Change NEXT_PART_CODE to the code players should receive after all 6 quests.

  Answers are NOT case-sensitive. Extra spaces and accent marks are ignored.
*/

const NEXT_PART_CODE = "0406"; // <-- CHANGE THE CODE HERE

const QUESTS = [
  { answerType: "text",   answers: ["answer1"] }, // Quest 1
  { answerType: "number", answers: ["123"] },     // Quest 2
  { answerType: "text",   answers: ["answer3"] }, // Quest 3
  { answerType: "number", answers: ["456"] },     // Quest 4
  { answerType: "text",   answers: ["answer5"] }, // Quest 5
  { answerType: "number", answers: ["789"] }      // Quest 6
];

const STORAGE_KEY = "diamentowy-testament-mike-johnson-part-1";

const questsContainer = document.querySelector("#quests");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const finalModal = document.querySelector("#finalModal");
const finalCode = document.querySelector("#finalCode");

const normalize = (value) => value
  .trim()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, " ");

function loadSolved() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data.slice(0, QUESTS.length) : [];
  } catch {
    return [];
  }
}

let solved = loadSolved();
while (solved.length < QUESTS.length) solved.push(false);

function saveSolved() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solved));
}

function showFinalCode() {
  finalCode.textContent = NEXT_PART_CODE;
  finalModal.hidden = false;
  document.body.classList.add("modal-open");
}

function updateProgress(showPopup = false) {
  const count = solved.filter(Boolean).length;
  progressText.textContent = `${count} / ${QUESTS.length}`;
  progressBar.style.width = `${(count / QUESTS.length) * 100}%`;

  if (count === QUESTS.length) {
    finalCode.textContent = NEXT_PART_CODE;
    if (showPopup) showFinalCode();
  }
}

function renderQuests() {
  questsContainer.innerHTML = "";

  QUESTS.forEach((quest, index) => {
    const card = document.createElement("article");
    card.className = `quest-card${solved[index] ? " solved" : ""}`;

    card.innerHTML = `
      <h2 class="quest-title">Quest ${index + 1}</h2>
      <p class="answer-type">Answer type: ${quest.answerType}</p>
      <div class="answer-row">
        <input
          class="answer-input"
          type="text"
          autocomplete="off"
          placeholder="Enter ${quest.answerType} answer..."
          aria-label="Answer to Quest ${index + 1}"
          ${solved[index] ? "disabled value='COMPLETED'" : ""}
        />
        <button class="check-btn" type="button" ${solved[index] ? "disabled" : ""}>
          ${solved[index] ? "Completed" : "Check answer"}
        </button>
      </div>
      <div class="feedback ${solved[index] ? "ok" : ""}" aria-live="polite">
        ${solved[index] ? "✓ Correct answer." : ""}
      </div>
    `;

    const input = card.querySelector(".answer-input");
    const button = card.querySelector(".check-btn");
    const feedback = card.querySelector(".feedback");

    function checkAnswer() {
      if (solved[index]) return;

      const value = normalize(input.value);
      const isCorrect = quest.answers.some(answer => normalize(answer) === value);

      if (!value) {
        feedback.textContent = "Enter an answer first.";
        feedback.className = "feedback no";
        return;
      }

      if (isCorrect) {
        solved[index] = true;
        saveSolved();
        card.classList.add("solved");
        input.value = "COMPLETED";
        input.disabled = true;
        button.textContent = "Completed";
        button.disabled = true;
        feedback.textContent = "✓ Correct answer.";
        feedback.className = "feedback ok";
        updateProgress(true);
      } else {
        feedback.textContent = "Incorrect answer. Try again.";
        feedback.className = "feedback no";
        input.select();
      }
    }

    button.addEventListener("click", checkAnswer);
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") checkAnswer();
    });

    questsContainer.appendChild(card);
  });
}

renderQuests();
updateProgress(false);

// If the page is reopened after all quests were completed, show the final code again.
if (solved.every(Boolean)) {
  showFinalCode();
}
