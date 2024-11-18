// Game state variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let lives = 10;
let level = 1;
let timer = 40; // Timer set to 40 seconds
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
    renderMath(); // Call renderMath to render the question
}

// Function to render math in the formatted answer display
function renderFormattedAnswer() {
    const formattedAnswerElement = document.getElementById('formattedAnswer');
    const userInput = answerInput.value; // Get the current value of the input
    formattedAnswerElement.innerHTML = userInput; // Set the innerHTML to user input
    renderMath(); // Render the input using KaTeX
}
// Function to show the help modal
function showHelpModal() {
    const helpModal = document.getElementById('helpModal');
    const helpContent = document.getElementById('helpContent');

    // Full README content
    const readmeContent = `
        <h3>Math Rockets Game</h3>
        <h4>Overview</h4>
        <p>Math Rockets is a fun and interactive game designed to help students practice differentiation and integration through an engaging space-themed interface. Players solve calculus problems to earn points, improve their skills, and compete for high scores.</p>

        <h4>Features</h4>
        <ul>
            <li>Interactive Gameplay: Solve differentiation and integration problems.</li>
            <li>Virtual Keyboard: Use a virtual keyboard to input answers easily.</li>
            <li>Dynamic Problem Generation: Problems are generated based on the player's level.</li>
            <li>Timer and Lives: Manage your time and lives as you progress through the game.</li>
            <li>Sound Effects: Enjoy engaging sound effects for correct and incorrect answers.</li>
            <li>High Score Tracking: Keep track of your high scores and compete against yourself.</li>
        </ul>

        <h4>Copyright Notice</h4>
        <p>© 2024 Mouad Maamma. All Rights Reserved.</p>
        <p>This project is protected by copyright law. While the project is open source under the MIT License, any modifications, distributions, or commercial use require explicit written permission from the copyright holder.</p>

        <h4>Terms of Use</h4>
        <ol>
            <li>You may view and run this game for personal, educational use.</li>
            <li>You may not modify, distribute, or create derivative works without explicit permission.</li>
            <li>Commercial use is strictly prohibited without written authorization.</li>
            <li>All contributions must be approved by the copyright holder.</li>
        </ol>

        <h4>How to Run Locally</h4>
        <ol>
            <li>Clone the repository:
                <pre><code>git clone https://github.com/yourusername/math-rockets.git</code></pre>
            </li>
            <li>Open <code>index.html</code> in your web browser.</li>
            <li>No installation or additional setup is required.</li>
        </ol>

        <h4>Controls</h4>
        <ul>
            <li>Input Answers: Use the virtual keyboard to input your answers or type directly into the input field.</li>
            <li>Submit Answer: Click the "Submit" button or press Enter to check your answer.</li>
            <li>Backspace: Use the backspace key on the virtual keyboard to delete the last character.</li>
            <li>Clear: Use the "C" button on the virtual keyboard to clear the input field.</li>
        </ul>

        <h4>Contact</h4>
        <p>For permissions and inquiries: <br>Email: <a href="mailto:mouadmaamma54@gmail.com">mouadmaamma54@gmail.com</a></p>
        <p>GitHub: <a href="https://github.com/SpaceAgentAstro">SpaceAgentAstro</a></p>

        <h4>License</h4>
        <p>This project is licensed under a modified MIT License with additional restrictions. See the LICENSE file for details.</p>

        <h4>Legal Notice</h4>
        <p>Unauthorized modification, distribution, or use of this code may result in legal action. All rights reserved.</p>
    `;

    helpContent.innerHTML = readmeContent; // Set the innerHTML to the README content
    helpModal.style.display = 'block'; // Show the modal
}

// Function to close the help modal
function closeHelpModal() {
    const helpModal = document.getElementById('helpModal');
    helpModal.style.display = 'none'; // Hide the modal
}

// Event listener for the help button
document.getElementById('helpButton').addEventListener('click', showHelpModal);

// Event listener for the close modal button
document.querySelector('.close-modal').addEventListener('click', closeHelpModal);

// Optional: Close the modal when clicking outside of it
window.addEventListener('click', function(event) {
    const helpModal = document.getElementById('helpModal');
    if (event.target === helpModal) {
        closeHelpModal();
    }
});

// Add an event listener to the answer input to format the input on every keystroke
answerInput.addEventListener('input', debounce(renderFormattedAnswer, 300));

// Other function definitions...

// Function to render math using KaTeX
function renderMath() {
    const options = {
        throwOnError: false
    };
    const formattedAnswerElement = document.getElementById('formattedAnswer');
    katex.render(formattedAnswerElement.innerHTML, formattedAnswerElement, options);
}

