// Game state variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let lives = 10;
let level = 1;
let timer = 20; // Timer set to 20 seconds
let timerInterval;
let currentProblem; // Current problem globally declared

// Sound effects
const wrongSound = new Audio('assets/sounds/wrong-answer.mp3');
const correctSound = new Audio('assets/sounds/correct-answer.mp3');
const tickSound = new Audio('assets/sounds/tick-sound.mp3');
const bgMusic = new Audio('assets/sounds/background-music.mp3');

wrongSound.volume = 0.5; // Set volume to 50%
correctSound.volume = 0.5; // Set volume to 50%

// DOM Elements
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const timerElement = document.getElementById('timer');
const questionElement = document.getElementById('equation');

// Initialize high score display
highScoreElement.textContent = `High Score: ${highScore}`;

// Function to create a new problem
function newProblem() {
    currentProblem = generateProblem(); // Generate a new problem
    questionElement.innerHTML = currentProblem.question; // Display the question
    // Render the math using KaTeX
    renderMath();
}

function renderMath() {
    // Use KaTeX to render the math
    const options = {
        throwOnError: false
    };
    katex.render(questionElement.innerHTML, questionElement, options);
}
// Function to generate a problem based on the current level
function generateProblem() {
    const problems = level <= 25 ? getDifferentiationProblems() : getIntegrationProblems();
    return problems[Math.floor(Math.random() * problems.length)];
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
            { question: "\\frac{d}{dx}(e^{2x})", answer: "2e^{2x}" },
            { question: "\\frac{d}{dx}(e^{-x})", answer: "-e^{-x}" },
            { question: "\\frac{d}{dx}(x^{1/2})", answer: "1/(2\\sqrt{x })" },
            { question: "\\frac{d}{dx}(x^{1/3})", answer: "1/(3x^{2/3})" },
            { question: "\\frac{d}{dx}(1/x)", answer: "- 1/x^2" },
            { question: "\\frac{d}{dx}(1/x^2)", answer: "-\\frac{2}{x^3}" },
            { question: "\\frac{d}{dx}(\\sqrt{x})", answer: "\\frac{1}{2\\sqrt{x}}" },
            { question: "\\frac{d}{dx}(3\\sqrt{x})", answer: "\\frac{3}{2\\sqrt{x}}" },
            { question: "\\frac{d}{dx}(\\sin(x))", answer: "\\cos(x)" },
            { question: "\\frac{d}{dx}(\\cos(x))", answer: "-\\sin(x)" },
            { question: "\\frac{d}{dx}(x^{-1})", answer: "-\\frac{1}{x^2}" },
            { question: "\\frac{d}{dx}(x^{-2})", answer: "-\\frac{2}{x^3}" },
            { question: "\\frac{d}{dx}((x+1)^2)", answer: "2(x+1)" },
            { question: "\\frac{d}{dx}((x-1)^3)", answer: "3(x-1)^2" }
        ];
    }
    
    // Function to get integration problems
    function getIntegrationProblems() {
        return [
            { question: "\\int 2x \\, dx", answer: "x^2 + C" },
            { question: "\\int 1 \\, dx", answer: "x + C" },
            { question: "\\int x^2 \\, dx", answer: "\\frac{x^3}{3} + C" },
            { question: "\\int x^3 \\, dx", answer: "\\frac{x^4}{4} + C" },
            { question: "\\int x^4 \\, dx", answer: "\\frac{x^5}{5} + C" },
            { question: "\\int 3x^2 \\, dx", answer: "x^3 + C" },
            { question: "\\int 4x^3 \\, dx", answer: "x^4 + C" },
            { question: "\\int 5x^4 \\, dx", answer: "x^5 + C" },
            { question: "\\int 6x \\, dx", answer: "3x^2 + C" },
            { question: "\\int 7x^2 \\, dx", answer: "\\frac{7x^3}{3} + C" },
            { question: "\\int 8x^3 \\, dx", answer: "2x^4 + C" },
            { question: "\\int 9x^4 \\, dx", answer: "\\frac{9x^5}{5} + C" },
            { question: "\\int 10x^5 \\, dx", answer: "\\frac{5x^6}{6} + C" },
            { question: "\\int x^5 \\, dx", answer: "\\frac{x^6}{6} + C" },
            { question: "\\int x^6 \\, dx", answer: "\\frac{x^7}{7} + C" },
            { question: "\\int e^x \\, dx", answer: "e^x + C" },
            { question: "\\int e^{2x} \\, dx", answer: "\\frac{e^{2x}}{2} + C" },
            { question: "\\int e^{-x} \\, dx", answer: "-e^{-x} + C" },
            { question: "\\int \\frac{1}{x} \\, dx", answer: "ln|x| + C" },
            { question: "\\int \\frac{1}{x^2} \\, dx", answer: "-\\frac{1}{x} + C" },
            { question: "\\int \\sqrt{x} \\, dx", answer: "\\frac{2}{3}x^{3/2} + C" },
            { question: "\\int \\frac{1}{\\sqrt{x}} \\, dx", answer: "2\\sqrt{x} + C" },
            { question: "\\int \\sin(x) \\, dx", answer: "-\\cos(x) + C" },
            { question: "\\int \\cos(x) \\, dx", answer: "\\sin(x) + C" },
            { question: "\\int x^{-3/2} \\, dx", answer: "-\\frac{2}{ \sqrt{x}} + C" },
            { question: "\\int (x+1)^2 \\, dx", answer: "\\frac{(x+1)^3}{3} + C" },
            { question: "\\int (x-1)^3 \\, dx", answer: "\\frac{(x-1)^4}{4} + C" },
            { question: "\\int \\frac{1}{x+1} \\, dx", answer: "ln|x+1| + C" }
        ];
    }
    

