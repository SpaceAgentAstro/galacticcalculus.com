// Game state variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let lives = 10;
let level = 1;
let timer = 40; // Timer set to 40 seconds
let timerInterval;
let currentProblem; // Current problem globally declared

// Sound effects
const sounds = {
    wrong: new Audio('assets/sounds/wrong-answer.mp3'),
    correct: new Audio('assets/sounds/correct-answer.mp3'),
    tick: new Audio('assets/sounds/tick-sound.mp3'),
    bgMusic: new Audio('assets/sounds/background-music.mp3')
};

// Set sound volumes
for (let sound in sounds) {
    sounds[sound].volume = sound === 'bgMusic' ? 0.5 : 1; // Set background music to 50% volume
}

// DOM Elements
const elements = {
    score: document.getElementById('score'),
    highScore: document.getElementById('highScore'),
    lives: document.getElementById('lives'),
    level: document.getElementById('level'),
    answerInput: document.getElementById('answer'),
    submitButton: document.getElementById('submit'),
    timer: document.getElementById('timer'),
    question: document.getElementById('equation'),
    progressBar: document.getElementById('progress-bar'),
    galaxyContainer: document.getElementById('galaxy-container'),
    animationArea: document.getElementById('animationArea') // Area for animations
};

// Initialize high score display
elements.highScore.textContent = `High Score: ${highScore}`;


