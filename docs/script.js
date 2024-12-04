// Centralized game state object
const gameState = {
    score: 0,
    highScore: localStorage.getItem('highScore') || 0,
    lives: 10,
    level: 1,
    timer: 40, // Timer set to 40 seconds
    timerInterval: null,
    currentProblem: null,
    milestoneLevels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] // Example milestone levels
};

// DOM Elements
const elements = {
    score: document.getElementById('score'),
    highScore: document.getElementById('highScore'),
    lives: document.getElementById('lives'),
    level: document.getElementById('level'),
    answerInput: document.getElementById('answer'),
    submitButton: document.getElementById('submit'),
    timer: document.getElementById('timer'),
    questionDisplay: document.getElementById('equation'), // Reference to the #equation element
    progressBar: document.getElementById('progress-bar'),
    galaxyContainer: document.getElementById('galaxy-container'),
    animationArea: document.getElementById('animationArea'), // Area for animations
    helpModal: document.getElementById('helpModal'),
    helpContent: document.getElementById('helpContent'),
    helpButton: document.getElementById('helpButton'),
    resultDisplay: document.getElementById('resultDisplay'),
    closeModalButton: document.querySelector('.close-modal') // Assuming you have this element
};

// Sound effects
const sounds = {
    wrong: new Audio('assets/sounds/wrong-answer.mp3'),
    correct: new Audio('assets/sounds/correct-answer.mp3'),
    tick: new Audio('assets/sounds/tick-sound.mp3'),
    bgMusic: new Audio('assets/sounds/background-music.mp3'),
};

// Set sound volumes
for (let sound in sounds) {
    sounds[sound].volume = sound === 'bgMusic' ? 0.5 : 1; // Set background music to 50% volume
}

// Initialize high score display
elements.highScore.textContent = `High Score: ${gameState.highScore}`;

// Add event listener for the Enter key
elements.answerInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkAnswer(gameState.currentProblem.answer); // Check the answer
    }
});

// Add event listener for the submit button
elements.submitButton.addEventListener('click', function() {
    checkAnswer(gameState.currentProblem.answer); // Check the answer
});

// Function to start background music
function startBackgroundMusic() {
    sounds.bgMusic.loop = true; // Loop the background music
    sounds.bgMusic.play().catch(error => {
        console.error("Error playing background music:", error);
        alert("Unable to play background music. Please check your audio settings.");
    });
}

// Function to show the help modal
function showHelpModal() {
    elements.helpContent.innerHTML = generateHelpContent(); // Set the innerHTML to the README content
    renderMath(); // Render the math using KaTeX
    elements.helpModal.style.display = 'block'; // Show the modal
}

// Function to generate help content
function generateHelpContent() {
    return `
        <h3>🚀 Galactic Calculus</h3>
        <h4>🕹️ Controls</h4>
        <ul>
            <li><strong>Input Answers:</strong> Use the virtual keyboard to input your answers or type directly into the input field.</li>
            <li><strong>Submit Answer:</strong> Click the "Submit" button or press Enter to check your answer.</li>
            <li><strong>Backspace:</strong> Use the backspace key on the virtual keyboard to delete the last character.</li>
            <li><strong>Clear:</strong> Use the "C" button on the virtual keyboard to clear the input field.</li>
        </ul>
        <h4>✨ Gameplay Tips</h4>
        <p>
            Welcome to <strong>Galactic Calculus</strong>! This fun and interactive game is designed to help you practice 
            differentiation and integration through engaging space-themed challenges. Solve calculus problems to earn points, 
            enhance your skills, and compete for high scores!
        </p>
        <h4>📋 Terms of Use</h4>
        <ol>
            <li>You may view and run this game for personal, educational purposes.</li>
            <li>Do not redistribute or modify the code without permission.</li>
            <li>Enjoy learning and have fun!</li>
        </ol>
    `;
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
        { question: "\\frac{d}{dx}((x +1)^2)", answer: "2(x+1)" },
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

// Function to select a new problem
function newProblem() {
    const differentiationProblems = getDifferentiationProblems();
    const integrationProblems = getIntegrationProblems();
    
    // Randomly select a problem type (differentiation or integration)
    const isDifferentiation = Math.random() < 0.5; // 50% chance for differentiation
    const problems = isDifferentiation ? differentiationProblems : integrationProblems;

    // Randomly select a problem from the chosen type
    const randomIndex = Math.floor(Math.random() * problems.length);
    gameState.currentProblem = problems[randomIndex];

    // Display the selected problem
    elements.questionDisplay.innerHTML = gameState.currentProblem.question;
}

// Function to check the answer
function checkAnswer(answer) {
    const userAnswer = elements.answerInput.value.trim();
    if (userAnswer === gameState.currentProblem.answer) {
        gameState.score += 10; // Increment score
        gameState.timer += 7; // Increase timer by 7 seconds
        sounds.correct.play(); // Play correct sound
        elements.resultDisplay.textContent = "Correct!";
    } else {
        gameState.lives -= 1; // Decrement lives
        sounds.wrong.play(); // Play wrong sound
        alert(`Wrong! The correct answer is: ${gameState.currentProblem.answer}`);
        elements.resultDisplay.textContent = "Wrong!";
    }

    // Update the score and lives display
    elements.score.textContent = `Score: ${gameState.score}`;
    elements.lives.textContent = `Lives: ${gameState.lives}`;
    elements.timer.textContent = `Time: ${gameState.timer}`; // Update timer display

    // Check for game over
    if (gameState.lives <= 0) {
        endGame();
    } else {
        newProblem(); // Load a new problem
        elements.answerInput.value = ''; // Clear the input
    }
}

// Function to end the game
function endGame() {
    clearInterval(gameState.timerInterval); // Stop the timer
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score; // Update high score
        localStorage.setItem('highScore', gameState.highScore); // Save high score
    }
    alert(`Game Over! Your score: ${gameState.score}. High Score: ${gameState.highScore}`);
    resetGame(); // Reset the game state
}

// Function to reset the game state
function resetGame() {
    gameState.score = 0;
    gameState.lives = 10;
    gameState.level = 1;
    gameState.timer = 40; // Reset timer to 40 seconds
    elements.score.textContent = `Score: ${gameState.score}`;
    elements.lives.textContent = `Lives: ${gameState.lives}`;
    elements.timer.textContent = `Time: ${gameState.timer}`; // Reset timer display
    newProblem(); // Load the first problem
}

// Function to start the timer
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        elements.timer.textContent = `Time: ${gameState.timer}`;
        if (gameState.timer <= 0) {
            endGame(); // End game if timer runs out
        }
    }, 1000);
}

// Start the game
startBackgroundMusic(); // Start background music
startTimer(); // Start the timer
newProblem(); // Load the first problem