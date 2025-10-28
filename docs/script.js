/*
 * Galactic Calculus game logic.
 *
 * This script powers both the differentiation and antiderivative games.
 * It exposes functions for generating problems, checking answers, and managing
 * game state (score, lives, timer and level).  Where possible the code
 * detects the presence of optional UI elements such as reset and switch
 * buttons before attaching event listeners.
 */

// Persistent keys for leaderboard, achievements and settings
const LEADERBOARD_KEY = 'galacticCalculusLeaderboard';
const ACHIEVEMENTS_KEY = 'galacticCalculusAchievements';
const SETTINGS_KEY = 'galacticCalculusSettings';

// Load persistent settings. Defaults include lives, timer, sound, selected specification and target marks.
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
    lives: 10,
    timer: 20,
    sound: true,
    spec: 'igcse_math_a',
    targetMarks: 100
};

/**
 * Load settings from localStorage into the settings object. This function
 * should be called before starting a new game to ensure the most recent
 * configuration is applied.
 */
function loadSettings() {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (saved) {
        settings = saved;
    }
}

/**
 * Save new settings to localStorage and update the global variables. When
 * called, this function persists the user's preferences and applies them
 * immediately to the current game state.
 * @param {Object} newSettings Partial settings object
 */
function saveSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Apply to current game variables
    lives = settings.lives;
    timer = settings.timer;
}

// Immediately load any saved settings on script load
loadSettings();

// Load leaderboard and achievements from storage
let leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
const ACHIEVEMENTS = [
    { id: 'firstSteps', name: 'First Steps', description: 'Score at least 10 points' },
    { id: 'onARoll', name: 'On A Roll', description: 'Score 50 points' },
    { id: 'master', name: 'Master', description: 'Score 100 points' },
    { id: 'invincible', name: 'Invincible', description: 'Finish with full lives' },
    { id: 'switcheroo', name: 'Switcheroo', description: 'Switch modes at least once' }
];
let achievementsStatus = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY)) || {};

// Track if the player has used the switch button this round (for achievements)
let switchUsed = false;

// Game state variables
let score = 0;
let highScore = parseInt(localStorage.getItem('highScore'), 10) || 0;
let lives = settings.lives;
let level = 1;
let timer = settings.timer;
let timerInterval;
let currentProblem;

// Allow pages to set an initial question type (diff or antiderivative).
let currentQuestionType = typeof window.initialQuestionType === 'string'
    ? window.initialQuestionType
    : 'diff';

// Audio elements
const wrongSound = document.getElementById('wrongSound');
const correctSound = document.getElementById('correctSound');

// DOM elements
const scoreElement = document.getElementById('score-value');
const highScoreElement = document.getElementById('high-score-value');
const livesElement = document.getElementById('lives-value');
const levelElement = document.getElementById('level-value');
const timerElement = document.getElementById('timer-value');
const questionElement = document.getElementById('equation');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');

// Optional UI elements
const restartButton = document.getElementById('restartButton');
const resetButton = document.getElementById('resetButton');
const switchButton = document.getElementById('switchButton');
const helpButton = document.getElementById('helpButton');
const helpModal = document.getElementById('helpModal');
const gameOverModal = document.getElementById('gameOverModal');
const newHighScoreElement = document.getElementById('newHighScore');

// Initialise display
function initDisplay() {
    highScoreElement.textContent = highScore;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    levelElement.textContent = level;
    timerElement.textContent = timer;
}
initDisplay();

/**
 * Generate an array of differentiation problems. Each problem has a question
 * and an answer (both as strings). Feel free to add more variety here.
 */
