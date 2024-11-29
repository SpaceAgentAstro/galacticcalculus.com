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
            <li>You may view and run this game for personal, educational use.</li>
            <li>You may not modify, distribute, or create derivative works without explicit permission.</li>
            <li>Commercial use is strictly prohibited without written authorization.</li>
            <li>All contributions must be approved by the copyright holder.</li>
        </ol>
        <h4>💻 How to Run Locally</h4>  
        <ol>
            <li>Clone the repository:
                <pre><code>git clone https://github.com/yourusername/math-rockets.git</code></pre>
            </li>
            <li>Open <code>index.html</code> in your web browser.</li>
            <li>No installation or additional setup is required.</li>
        </ol>
    `;
}

// Function to close the help modal
function closeHelpModal() {
    elements.helpModal.style.display = 'none'; // Hide the modal
}

// Event listeners for help modal
elements.helpButton.addEventListener('click', showHelpModal);
elements.closeModalButton.addEventListener('click', closeHelpModal);

// Utility function to generate a random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a new problem
function newProblem() {
    let problem;

    if (gameState.level < 8) {
        problem = getBasicDiff();
    } else if (gameState.level < 15) {
        problem = getAdvancedDiff();
    } else if (gameState.level < 25) {
        problem = getChainRuleDiff();
    } else if (gameState.level < 35) {
        problem = getProductRuleDiff();
    } else if (gameState.level < 45) {
        problem = getQuotientRuleDiff();
    } else if (gameState.level < 50) {
        problem = getGradientProblem();
    } else if (gameState.level === 50) {
        problem = getMinMaxProblem();
    } else if (gameState.level < 95) {
        problem = getIntegrationProblem();
    } else if (gameState.level < 100) {
        problem = getAreaUnderCurveProblem();
    } else {
        problem = getSimpleArithmeticProblem();
    }

    // Generate the correct answer based on the problem
    const correctAnswer = problemAnswer(problem);

    // Display the problem using KaTeX
    gameState.currentProblem = { question: problem, answer: correctAnswer }; // Set the correct answer
    elements.questionDisplay.innerHTML = `\\[ ${problem} \\]`;
    renderMath();
}

// Function to generate the correct answer based on the problem
function problemAnswer(problem) {
    // Example logic for different types of problems
    if (problem.includes("x^")) {
        // Assuming it's a polynomial differentiation problem
        const parts = problem.match(/(\d+)(x\^(\d+))/);
        if (parts) {
            const coefficient = parseInt(parts[1]);
            const exponent = parseInt(parts[3]);
            return `${coefficient * exponent}x^${exponent - 1}`; // Derivative calculation
        }
    } else if (problem.includes("integrate")) {
        // Example for integration problems
        const parts = problem.match(/integrate (\d+)x\^(\d+)/);
        if (parts) {
            const coefficient = parseInt(parts[1]);
            const exponent = parseInt(parts[2]);
            const newExponent = exponent + 1;
            const newCoefficient = coefficient / newExponent;
            return `${newCoefficient}x^${newExponent}`; // Integration calculation
        }
    } else if (problem.includes("+") || problem.includes("-")) {
        // Simple arithmetic problems
        const result = eval(problem); // Caution: eval can be dangerous if input is not controlled
        return result.toString();
    } else if (problem.includes("*")) {
        // Product rule
        const parts = problem.match(/(\d+)x\^(\d+)\s*\*\s*(\d+)x\^(\d+)/);
        if (parts) {
            const coeff1 = parseInt(parts[1]);
            const exp1 = parseInt(parts[2]);
            const coeff2 = parseInt(parts[3]);
            const exp2 = parseInt(parts[4]);
            const answer = `${coeff1 * exp2}x^${exp1 + exp2 - 1} + ${coeff2 * exp1}x^${exp2 + exp1 - 1}`; // Product rule
            return answer;
        }
    } else if (problem.includes("/")) {
        // Quotient rule
        const parts = problem.match(/(\d+)x\^(\d+)\s*\/\s*(\d+)x\^(\d+)/);
        if (parts) {
            const coeff1 = parseInt(parts[1]);
            const exp1 = parseInt(parts[2]);
            const coeff2 = parseInt(parts[3]);
            const exp2 = parseInt(parts[4]);
            const answer = `(${coeff1 * exp2}x^${exp1 - 1} * ${coeff2}x^${exp2} - ${coeff1}x^${exp1} * ${coeff2 * exp1}x^${exp2 - 1}) / (${coeff2}x^${exp2})^2`; // Quotient rule
            return answer;
        }
    } else if (problem.includes("min") || problem.includes("max")) {
        // Min/Max problems
        const parts = problem.match(/find the (min|max) of (\d+)x\^(\d+)/);
        if (parts) {
            const extremum = parts[1];
            const coefficient = parseInt(parts[2]);
            const exponent = parseInt(parts[3]);
            return `To find the ${extremum}, set the derivative of ${coefficient}x^${exponent} to zero and solve for x.`; // Min/ Max calculation guidance
        }
    } else if (problem.includes("area under curve")) {
        // Area under curve problems
        const parts = problem.match(/find the area under the curve of (\d+)x\^(\d+) from (\d+) to (\d+)/);
        if (parts) {
            const coefficient = parseInt(parts[1]);
            const exponent = parseInt(parts[2]);
            const lowerLimit = parseInt(parts[3]);
            const upperLimit = parseInt(parts[4]);
            const integralValue = (coefficient / (exponent + 1)) * (Math.pow(upperLimit, exponent + 1) - Math.pow(lowerLimit, exponent + 1));
            return integralValue.toString(); // Area under curve calculation
        }
    } else if (problem.includes("gradient")) {
        // Gradient problems
        const parts = problem.match(/find the gradient of (\d+)x\^(\d+) at x=(\d+)/);
        if (parts) {
            const coefficient = parseInt(parts[1]);
            const exponent = parseInt(parts[2]);
            const xValue = parseInt(parts[3]);
            const gradient = coefficient * exponent * Math.pow(xValue, exponent - 1);
            return gradient.toString(); // Gradient calculation
        }
    }

    return "unknown";
}

// Function to compare user's answer with the correct answer
function compareAnswers(userAnswer) {
    const correctAnswer = gameState.currentProblem.answer;
    if (userAnswer.toString() === correctAnswer.toString()) {
        return "Correct!";
    } else {
        return `Incorrect. The correct answer is ${correctAnswer}.`;
    }
}

// Example usage after user submits their answer
function onUserSubmitAnswer(userAnswer) {
    const resultMessage = compareAnswers(userAnswer);
    elements.resultDisplay.innerHTML = resultMessage; // Display the result message
}
// Problem generation functions (similar to your original code)
function getBasicDiff() {
    const coefficients = [1, 2, 3, 4, 5];
    const exponent = Math.floor(Math.random() * 5) + 1; // Random exponent between 1 and 5
    const coefficient = coefficients[Math.floor(Math.random() * coefficients.length)];
    return formatPolynomial(coefficient, exponent); // Format the polynomial
}

// Other problem generation functions...

// Function to render the LaTeX using KaTeX
function renderMath() {
    try {
        renderMathInElement(elements.questionDisplay, {
            delimiters: [{ left: '\\[', right: '\\]', display: true }],
            throwOnError: false
        });
    } catch (error) {
        console.error("Error rendering math:", error);
    }
}


// Function to handle correct answers
function handleCorrectAnswer() {
    gameState.score += 10; // Increase score
    updateDisplay(); // Update the display
    newProblem(); // Generate a new problem
    checkMilestone(); // Check for milestones
}

// Function to handle incorrect answers
function handleIncorrectAnswer(correctAnswer) {
    sounds.wrong.play(); // Play wrong answer sound
    alert(`Incorrect! The correct answer is: ${correctAnswer}. Click "OK" to continue.`);
    gameState.lives--; // Decrease lives
    updateDisplay(); // Update the display
    newProblem(); // Generate a new problem
}


// Function to check for milestones
function checkMilestone() {
    if (gameState.milestoneLevels.includes(gameState.level)) {
        alert(`Congratulations! You've reached level ${gameState.level}!`); // Milestone message
        gameState.score *= 1.5; // Scale the reward
        updateDisplay(); // Update the display
    }
}