// Function to generate a random differentiation problem based on level
function generateRandomDifferentiationProblem() {
    const currentLevel = level ; // Assume currentLevel is a global variable tracking the player's level

    const functions = [
        { type: 'polynomial', coeff: Math.floor(Math.random() * 10) + 1, power: Math.floor(Math.random() * 5) + 1 },
        { type: 'sin', coeff: Math.floor(Math.random() * 10) + 1 },
        { type: 'cos', coeff: Math.floor(Math.random() * 10) + 1 },
        { type: 'tan', coeff: Math.floor(Math.random() * 10) + 1 },
        { type: 'exp', coeff: Math.floor(Math.random() * 10) + 1 },
    ];

    // Add negative and fractional exponents for levels 8 and above
    if (level >= 8) {
        functions.push(
            { type: 'negative', coeff: Math.floor(Math.random() * 10) + 1, power: -Math.floor(Math.random() * 5) - 1 },
            { type: 'fractional', coeff: Math.floor(Math.random() * 10) + 1, power: Math.random() < 0.5 ? 1/2 : 1/3 }
        );
    }

    // Add chain rule problems for levels 15 and above
    if (level >= 15) {
        functions.push(
            { type: 'chain', coeff: Math.floor(Math.random() * 10) + 1 }
        );
    }

    // Add product rule problems for levels 25 and above
    if (level >= 25) {
        functions.push(
            { type: 'product', coeff1: Math.floor(Math.random() * 10) + 1, power1: Math.floor(Math.random() * 5) + 1, coeff2: Math.floor(Math.random() * 10) + 1, power2: Math.floor(Math.random() * 5) + 1 }
        );
    }

    // Add quotient rule problems for levels 35 and above
    if (level >= 35) {
        functions.push(
            { type: 'quotient', coeff1: Math.floor(Math.random() * 10) + 1, power1: Math.floor(Math.random() * 5) + 1, coeff2: Math.floor(Math.random() * 10) + 1, power2: Math.floor(Math.random() * 5) + 1 }
        );
    }

    // Add gradient problems for levels 45-49
    if (level >= 45 && level <= 49) {
        functions.push(
            { type: 'gradient', coeff: Math.floor(Math.random() * 10) + 1, power: Math.floor(Math.random() * 5) + 1 }
        );
    }

    // Add minima/maxima problems for level 50
    if (level === 50) {
        functions.push(
            { type: 'minima', coeff: Math.floor(Math.random() * 10) + 1, power: Math.floor(Math.random() * 5) + 1 }
        );
    }

    // Add area under curve problems for levels 95-99
    if (level >= 95 && level <= 99) {
        functions.push(
            { type: 'area', coeff: Math.floor(Math.random() * 10) + 1, power: Math.floor(Math.random() * 5) + 1 }
        );
    }

    // Add a simple question for level 100
    if (level === 100) {
        return { question: "What is 1 + 1?", answer: "2" }; // Simple question for level 100
    }

    const chosenFunction = functions[Math.floor(Math.random() * functions.length)];
    let question, answer;

    switch (chosenFunction.type) {
        case 'polynomial':
            question = `\\frac{d}{dx}(${chosenFunction.coeff}x^${chosenFunction.power})`;
            answer = `${chosenFunction.coeff * chosenFunction.power}x^${chosenFunction.power - 1}`;
            break;
        case 'sin':
            question = `\\frac{d}{dx}(sin(${chosenFunction.coeff}x))`;
            answer = `${chosenFunction.coeff}cos(${chosenFunction.coeff}x)`;
            break;
        case 'cos':
            question = `\\frac{d}{dx}(cos(${chosenFunction.coeff}x))`;
            answer = `-${chosenFunction.coeff}sin(${chosenFunction.coeff}x)`;
            break;
        case 'tan':
            question = `\\frac{d}{dx}(tan(${chosenFunction.coeff}x))`;
            answer = `${chosenFunction.coeff}sec^2(${chosenFunction.coeff}x)`;
            break;
        case 'exp':
            question = `\\frac{d}{dx}(e^{${chosenFunction.coeff}x})`;
            answer = `${chosenFunction.coeff}e^{${chosenFunction.coeff}x}`;
            break;
        case 'negative':
            question = `\\frac{d}{dx}(${chosenFunction.coeff}x^${chosenFunction.power})`;
            answer = `${chosenFunction.coeff * chosenFunction.power}x^{${chosenFunction.power - 1}}`;
            break;
        case 'fractional':
            question = `\\frac{d}{dx}(${chosenFunction.coeff}x^{${chosenFunction.power}})`;
            answer = `${chosenFunction.coeff * (1 / chosenFunction.power)}x^{${chosenFunction.power - 1}}`;
            break;
        case 'chain':
            question = `\\frac{d}{dx}(f(${chosenFunction.coeff}x))`; // Placeholder for a chain rule problem
            answer = `f'(${chosenFunction.coeff}x) * ${chosenFunction.coeff}`; // Placeholder for the answer
            break;
        case 'product':
            question = `\\frac{d}{dx}(${chosenFunction.coeff1}x^${chosenFunction.power1} * ${chosenFunction.coeff2}x^${chosenFunction.power2})`;
            answer = `${chosenFunction.coeff1 * chosenFunction.power1}x^${chosenFunction.power1 - 1} * ${chosenFunction.coeff2}x^${chosenFunction.power2} + ${chosenFunction.coeff1}x^${chosenFunction.power1} * ${chosenFunction.coeff2 * chosenFunction.power2}x^${chosenFunction.power2 - 1}`;
            break;
        case 'quotient':
            question = `\\frac{d}{dx}(\\frac{${chosenFunction.coeff1}x^${chosenFunction.power1}}{${chosenFunction.coeff2}x^${chosenFunction.power2}})`;
            answer = `\\frac{(${chosenFunction.coeff1 * chosenFunction.power1}x^${chosenFunction.power1 - 1} * ${chosenFunction.coeff2}x^${chosenFunction.power2} - ${chosenFunction.coeff1}x^${chosenFunction.power1} * ${chosenFunction.coeff2 * chosenFunction.power2}x^${chosenFunction.power2 - 1})}{(${chosenFunction.coeff2}x^${chosenFunction.power2})^2}`;
            break;
        case 'gradient':
            question = `Find the gradient of ${chosenFunction.coeff}x^${chosenFunction.power} at a point x = 1`;
            answer = `${chosenFunction.coeff * chosenFunction.power} * 1^${chosenFunction.power - 1}`; // Gradient at x = 1
            break;
        case 'minima':
            question = `Find the minima of ${chosenFunction.coeff}x^${chosenFunction.power}`; // Placeholder for minima problem
            answer = `Minima occurs at x = ...`; // Placeholder for the answer
            break;
        case 'area':
            question = `Find the area under the curve of ${chosenFunction.coeff}x^${chosenFunction.power} from x = 0 to x = 1`;
            answer = `Area = \\int_0^1 ${chosenFunction.coeff}x^${chosenFunction.power} dx`; // Placeholder for area under curve
            break;
    }

    return { question, answer }; // Return the generated question and answer
}