function getDifferentiationProblems() {
    return [
        { question: "\\frac{d}{dx}(x^2)", answer: "2x" },
        { question: "\\frac{d}{dx}(3x^3)", answer: "9x^2" },
        { question: "\\frac{d}{dx}(x^3)", answer: "3x^2" },
        { question: "\\frac{d}{dx}(5x^4)", answer: "20x^3" },
        { question: "\\frac{d}{dx}(x^5)", answer: "5x^4" },
        { question: "\\frac{d}{dx}(2x)", answer: "2" },
        { question: "\\frac{d}{dx}(7x)", answer: "7" },
        { question: "\\frac{d}{dx}(10x)", answer: "10" },
        { question: "\\frac{d}{dx}(x)", answer: "1" },
        { question: "\\frac{d}{dx}(8)", answer: "0" },
        { question: "\\frac{d}{dx}(15)", answer: "0" },
        { question: "\\frac{d}{dx}(x^6)", answer: "6x^5" },
        { question: "\\frac{d}{dx}(4x^2)", answer: "8x" },
        { question: "\\frac{d}{dx}(6x^3)", answer: "18x^2" },
        { question: "\\frac{d}{dx}(2x^4)", answer: "8x^3" },
        { question: "\\frac{d}{dx}(x^7)", answer: "7x^6" },
        { question: "\\frac{d}{dx}(9x^5)", answer: "45x^4" },
        { question: "\\frac{d}{dx}(12x^2)", answer: "24x" },
        { question: "\\frac{d}{dx}(x^8)", answer: "8x^7" },
        { question: "\\frac{d}{dx}(20x)", answer: "20" },
        { question: "\\frac{d}{dx}(x^9)", answer: "9x^8" },
        { question: "\\frac{d}{dx}(11x^3)", answer: "33x^2" },
        { question: "\\frac{d}{dx}(x^{10})", answer: "10x^9" },
        { question: "\\frac{d}{dx}(13x^4)", answer: "52x^3" },
        { question: "\\frac{d}{dx}(x^{11})", answer: "11x^{10}" },
        { question: "\\frac{d}{dx}(e^x)", answer: "e^x" },
        { question: "\\frac{d}{dx}(\\sin(x))", answer: "\\cos(x)" },
        { question: "\\frac{d}{dx}(\\cos(x))", answer: "-\\sin(x)" },
        { question: "\\frac{d}{dx}(\\tan(x))", answer: "\\sec^2(x)" },
        { question: "\\frac{d}{dx}(\\ln(x))", answer: "\\frac{1}{x}" },
        { question: "\\frac{d}{dx}(e^{2x})", answer: "2e^{2x}" },
        { question: "\\frac{d}{dx}(x^2 + 3x + 2)", answer: "2x + 3" },
        { question: "\\frac{d}{dx}(x^3 - 4x^2 + 6)", answer: "3x^2 - 8x" },
        { question: "\\frac{d}{dx}(x^4 + 2x^3 - x)", answer: "4x^3 + 6x^2 - 1" },
        { question: "\\frac{d}{dx}(x^5 + 5)", answer: "5x^4" },
        { question: "\\frac{d}{dx}(x^6 - 3x^2 + 2)", answer: "6x^5 - 6x" }
    ];
}

/**
 * Generate an array of antiderivative (integration) problems.
 */
function getIntegrationProblems() {
    return [
        { question: "\\int x \\, dx", answer: "\\frac{x^2}{2} + C" },
        { question: "\\int 2x \\, dx", answer: "x^2 + C" },
        { question: "\\int 3x^2 \\, dx", answer: "x^3 + C" },
        { question: "\\int 4x^3 \\, dx", answer: "x^4 + C" },
        { question: "\\int 5 \\, dx", answer: "5x + C" },
        { question: "\\int x^4 \\, dx", answer: "\\frac{x^5}{5} + C" },
        { question: "\\int 6x^5 \\, dx", answer: "x^6 + C" },
        { question: "\\int 7 \\, dx", answer: "7x + C" },
        { question: "\\int x^3 + 2x \\, dx", answer: "\\frac{x^4}{4} + x^2 + C" },
        { question: "\\int 8x^2 \\, dx", answer: "\\frac{8x^3}{3} + C" },
        { question: "\\int 9 \\, dx", answer: "9x + C" },
        { question: "\\int x^5 + 3 \\, dx", answer: "\\frac{x^6}{6} + 3x + C" },
        { question: "\\int 10x \\, dx", answer: "5x^2 + C" },
        { question: "\\int 11 \\, dx", answer: "11x + C" },
        { question: "\\int 12x^3 \\, dx", answer: "3x^4 + C" },
        { question: "\\int 13 \\, dx", answer: "13x + C" },
        { question: "\\int 14x^2 \\, dx", answer: "\\frac{14x^3}{3} + C" },
        { question: "\\int 15 \\, dx", answer: "15x + C" },
        { question: "\\int x^2 + 4 \\, dx", answer: "\\frac{x^3}{3} + 4x + C" },
        { question: "\\int 16x \\, dx", answer: "8x^2 + C" },
        { question: "\\int 17 \\, dx", answer: "17x + C" },
        { question: "\\int 18x^4 \\, dx", answer: "\\frac{18x^5}{5} + C" },
        { question: "\\int 19 \\, dx", answer: "19x + C" },
        { question: "\\int 20x^3 \\, dx", answer: "5x^4 + C" }
    ];
}

/**
 * Pick a new problem based on the current question type. Resets the timer.
 */
function newProblem() {
    currentProblem = generateProblem();
    questionElement.innerHTML = `$$${currentProblem.question}$$`;
    // Ensure MathJax typesets the new problem. MathJax v3 exports a Promise-based API.
    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise();
    } else if (window.MathJax && typeof MathJax.typeset === 'function') {
        MathJax.typeset();
    }
    answerInput.value = '';
    // Reset timer based on current settings
    timer = settings.timer;
    timerElement.textContent = timer;
}