// Function to check the user's answer
function checkAnswer(userAnswer, correctAnswer) {
    userAnswer = userAnswer.toLowerCase().replace(/\s/g, '');
    correctAnswer = correctAnswer.toLowerCase();

    // Check if the answer is correct, accounting for variations
    if (userAnswer === correctAnswer || 
        (correctAnswer.includes('+c') && 
        [correctAnswer.replace('+c', '+C'), correctAnswer.replace('+c', '+ c')].includes(userAnswer)) ||
        (correctAnswer.includes('c') && userAnswer === correctAnswer.replace('c', 'C'))) {
        
        // Increase timer by 5 seconds
        timer += 5;
        timerElement.textContent = timer; // Update the displayed timer

        // Display the correct answer in the answer box using KaTeX
        answerInput.value = correctAnswer; // Display the correct answer
        renderMath(); // Render the answer using KaTeX

        return true; // Answer is correct
    }
    return false; // Answer is incorrect
}

// Debounce function to limit the rate of function execution
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Function to set up the keyboard
function setupKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = ''; // Clear previous buttons

    // Create number buttons 0-9
    for (let i = 0; i <= 9; i++) {
        createButton(keyboard, i.toString(), () => appendToInput(i));
    }

    // Common math symbols and functions
    const symbols = ['x', '+', '-', '/', '^', '(', ')', '√', 'C', 'space', 'backspace'];
    symbols.forEach(symbol => {
        createButton(keyboard, symbol === 'space' ? 'Space' : symbol, () => handleSymbolClick(symbol));
    });
}

// Function to create a button
function createButton(container, text, onClick) {
    const button = document.createElement('button');
    button.className = 'key';
    button.textContent = text;
    button.onclick = onClick;
    container.appendChild(button);
}

// Function to handle symbol button clicks
function handleSymbolClick(symbol) {
    switch (symbol) {
        case ' space':
            appendToInput(' ');
            break;
        case 'backspace':
            answerInput.value = answerInput.value.slice(0, -1);
            break;
        case 'C':
            answerInput.value = '';
            break;
        default:
            appendToInput(symbol);
            break;
    }
}

// Function to append value to the answer input
function appendToInput(value) {
    answerInput.value += value;
    answerInput.focus();
}

// Function to start the timer
function startTimer() {
    timer = 20; // Reset timer to 20 seconds
    timerElement.textContent = timer;
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

// Function to end the game
function endGame() {
    clearInterval(timerInterval); // Clear the timer interval
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'block'; // Show the game over modal
    document.getElementById('finalScore').textContent = `Your score: ${score}`;
    
    // Update high score if necessary
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = `High Score: ${highScore}`;
    }

    // Reset game state
    resetGame();
}

// Function to reset the game state
function resetGame() {
    score = 0;
    lives = 10;
    level = 1;
    updateDisplay();
    newProblem();
    startTimer();
}

// Function to update display elements
function updateDisplay() {
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;
    levelElement.textContent = `Level: ${level}`;
}

// When checking the answer in the submit button event listener
submitButton.addEventListener('click', debounce(() => {
    const userAnswer = answerInput.value;
    const correctAnswer = currentProblem.answer;

    if (checkAnswer(userAnswer, correctAnswer)) {
        console.log("Correct sound should play");
        correctSound.play().catch(error => console.error("Error playing correct sound:", error));
        score += 10;
        updateDisplay();
        newProblem();
    } else {
        console.log("Wrong sound should play");
        wrongSound.play().catch(error => console.error("Error playing wrong sound:", error));
        lives--;
        livesElement.textContent = `Lives: ${lives}`;
        if (lives <= 0) {
            endGame();
        }
    }
    answerInput.value = ''; // Clear input after submission
}, 300));

// Initialize the game
setupKeyboard();
resetGame();
// End of programs