// Function to handle timer adjustments based on level
function adjustTimer() {
    let additionalTime = 0;

    if (currentLevel <= 20) {
        additionalTime = 60; // 60 seconds for levels 1-20
    } else if (currentLevel <= 50) {
        additionalTime = 120; // 120 seconds for levels 21-50
    } else if (currentLevel <= 95) {
        additionalTime = 60; // 60 seconds for levels 51-95
    } else if (currentLevel <= 100) {
        additionalTime = 120; // 120 seconds for levels 96-100
    }

    timer += additionalTime; // Increase the timer by the additional time
}

// Function to create a new problem
function newProblem() {
    const problems = generateRandomDifferentiationProblem(); // Fix this line
    currentProblem = problems; // Select the generated problem
    elements.question.innerHTML = currentProblem.question; // Set the question in the element
    renderMath(); // Call renderMath to render the question using KaTeX
}


// Function to render math in the formatted answer display
function renderMath() {
    const options = { throwOnError: false };
    katex.render(elements.question.innerHTML, elements.question, options);
}

// Function to start background music
function startBackgroundMusic() {
    sounds.bgMusic.loop = true; // Loop the background music
    sounds.bgMusic.play().catch(error => console.error("Error playing background music:", error));
}

// Function to show the help modal
function showHelpModal() {
    const helpModal = document.getElementById('helpModal');
    const helpContent = document.getElementById('helpContent');
    helpContent.innerHTML = generateHelpContent(); // Set the innerHTML to the README content
    renderMath(); // Render the math using KaTeX
    helpModal.style.display = 'block'; // Show the modal
}

// Function to generate help content
function generateHelpContent() {
    return `
        <h3>🚀 Galactic Calculus</h3>

        <h4>🌌 Overview</h4>
        <p>
            Welcome to <strong>Galactic Calculus</strong>! This fun and interactive game is designed to help students practice 
            differentiation and integration through an engaging space-themed interface. Players will solve calculus problems 
            to earn points, enhance their skills, and compete for high scores in a cosmic adventure!
        </p>
        
        <h4>✨ Features</h4>
        <ul>
            <li><strong>Interactive Gameplay:</strong> Solve differentiation and integration problems in an immersive environment.</li>
            <li><strong>Virtual Keyboard:</strong> Easily input answers using a user-friendly virtual keyboard.</li>
            <li><strong>Dynamic Problem Generation:</strong> Problems are tailored based on your current level, ensuring a personalized experience.</li>
            <li><strong>Timer and Lives:</strong> Manage your time and lives as you progress through increasingly challenging levels.</li>
            <li><strong>Sound Effects:</strong> Enjoy engaging audio feedback for correct and incorrect answers to enhance your gaming experience.</li>
            <li><strong>High Score Tracking:</strong> Keep track of your high scores and challenge yourself to improve!</li>
        </ul>
        
        <h4>📜 Copyright Notice</h4>
        <p>© 2024 Mouad Maamma. All Rights Reserved.</p>
        <p>This project is protected by copyright law. While the project is open source under the MIT License, any modifications, distributions, or commercial use require explicit written permission from the copyright holder.</p>
        
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
        
        <h4>🕹️ Controls</h4>
        <ul>
            <li><strong>Input Answers:</strong> Use the virtual keyboard to input your answers or type directly into the input field.</li>
            <li><strong>Submit Answer:</strong> Click the "Submit" button or press Enter to check your answer.</li>
            <li><strong>Backspace:</strong> Use the backspace key on the virtual keyboard to delete the last character.</li>
            <li><strong>Clear:</strong> Use the "C" button on the virtual keyboard to clear the input field.</li>
        </ul>
        
        <h4>📞 Contact</h4>
        <p>For permissions and inquiries: <br>
            Email: <a href="mailto:mouadmaamma54@gmail.com">mouadmaamma54@gmail.com</a>
        </p>
        <p>GitHub: <a href="https://github.com/SpaceAgentAstro">SpaceAgentAstro</a></p>
        
        <h4>📄 License</h4>
        <p>This project is licensed under a modified MIT License with additional restrictions. See the LICENSE file for details.</p>
        
        <h4>⚖️ Legal Notice</h4>
        <p>Unauthorized modification, distribution, or use of this code may result in legal action. All rights reserved.</p>
    `;
}