/**
 * Generate a single problem.
 */
function generateProblem() {
    const problems = currentQuestionType === 'diff'
        ? getDifferentiationProblems()
        : getIntegrationProblems();
    return problems[Math.floor(Math.random() * problems.length)];
}

/**
 * Check the user's answer and update state accordingly.
 */
function checkAnswer() {
    // Remove whitespace to allow minor formatting differences.
    const userAnswer = answerInput.value.replace(/\s+/g, '').toLowerCase();
    const correctAnswer = currentProblem.answer.replace(/\s+/g, '').toLowerCase();
    if (userAnswer === correctAnswer) {
        score += 10;
        // Play sound only if enabled in settings
        if (settings.sound) {
            correctSound?.play();
        }
        // Level up every 100 points
        if (score % 100 === 0) {
            updateLevel();
        }
        newProblem();
    } else {
        lives -= 1;
        // Play sound only if enabled in settings
        if (settings.sound) {
            wrongSound?.play();
        }
        if (lives <= 0) {
            endGame();
        } else {
            questionElement.innerHTML = `Incorrect! Try again.`;
            setTimeout(() => {
                questionElement.innerHTML = `$$${currentProblem.question}$$`;
                if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                    MathJax.typesetPromise();
                } else {
                    MathJax.typeset();
                }
            }, 2000);
        }
    }
    updateScoreDisplay();
}

/**
 * Update the score, lives and high score display.
 */
function updateScoreDisplay() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore.toString());
        highScoreElement.textContent = highScore;
    }
}

/**
 * Start the countdown timer.
 */
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

/**
 * Pause the countdown timer without modifying the remaining time. This is
 * invoked when opening modal dialogs so that the timer doesn't expire
 * while the player is reading the leaderboard, achievements or settings.
 */
function pauseTimer() {
    clearInterval(timerInterval);
}

/**
 * Handle the end of the game.
 */
function endGame() {
    clearInterval(timerInterval);
    // Update high score if necessary
    let isNewHighScore = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore.toString());
        highScoreElement.textContent = highScore;
        isNewHighScore = true;
    }
    questionElement.innerHTML = '';
    document.getElementById('finalScore').textContent = `Your final score is ${score}.`;
    if (newHighScoreElement) {
        newHighScoreElement.style.display = isNewHighScore ? 'block' : 'none';
    }
    // Unlock achievements earned during this round
    checkAchievements();
    // Prompt the user for their name and update the leaderboard
    try {
        const name = prompt("Enter your name for the leaderboard:", "Player") || "Player";
        updateLeaderboardEntry(name, score);
    } catch (e) {
        // If prompts are blocked, fall back to anonymous
        updateLeaderboardEntry("Player", score);
    }
    if (gameOverModal) {
        gameOverModal.style.display = 'block';
    }
}

/**
 * Reset all game state variables and start a new round.
 */
function resetGame() {
    score = 0;
    // Apply lives and timer from current settings
    lives = settings.lives;
    level = 1;
    timer = settings.timer;
    // Reset switch usage for a new game round
    switchUsed = false;
    updateScoreDisplay();
    levelElement.textContent = level;
    newProblem();
    startTimer();
}

/**
 * Increase level and generate a new problem.
 */
function updateLevel() {
    level++;
    levelElement.textContent = level;
}

/**
 * Switch between differentiation and integration problems.
 */
function switchProblemType() {
    currentQuestionType = currentQuestionType === 'diff' ? 'antiderivative' : 'diff';
    // Immediately show a new problem from the other category
    newProblem();
}

/**
 * Add a score entry to the leaderboard. Each entry records the player's
 * name, score and a formatted date. The leaderboard is limited to the
 * top 10 scores and persisted to localStorage.
 * @param {string} name The player's name
 * @param {number} playerScore The player's score
 */
