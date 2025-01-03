// Problem data import
const { getDifferentiationProblems, getIntegrationProblems } = await import('./problems.js');

// Game state variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let lives = 10;
let level = 1;
let timer = 60;
let timerInterval;
let currentProblem;
let currentQuestionType = 'diff';

// Filling currentProblem with a random problem from the selected type
currentProblem = generateProblem(); // Assign a value later

// DOM Elements
const scoreElement = document.getElementById('score-value');
const highScoreElement = document.getElementById('high-score-value');
const livesElement = document.getElementById('lives-value');
const levelElement = document.getElementById('level-value');
const timerElement = document.getElementById('timer-value');
const questionElement = document.getElementById('equation');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');

// Initialize the game
function newProblem() {
    currentProblem = generateProblem();
    // Show loading state
    questionElement.textContent = 'Loading problem...';
    
    // Check if KaTeX is loaded
    const checkKaTeX = () => {
        if (typeof katex !== 'undefined') {
            try {
                // Clear any existing content
                questionElement.innerHTML = '';
                
                // Render with KaTeX
                katex.render(currentProblem.question, questionElement, {
                    displayMode: true,
                    throwOnError: false,
                    macros: {
                        "\\sin": "\\text{sin}",
                        "\\cos": "\\text{cos}",
                        "\\tan": "\\text{tan}",
                        "\\ln": "\\text{ln}"
                    }
                });
            } catch (e) {
                console.error('KaTeX rendering error:', e);
                console.log('Problem content:', currentProblem.question);
                questionElement.textContent = currentProblem.question;
            }
        } else {
            console.error('KaTeX not loaded');
            questionElement.textContent = currentProblem.question;
        }
    };

    // Try rendering immediately
    checkKaTeX();
    
    // If KaTeX isn't loaded yet, set up a retry mechanism
    if (typeof katex === 'undefined') {
        const kaTeXCheckInterval = setInterval(() => {
            if (typeof katex !== 'undefined') {
                clearInterval(kaTeXCheckInterval);
                checkKaTeX();
            }
        }, 100);
        
        // Give up after 2 seconds
        setTimeout(() => {
            clearInterval(kaTeXCheckInterval);
            if (typeof katex === 'undefined') {
                console.error('KaTeX failed to load');
                questionElement.textContent = currentProblem.question;
            }
        }, 2000);
    }
    answerInput.value = '';
    answerInput.focus();
}

function generateProblem() {
    const problems = currentQuestionType === 'diff' ? getDifferentiationProblems() : getIntegrationProblems();
    return problems[Math.floor(Math.random() * problems.length)];
}

// Function to check the answer
function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    if (userAnswer === currentProblem.answer.toLowerCase()) {
        score += 10;
        correctSound.play();
        newProblem();
    } else {
        lives -= 1;
        wrongSound.play();
        alert(`Incorrect! The correct answer is: ${currentProblem.answer}`);
        if (lives <= 0) {
            endGame();
        }
    }
    updateScore();
}

// Function to update the score and lives display
function updateScore() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = highScore;
    }
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        clockTick.play();
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

// Function to end the game
function endGame() {
    clearInterval(timerInterval);
    questionElement.textContent = `Game Over! Your score: ${score}`;
    document.getElementById('gameOverModal').style.display = 'block';
}

// Event listeners
submitButton.addEventListener('click', checkAnswer);
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('helpModal').style.display = 'none';
        document.getElementById('gameOverModal').style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    newProblem();
    startTimer();
});

// Add keyboard event listener for enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Add keyboard event listener for level up
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        levelUp();
    }
});

// Function to level up
function levelUp() {
    level++;
    levelElement.textContent = level;
    timer += 10;
    timerElement.textContent = timer;
    score += 10;
    scoreElement.textContent = score;
    newProblem();
}