// Function to close the help modal
function closeHelpModal() {
    document.getElementById('helpModal').style.display = 'none'; // Hide the modal
}

// Event listeners
document.getElementById('helpButton').addEventListener('click', showHelpModal);
document.querySelector('.close-modal').addEventListener('click', closeHelpModal);



// Function to check the user's answer
function checkAnswer(userAnswer) {
    // Normalize user input
    userAnswer = userAnswer.toLowerCase().replace(/\s/g, ''); // Normalize input by making it lowercase and removing spaces
    const correctAnswer = currentProblem.answer.toLowerCase(); // Normalize the correct answer

    // Handle variations for constants (e.g., 'c' vs 'C')
    const normalizedCorrectAnswer = correctAnswer.replace(/c/g, 'C'); // Normalize 'c' to 'C'

    // Check if the answer is correct, including variations for constants
    if (userAnswer === normalizedCorrectAnswer || 
        (correctAnswer.includes('+c') && 
        [normalizedCorrectAnswer.replace('+C', '+c'), normalizedCorrectAnswer.replace('+C', '+ c')].includes(userAnswer)) ||
        (normalizedCorrectAnswer.includes('C') && userAnswer === normalizedCorrectAnswer.replace('C', 'C'))) {
        
        adjustTimer(); // Adjust the timer if the answer is correct

        // Provide feedback (e.g., sound effect, visual effect)
        sounds.correct.play(); // Play correct answer sound
        triggerAnimation('correct'); // Trigger correct answer animation

        // Update the score or any other game state if necessary
        score += 10; // Example: increase score by 10
        updateDisplay(); // Update the display to show the new score

        // Check if a milestone has been reached
        checkMilestone(); // Check if a milestone has been reached

        return true; // Answer is correct
    } else {
        // Provide feedback (e.g., sound effect, visual effect)
        sounds.wrong.play(); // Play wrong answer sound
        triggerAnimation('incorrect'); // Trigger incorrect answer animation

        // Show the correct answer in an alert
        alert(`Incorrect! The correct answer is: ${currentProblem.answer}. Click "Thanks" to continue.`);
        
        // Decrease lives
        lives--;
        updateDisplay(); // Update the display to show the new lives count

        return false; // Answer is incorrect
    }
}

// Function to trigger animations for correct/incorrect answers
function triggerAnimation(type) {
    const animationArea = document.getElementById('animationArea');
    if (type === 'correct') {
        animationArea.innerHTML = '<div class="sparkles">✨</div>'; // Add sparkles for correct answer
    } else {
        animationArea.innerHTML = '<div class="meteors">☄️</div>'; // Add meteors for incorrect answer
    }
    setTimeout(() => {
        animationArea.innerHTML = ''; // Clear animation after a short duration
    }, 2000);
}

// Function to render math in a specific element
function renderMathInElement(element) {
    const options = {
        throwOnError: false
    };
    katex.render(element.innerHTML, element, options); // Render the content with KaTeX
}

// Function to check for milestones
function checkMilestone() {
    if (milestoneLevels.includes(currentLevel)) {
        isMilestone = true; // Set milestone flag
        freezeTimer(); // Freeze the timer
        alert(`Congratulations! You've reached level ${currentLevel}!`); // Use alert for milestone message
        score *= 2; // Double the score
        updateDisplay(); // Update the display to show the new score
        continueTimer(); // Continue the timer after the alert
    }
}

// Function to freeze the timer
function freezeTimer() {
    clearInterval(timerInterval); // Stop the timer interval
    // Optionally, you can also disable any inputs here
}

// Function to continue the timer
function continueTimer() {
    startTimer(); // Restart the timer
}

