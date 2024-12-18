// Game state variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let lives = 10;
let level = 1;
let timer = 60;
let timerInterval;
let currentProblem;
let currentQuestionType = 'diff'; // Default to differentiation

// Sound effects
const wrongSound = document.getElementById('wrongSound');
const correctSound = document.getElementById('correctSound');
const BgrMusic = document.getElementById('backgroundmusic');
const clockTick = document.getElementById('clockticking');

// Sound Effects Sources
wrongSound.src = 'assets/sounds/wrong-answer.mp3';
correctSound.src = 'assets/sounds/correct-answer.mp3';
BgrMusic.src = 'assets/sounds/background-music.mp3';
clockTick.src = 'assets/sounds/clock-ticking.mp3';

// DOM Elements
const scoreElement = document.getElementById('score-value');
const highScoreElement = document.getElementById('high-score-value');
const livesElement = document.getElementById('lives-value');
const levelElement = document.getElementById('level-value');
const timerElement = document.getElementById('timer-value');
const questionElement = document.getElementById('equation');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');

// Initialize high score display
highScoreElement.textContent = `High Score: ${highScore}`;

// Function to create a new problem
function newProblem() {
    currentProblem = generateProblem(); // Generate a new problem
    questionElement.innerHTML = `$$${currentProblem.question}$$`; // Use MathJax for rendering
    MathJax.typeset(); // Update MathJax rendering
}

// Function to generate a problem based on the current level
function generateProblem() {
    if (currentQuestionType === 'diff') {
        return getDifferentiationProblems()[Math.floor(Math.random() * getDifferentiationProblems().length)];
    } else if (currentQuestionType === 'antiderivative') {
        return getIntegrationProblems()[Math.floor(Math.random() * getIntegrationProblems().length)];
    }
}

// Function to get differentiation problems
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
        { question: "\\frac{d}{dx}(sin(x))", answer: "cos(x)" },
        { question: "\\frac{d}{dx}(cos(x))", answer: "-sin(x)" },
        { question: "\\frac{d}{dx}(tan(x))", answer: "sec^2(x)" },
        { question: "\\frac{d}{dx}(ln(x))", answer: "\\frac{1}{x}" },
        { question: "\\frac{d}{dx}(e^{2x})", answer: "2e^{2x}" },
        { question: "\\frac{d}{dx}(x^2 + 3x + 2)", answer: "2x + 3" },
        { question: "\\frac{d}{dx}(x^3 - 4x^2 + 6)", answer: "3x^2 - 8x" },
        { question: "\\frac{d}{dx}(x^4 + 2x^3 - x)", answer: "4x^3 + 6x^2 - 1" },
        { question: "\\frac{d}{dx}(x^5 + 5)", answer: "5x^4" },
        { question: "\\frac{d}{dx}(x^6 - 3x^2 + 2)", answer: "6x^5 - 6x" }
    ];
}

// Function to get antiderivative problems
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
        { question: "\\int 8x^2 \\, dx", answer: "x^3 + C" },
        { question: "\\int 9 \\, dx", answer: "9x + C" },
        { question: "\\int x^5 + 3 \\, dx", answer: "\\frac{x^6}{6} + 3x + C" },
        { question: "\\int 10x \\, dx", answer:  "5x^2 + C" },
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
        { question: "\\int 20x^3 \\, dx", answer:  "5x^4 + C" }
    ];
}

// Function to check the answer
function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    if (userAnswer === currentProblem.answer) {
        score += 10;
        correctSound.load();
        correctSound.play();
        newProblem(); // Generate a new problem
    } else {
        lives -= 1;
        wrongSound.load();
        wrongSound.play();
        // Show an alert with the correct answer
        alert(`Incorrect! The correct answer is: ${currentProblem.answer}`);
        if (lives <= 0) {
            endGame();
        } else {
            // Optionally, you can keep the current problem displayed
            questionElement.innerHTML = `$$${currentProblem.question}$$`; // Keep the problem displayed
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
        clockTick.load();
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
    questionElement.innerHTML = `Game Over! Your score: ${score}`;
    document.getElementById('gameOverModal').style.display = 'block';
}

// Event listeners
submitButton.addEventListener('click', checkAnswer);
document.getElementById('helpButton').addEventListener('click', () => {
    document.getElementById('helpModal').style.display = 'block';
});
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('helpModal').style.display = 'none';
        document.getElementById('gameOverModal').style.display = 'none';
    });
});

// Function to render the derivative symbol using KaTeX
function renderDerivativeSymbol() {
    const derivativeSymbol = document.getElementById('derivative-symbol');
    derivativeSymbol.innerHTML = `$$\\frac{d}{dx}$$`;
    MathJax.typeset(); // Render the KaTeX
}

// Call the function to render the symbol
renderDerivativeSymbol();

// Function to calculate the derivative
function calculateDerivative() {
    const input = document.getElementById('calc-input').value.trim();
    try {
        // Use math.js to calculate the derivative
        const derivative = math.derivative(input, 'x').toString();
        
        // Format the output to remove multiplication symbols
        const formattedDerivative = derivative.replace(/\*/g, '');
        
        document.getElementById('calc-result').innerHTML = `Derivative: $$${formattedDerivative}$$`;
        MathJax.typeset(); // Render the result with MathJax
    } catch (error) {
        document.getElementById('calc-result').innerHTML = `Error: ${error.message}`;
    }
}

// Event listener for the calculate button
document.getElementById('calc-submit').addEventListener('click', calculateDerivative);

// Initialize the game
newProblem();
startTimer();
