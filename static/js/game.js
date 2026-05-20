const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const saveScoreButton = document.getElementById("save-score-button");
const balloonContainer = document.getElementById("balloon-container");
const timerLabel = document.getElementById("timer");
const scoreLabel = document.getElementById("score");
const comboLabel = document.getElementById("combo");
const targetLabel = document.getElementById("target-number");
const resultsPanel = document.getElementById("results-panel");
const finalScoreLabel = document.getElementById("final-score");
const finalComboLabel = document.getElementById("final-combo");
const playerNameInput = document.getElementById("player-name");
const highscoreList = document.getElementById("highscore-list");

let gameState = {
  running: false,
  timer: 45,
  score: 0,
  combo: 0,
  bestCombo: 0,
  targetNumber: 5,
  intervalId: null,
};

const balloonColors = ["blue", "pink", "yellow", "green", "orange"];

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
  timerLabel.textContent = gameState.timer;
  scoreLabel.textContent = gameState.score;
  comboLabel.textContent = gameState.combo;
  targetLabel.textContent = gameState.targetNumber;
}

function createBalloon(value, leftPercent) {
  const balloon = document.createElement("button");
  balloon.className = `balloon ${balloonColors[randomNumber(0, balloonColors.length - 1)]} fly`;
  balloon.style.left = `${leftPercent}%`;
  balloon.style.animationDuration = `${randomNumber(7, 10)}s`;
  balloon.innerHTML = `<span>${value}</span>`;
  balloon.dataset.value = value;

  balloon.addEventListener("click", () => handleBalloonClick(balloon));
  return balloon;
}

function spawnBalloons() {
  balloonContainer.innerHTML = "";
  const target = gameState.targetNumber;
  const balloonCount = 7;
  const positions = Array.from({ length: balloonCount }, (_, i) => (i * 100) / balloonCount + 4);

  for (let i = 0; i < balloonCount; i += 1) {
    const value = i === 0 ? target : randomNumber(1, 9);
    const balloon = createBalloon(value, positions[i]);
    balloonContainer.appendChild(balloon);
  }
}

function handleBalloonClick(balloon) {
  if (!gameState.running) return;
  const clickedValue = Number(balloon.dataset.value);
  if (clickedValue === gameState.targetNumber) {
    playGoodHit(balloon);
    gameState.combo += 1;
    gameState.bestCombo = Math.max(gameState.bestCombo, gameState.combo);
    const points = 10 + gameState.combo * 5;
    gameState.score += points;
    gameState.targetNumber = randomNumber(1, 9);
    updateUI();
    spawnBalloons();
  } else {
    playBadHit(balloon);
    gameState.combo = 0;
    gameState.score = Math.max(0, gameState.score - 5);
    updateUI();
  }
}

function playGoodHit(balloon) {
  balloon.classList.add("pop");
  setTimeout(() => {
    balloon.remove();
  }, 200);
}

function playBadHit(balloon) {
  balloon.style.transform += " scale(0.95)";
  setTimeout(() => {
    balloon.style.transform = balloon.style.transform.replace(" scale(0.95)", "");
  }, 200);
}

function startGame() {
  gameState.running = true;
  gameState.timer = 45;
  gameState.score = 0;
  gameState.combo = 0;
  gameState.bestCombo = 0;
  gameState.targetNumber = randomNumber(1, 9);
  updateUI();
  spawnBalloons();
  resultsPanel.classList.add("hidden");
  playerNameInput.value = "";

  if (gameState.intervalId) {
    clearInterval(gameState.intervalId);
  }

  gameState.intervalId = setInterval(() => {
    gameState.timer -= 1;
    updateUI();
    if (gameState.timer <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameState.running = false;
  clearInterval(gameState.intervalId);
  gameState.intervalId = null;
  finalScoreLabel.textContent = gameState.score;
  finalComboLabel.textContent = gameState.bestCombo;
  resultsPanel.classList.remove("hidden");
  balloonContainer.innerHTML = "";
}

async function fetchHighscores() {
  const response = await fetch("/api/highscores");
  const data = await response.json();
  highscoreList.innerHTML = "";
  data.high_scores.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = `${entry.player_name} — ${entry.score} pts (combo ${entry.combo})`;
    highscoreList.appendChild(item);
  });
}

async function saveScore() {
  const playerName = playerNameInput.value.trim() || "Player";
  const payload = {
    player_name: playerName,
    score: gameState.score,
    combo: gameState.bestCombo,
  };

  await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  saveScoreButton.textContent = "Saved!";
  fetchHighscores();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
saveScoreButton.addEventListener("click", saveScore);
window.addEventListener("load", () => {
  fetchHighscores();
  updateUI();
});