// Function to start the timer
function startTimer() {
    timer = 5; // Reset timer to 5 seconds
    timerElement.textContent = timer; // Display the initial timer value
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer; // Update the displayed timer
        if (timer <= 0) {
            endGame(); // End the game when timer reaches 0
        }
    }, 1000);
}

// Function to create a new problem
function newProblem() {
    const problems = generateProblem(); // Generate problems based on the current level
    currentProblem = problems; // Select the generated problem
    elements.question.innerHTML = currentProblem.question; // Set the question in the element
    renderMath(); // Call renderMath to render the question using KaTeX
}

// Function to update display elements
function updateDisplay() {
    elements.score.textContent = `Score: ${score}`;
    elements.lives.textContent = `Lives: ${lives}`;
    elements.level.textContent = `Level: ${level}`;
    elements.highScore.textContent = `High Score: ${highScore}`;
    updateProgressBar(); // Update the progress bar
}

// Call this function when the document is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('helpButton').addEventListener('click', showHelpModal);
    document.querySelector('.close-modal').addEventListener('click', closeHelpModal);
    setupKeyboard(); // Call the setupKeyboard here
    resetGame(); // Initialize the game
});

// Function to end the game
function endGame() {
    clearInterval(timerInterval); // Clear the timer interval
    alert(`Game Over! Your score: ${score}\nHigh Score: ${highScore}\nLives Remaining: ${lives}\nLevel Reached: ${level}`);
    
    const playAgain = confirm("Do you want to play again?"); // Ask if the user wants to play again
    if (playAgain) {
        resetGame(); // Reset the game if the player wants to play again
    } else {
        alert("Thank you for playing!"); // Thank the user for playing
    }
}

// Function to reset the game state
function resetGame() {
    score = 0; // Initialize score
    lives = 10; // Initialize lives
    level = 1; // Initialize level
    updateDisplay(); // Update display elements
    newProblem(); // Generate a new problem
    startTimer(); // Start the timer
}

// Function to update display elements
function updateDisplay() {
    elements.score.textContent = `Score: ${score}`;
    elements.lives.textContent = `Lives: ${lives}`;
    elements.level.textContent = `Level: ${level}`;
    elements.highScore.textContent = `High Score: ${highScore}`;
    updateProgressBar(); // Update the progress bar
}

// Function to update the progress bar
function updateProgressBar() {
    const maxLevel = 100; // Define the maximum level
    const progressPercentage = (level / maxLevel) * 100; // Calculate percentage based on max level
    elements.progressBar.style.width = `${progressPercentage}%`; // Update the width of the progress bar
}

// Function to add visual elements (e.g., planets/stars)
function addVisualElement() {
    const planet = document.createElement('div');
    planet.className = 'planet'; // Add a class for styling
    elements.galaxyContainer.appendChild(planet); // Append the planet to the galaxy container
}

// Function to handle symbol button clicks
function handleSymbolClick(symbol) {
    switch (symbol) {
        case ' ':
            appendToInput(' ');
            break;
        case 'backspace':
            elements.answerInput.value = elements.answerInput.value.slice(0, -1);
            break;
        case 'C':
            elements.answerInput.value = '';
            break;
        default:
            appendToInput(symbol);
            break;
    }
}

// Function to append value to the answer input
function appendToInput(value) {
    elements.answerInput.value += value;
    elements.answerInput.focus();
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
    const symbols = ['x', '+', '-', '/', '^', '(', ')', '√', 'C', ' ', 'backspace'];
    symbols.forEach(symbol => {
        createButton(keyboard, symbol === ' ' ? 'Space' : symbol, () => handleSymbolClick(symbol));
    });
}

// Function to create a button
function createButton(container, text, onClick) {
    const button = document.createElement('button');
    button.className = 'key glowing'; // Add glowing class for visual effect
    button.textContent = text;
    button.onclick = onClick;
    container.appendChild(button);
}

// Event listener for the Start Game button
document.getElementById('startGame').addEventListener('click', function() {
    startBackgroundMusic(); // Start background music
    resetGame(); // Reset the game state
});

// Initialize the game
setupKeyboard();
resetGame();