// Function to update display elements
function updateDisplay() {
    elements.score.textContent = `Score: ${gameState.score}`;
    elements.lives.textContent = `Lives: ${gameState.lives}`;
    elements.level.textContent = `Level: ${gameState.level}`;
    elements.highScore.textContent = `High Score: ${gameState.highScore}`;
}

// Function to start the timer
function startTimer() {
    gameState.timer = 40; // Reset timer
    elements.timer.textContent = gameState.timer; // Display timer
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        elements.timer.textContent = gameState.timer; // Update timer display
        if (gameState.timer <= 0) {
            endGame(); // End game if timer reaches 0
        }
    }, 1000);
}

// Function to end the game
function endGame() {
    clearInterval(gameState.timerInterval); // Clear timer
    alert(`Game Over! Your score: ${gameState.score}`);
    resetGame(); // Reset the game
}

// Function to reset the game state
function resetGame() {
    gameState.score = 0; // Reset score
    gameState.lives = 10; // Reset lives
    gameState.level = 1; // Reset level
    updateDisplay(); // Update display
    newProblem(); // Generate a new problem
    startTimer(); // Start the timer
}

// Call newProblem to generate the first problem
newProblem();

// Function to add visual elements (e.g., planets/stars)
function addVisualElement() {
    const planet = document.createElement('div');
    planet.className = 'planet'; // Add a class for styling
    elements.galaxyContainer.appendChild(planet); // Append the planet to the galaxy container
}

// Function to append value to the answer input
function appendToInput(value) {
    elements.answerInput.value += value;
    elements.answerInput.focus();
}

// Function to create a button
function createButton(container, text, onClick) {
    const button = document.createElement('button');
    button.className = 'key glowing'; // Add glowing class for visual effect
    button.textContent = text;
    button.onclick = onClick;
    container.appendChild(button);
}

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    resetGame();
    // Check if the Start Game button exists before adding the event listener
    const startGameButton = document.getElementById('startGame');
    if (startGameButton) {
        startGameButton.addEventListener('click', function() {
            startBackgroundMusic(); // Start background music
            resetGame(); // Reset the game state
        });
    }

    // Example of how to handle user input submission
    const submitButton = document.getElementById('submitAnswer'); // Assuming there's a submit button
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const userAnswer = elements.answerInput.value; // Get user input
            compareAnswers(userAnswer); // Compare user's answer with the correct answer
            elements.answerInput.value = ''; // Clear the input field after submission
        });
    }
});