function updateLeaderboardEntry(name, playerScore) {
    const entry = {
        name,
        score: playerScore,
        date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    };
    leaderboard.push(entry);
    // Sort descending by score
    leaderboard.sort((a, b) => b.score - a.score);
    // Keep only the top 10 entries
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

/**
 * Render the leaderboard table and display the modal. If no entries exist,
 * the table will remain empty.
 */
function displayLeaderboard() {
    const tbody = document.getElementById('leaderboardTableBody');
    if (!tbody) return;
    // Clear existing rows
    tbody.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td><td>${entry.date}</td>`;
        tbody.appendChild(tr);
    });
    const modal = document.getElementById('leaderboardModal');
    if (modal) modal.style.display = 'block';
    // Pause game timer while viewing the leaderboard
    pauseTimer();
}

/**
 * Evaluate and unlock achievements based on the player's performance for the
 * round that just ended. This function updates the achievementsStatus
 * object and persists it in localStorage.
 */
function checkAchievements() {
    // Score milestones
    if (score >= 10 && !achievementsStatus['firstSteps']) {
        achievementsStatus['firstSteps'] = true;
    }
    if (score >= 50 && !achievementsStatus['onARoll']) {
        achievementsStatus['onARoll'] = true;
    }
    if (score >= 100 && !achievementsStatus['master']) {
        achievementsStatus['master'] = true;
    }
    // Finish with full lives
    if (lives === settings.lives && score > 0 && !achievementsStatus['invincible']) {
        achievementsStatus['invincible'] = true;
    }
    // Switch used at least once
    if (switchUsed && !achievementsStatus['switcheroo']) {
        achievementsStatus['switcheroo'] = true;
    }
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievementsStatus));
}

/**
 * Populate the achievements modal with all available achievements and their
 * unlocked status. Each entry shows the name, description and a badge
 * indicating whether it has been unlocked.
 */
function displayAchievements() {
    const ul = document.getElementById('achievementsList');
    if (!ul) return;
    ul.innerHTML = '';
    ACHIEVEMENTS.forEach(achievement => {
        const li = document.createElement('li');
        const unlocked = !!achievementsStatus[achievement.id];
        li.innerHTML = `<strong>${achievement.name}</strong>: ${achievement.description} <span class="badge ${unlocked ? 'unlocked' : 'locked'}">${unlocked ? 'Unlocked' : 'Locked'}</span>`;
        ul.appendChild(li);
    });
    const modal = document.getElementById('achievementsModal');
    if (modal) modal.style.display = 'block';
    // Pause game timer while viewing achievements
    pauseTimer();
}

/**
 * Open the settings modal and prefill the form with the current settings.
 */
function openSettings() {
    const livesInput = document.getElementById('settingsLives');
    const timerInput = document.getElementById('settingsTimer');
    const soundInput = document.getElementById('settingsSound');
    if (livesInput) livesInput.value = settings.lives;
    if (timerInput) timerInput.value = settings.timer;
    if (soundInput) soundInput.checked = settings.sound;
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'block';
    // Pause game timer while adjusting settings
    pauseTimer();
}

/**
 * Save the settings selected in the settings modal. When called, the
 * settings are persisted and the game restarts automatically unless it
 * has already ended (in which case changes take effect on the next run).
 */
function saveSettingsFromForm() {
    const livesInput = document.getElementById('settingsLives');
    const timerInput = document.getElementById('settingsTimer');
    const soundInput = document.getElementById('settingsSound');
    const newSettings = {};
    if (livesInput) newSettings.lives = parseInt(livesInput.value, 10) || settings.lives;
    if (timerInput) newSettings.timer = parseInt(timerInput.value, 10) || settings.timer;
    if (soundInput) newSettings.sound = soundInput.checked;
    saveSettings(newSettings);
    // Only reset if the game is still running
    if (!gameOverModal || gameOverModal.style.display !== 'block') {
        resetGame();
    }
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = 'none';
}

/**
 * Attach event listeners to buttons if they exist.
 */
function attachEventListeners() {
    submitButton?.addEventListener('click', checkAnswer);
    // Support pressing enter to submit
    answerInput?.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
    if (helpButton && helpModal) {
        helpButton.addEventListener('click', () => {
            helpModal.style.display = 'block';
            // Pause the timer while viewing help
            pauseTimer();
        });
    }
    // Close any open modal when clicking a close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            // Resume the timer only if the game hasn't ended
            if (!gameOverModal || gameOverModal.style.display !== 'block') {
                startTimer();
            }
        });
    });
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            if (gameOverModal) gameOverModal.style.display = 'none';
            resetGame();
        });
    }
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (gameOverModal) gameOverModal.style.display = 'none';
            resetGame();
        });
    }
    if (switchButton) {
        switchButton.addEventListener('click', () => {
            // Mark that the player has switched modes for achievements
            switchUsed = true;
            switchProblemType();
        });
    }

    // Leaderboard modal button
    const leaderboardButton = document.getElementById('leaderboardButton');
    if (leaderboardButton) {
        leaderboardButton.addEventListener('click', () => {
            displayLeaderboard();
        });
    }
    // Achievements modal button
    const achievementsButton = document.getElementById('achievementsButton');
    if (achievementsButton) {
        achievementsButton.addEventListener('click', () => {
            displayAchievements();
        });
    }
    // Settings modal button
    const settingsButton = document.getElementById('settingsButton');
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            openSettings();
        });
    }
    // Save settings button in modal
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', () => {
            saveSettingsFromForm();
        });
    }
}
attachEventListeners();

// Start the first problem and timer when the script loads
newProblem();
startTimer();