// Call this when the document is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    renderMathInElement(document.body, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false},
        ],
        throwOnError: false
    });
    
    // Optional: You can also call your renderMath function here if needed
    // renderMath();
});

// Other initialization code...
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
        { question: "\\frac{d}{dx}(x^{1/2})", answer: "\\frac{1}{2\\sqrt{x}}" },
        { question: "\\frac{d}{dx}(x^{1/3})", answer: "\\frac{1}{3x^{2/3}}" },
        { question: "\\frac{d}{dx}(x^{-1})", answer: "-\\frac{1}{x^2}" },
        { question: "\\frac{d}{dx}(x^{-2})", answer: "-\\frac{2}{x^3}" },
        { question: "\\frac{d}{dx}(x^4 + 3x^2 + 5)", answer: "4x^3 + 6x" },
        { question: "\\frac{d}{dx}(x^5 - 4x + 7)", answer: "5x^4 - 4" },
        { question: "\\frac{d}{dx}(x^{1/4})", answer: "\\frac{1}{4}x^{-3/4}" },
        { question: "\\frac{d}{dx}(2x^3 + x^2 + x)", answer: "6x^2 + 2x + 1" },
        { question: "\\frac{d}{dx}(3x^4 + 2x^3 - x^2)", answer: "12x^3 + 6x^2 - 2x" },
        { question: "\\frac{d}{dx}(x^{1/5})", answer: "\\frac{1}{5}x^{-4/5}" },
        { question: "\\frac{d}{dx}(7x^6 - 3x^2 + 2x)", answer: "42x^5 - 6x + 2" },
        { question: "\\frac{d}{dx}(x^8 + 4x^3 - 2)", answer: "8x^7 + 12x^2" },
        { question: "\\frac{d}{dx}(x^{10} - 5x^5 + 3)", answer: "10x^9 - 25x^4" },
        { question: "\\frac{d}{dx}(x^2 + 2x + 1)", answer: "2x + 2" },
        { question: "\\frac{d}{dx}(x^3 - 3x^2 + 3x - 1)", answer: "3x^2 - 6x + 3" }
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
            { question: "\\int (x^2 + 3) \\, dx", answer: "\\frac{x^3}{3} + 3x + C" },
            { question: "\\int (4x^3 - 2x) \\, dx", answer: "x^4 - x^2 + C" },
            { question: "\\int (x^4 + 2x^2 + 1) \\, dx", answer: "\\frac{x^5}{5} + \frac{2x^3}{3} + x + C" },
            { question: "\\int (5x^2 - 3) \\, dx", answer: "\\frac{5x^3}{3} - 3x + C" },
            { question: "\\int (x^3 + 4x) \\, dx", answer: "\\frac{x^4}{4} + 2x^2 + C" },
            { question: "\\int (2x^5 + x^2) \\, dx", answer: "\\frac{2x^6}{6} + \frac{x^3}{3} + C" },
            { question: "\\int (x^2 - 5) \\, dx", answer: "\\frac{x^3}{3} - 5x + C" },
            { question: "\\int (3x^4 + 2x^3) \\, dx", answer: "\\frac{3x^5}{5} + \frac{2x^4}{4} + C" }
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
    timer = 40; // Reset timer to 20 seconds
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
// Function to end the game
function endGame() {
    clearInterval(timerInterval); // Clear the timer interval

    // Populate the modal with the game over information
    document.getElementById('finalScore').textContent = `Your score: ${score}`;
    document.getElementById('finalHighScore').textContent = `High Score: ${highScore}`;
    document.getElementById('finalLives').textContent = `Lives Remaining: ${lives}`;
    document.getElementById('finalLevel').textContent = `Level Reached: ${level}`;

    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'block'; // Show the game over modal

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

// After updating the content, call renderMath
submitButton.addEventListener('click', debounce(() => {
    const userAnswer = answerInput.value;
    const correctAnswer = currentProblem.answer;

    if (checkAnswer(userAnswer, correctAnswer)) {
        correctSound.play().catch(error => console.error("Error playing correct sound:", error));
        score += 10;
        updateDisplay();
        newProblem(); // Generate a new problem
        renderMath(); // Call renderMath to render the new problem
    } else {
        wrongSound.play().catch(error => console.error("Error playing wrong sound:", error));
        lives--;
        livesElement.textContent = `Lives: ${lives}`;
        if (lives <= 0) {
            endGame();
        }
    }
    answerInput.value = ''; // Clear input after submission
}, 300));

// Close modal functionality
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('gameOverModal').style.display = 'none';
});



// Initialize the game
setupKeyboard();
resetGame();
// End of programs