let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let lives = 10;
let level = 1;
let timer = 30;
let timerInterval;

const wrongSound = document.getElementById('wrongSound');
const correctSound = document.getElementById('correctSound');
const tickSound = document.getElementById('tickSound');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const timerElement = document.getElementById('timer');
const questionElement = document.getElementById('equation');

// Update high score display initially
highScoreElement.textContent = `High Score: ${highScore}`;

function generateProblem() {
    let problems;
    if (level <= 25) {
        problems = [
            { question: "d/dx(x^2)", answer: "2x" },
            { question: "d/dx(3x^3)", answer: "9x^2" },
            { question: "d/dx(x^3)", answer: "3x^2" },
            { question: "d/dx(5x^4)", answer: "20x^3" },
            { question: "d/dx(x^5)", answer: "5x^4" },
            { question: "d/dx(2x)", answer: "2" },
            { question: "d/dx(7x)", answer: "7" },
            { question: "d/dx(10x)", answer: "10" },
            { question: "d/dx(x)", answer: "1" },
            { question: "d/dx(8)", answer: "0" },
            { question: "d/dx(15)", answer: "0" },
            { question: "d/dx(x^6)", answer: "6x^5" },
            { question: "d/dx(4x^2)", answer: "8x" },
            { question: "d/dx(6x^3)", answer: "18x^2" },
            { question: "d/dx(2x^4)", answer: "8x^3" },
            { question: "d/dx(x^7)", answer: "7x^6" },
            { question: "d/dx(9x^5)", answer: "45x^4" },
            { question: "d/dx(12x^2)", answer: "24x" },
            { question: "d/dx(x^8)", answer: "8x^7" },
            { question: "d/dx(20x)", answer: "20" },
            { question: "d/dx(x^9)", answer: "9x^8" },
            { question: "d/dx(11x^3)", answer: "33x^2" },
            { question: "d/dx(x^10)", answer: "10x^9" },
            { question: "d/dx(13x^4)", answer: "52x^3" },
            { question: "d/dx(x^11)", answer: "11x^10" },
            { question: "d/dx(e^x)", answer: "e^x" },
            { question: "d/dx(e^(2x))", answer: "2e^(2x)" },
            { question: "d/dx(e^(-x))", answer: "-e^(-x)" },
            { question: "d/dx(x^(1/2))", answer: "1/(2√x)" },
            { question: "d/dx(x^(1/3))", answer: "1/(3x^(2/3))" },
            { question: "d/dx(1/x)", answer: "-1/x^2" },
            { question: "d/dx(1/x^2)", answer: "-2/x^3" },
            { question: "d/dx(√x)", answer: "1/(2√x)" },
            { question: "d/dx(3√x)", answer: "3/(2√x)" },
            { question: "d/dx(sin(x))", answer: "cos(x)" },
            { question: "d/dx(cos(x))", answer: "-sin(x)" },
            { question: "d/dx(x^(-1))", answer: "-1/x^2" },
            { question: "d/dx(x^(-2))", answer: "-2/x^3" },
            { question: "d/dx((x+1)^2)", answer: "2(x+1)" },
            { question: "d/dx((x-1)^3)", answer: "3(x-1)^2" }
        ];
    } else {
        problems = [
            { question: "∫ 2x dx", answer: "x^2 + C" },
            { question: "∫ 1 dx", answer: "x + C" },
            { question: "∫ x^2 dx", answer: "x^3/3 + C" },
            { question: "∫ x^3 dx", answer: "x^4/4 + C" },
            { question: "∫ x^4 dx", answer: "x^5/5 + C" },
            { question: "∫ 3x^2 dx", answer: "x^3 + C" },
            { question: "∫ 4x^3 dx", answer: "x^4 + C" },
            { question: "∫ 5x^4 dx", answer: "x^5 + C" },
            { question: "∫ 6x dx", answer: "3x^2 + C" },
            { question: "∫ 7x^2 dx", answer: "7x^3/3 + C" },
            { question: "∫ 8x^3 dx", answer: "2x^4 + C" },
            { question: "∫ 9x^4 dx", answer: "9x^5/5 + C" },
            { question: "∫ 10x^5 dx", answer: "5x^6/3 + C" },
            { question: "∫ x^5 dx", answer: "x^6/6 + C" },
            { question: "∫ x^6 dx", answer: "x^7/7 + C" },
            { question: "∫ e^x dx", answer: "e^x + C" },
            { question: "∫ e^(2x) dx", answer: "e^(2x)/2 + C" },
            { question: "∫ e^(-x) dx", answer: "-e^(-x) + C" },
            { question: "∫ x^(-1) dx", answer: "ln|x| + C" },
            { question: "∫ x^(-2) dx", answer: "-1/x + C" },
            { question: "∫ √x dx", answer: "(2/3)x^(3/2) + C" },
            { question: "∫ 1/√x dx", answer: "2√x + C" },
            { question: "∫ sin(x) dx", answer: "-cos(x) + C" },
            { question: "∫ cos(x) dx", answer: "sin(x) + C" },
            { question: "∫ 1/(x^2) dx", answer: "-1/x + C" },
            { question: "∫ x^(-1/2) dx", answer: "2√x + C" },
            { question: "∫ x^(-3/2) dx", answer: "-2/√x + C" },
            { question: "∫ (x+1)^2 dx", answer: "(x+1)^3/3 + C" },
            { question: "∫ (x-1)^3 dx", answer: "(x-1)^4/4 + C" },
            { question: "∫ 1/(x+1) dx", answer: "ln|x+1| + C" }
        ];
    }
    return problems[Math.floor(Math.random() * problems.length)];
}

function checkAnswer(userAnswer, correctAnswer) {
    userAnswer = userAnswer.toLowerCase().replace(/\s/g, '');
    correctAnswer = correctAnswer.toLowerCase();

    if (correctAnswer.includes('+c')) {
        return userAnswer === correctAnswer ||
               userAnswer === correctAnswer.replace('+c', '+C') ||
               userAnswer === correctAnswer.replace('+c', '+ c') ||
               userAnswer === correctAnswer.replace('+c', '+ C');
    } else {
        return userAnswer === correctAnswer;
    }
}

// Keyboard functionality
function setupKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const answerInput = document.getElementById('answer');

    // Clear previous event listeners
    keyboard.innerHTML = '';

    // Create number buttons 0-9
    for (let i = 0; i <= 9; i++) {
        const button = document.createElement('button');
        button.className = 'key';
        button.textContent = i;
        button.onclick = () => {
            answerInput.value += i;
            answerInput.focus();
        };
        keyboard.appendChild(button);
    }

    // Common math symbols and functions
    const symbols = [
        'x', '+', '-', '/', '^', '(', ')', 
        '√', 'C', 'space', 'backspace'
    ];

    symbols.forEach(symbol => {
        const button = document.createElement('button');
        button.className = 'key';
        
        switch(symbol) {
            case 'space':
                button.textContent = 'Space';
                button.onclick = () => {
                    answerInput.value += ' ';
                    answerInput.focus();
                };
                break;
            case 'backspace':
                button.textContent = '←';
                button.onclick = () => {
                    answerInput.value = answerInput.value.slice(0, -1);
                    answerInput.focus();
                };
                break;
            case 'C':
                button.textContent = 'Clear';
                button.onclick = () => {
                    answerInput.value = '';
                    answerInput.focus();
                };
                break;
            default:
                button.textContent = symbol;
                button.onclick = () => {
                    answerInput.value += symbol;
                    answerInput.focus();
                };
        }
        keyboard.appendChild(button);
    });
}

let currentProblem;

function newProblem() {
    currentProblem = generateProblem();
    questionElement.textContent = currentProblem.question;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = `High Score: ${highScore}`;
        return true;
    }
    return false;
}

function showGameOverPopup() {
    const newHighScore = updateHighScore();
    const message = newHighScore ? 
        `Game Over!\nNew High Score: ${score}!` :
        `Game Over!\nScore: ${score}\nHigh Score : ${highScore}`;
    alert(message);
    window.location.reload();
}

function initGame() {
    setupKeyboard();
    newProblem();
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = `Time: ${timer} seconds`;
        if (timer <= 0) {
            clearInterval(timerInterval);
            showGameOverPopup();
        }
    }, 1000);
    submitButton.addEventListener('click', () => {
        if (checkAnswer(answerInput.value, currentProblem.answer)) {
            correctSound.play();
            score += 10; // Increase score by 10 points instead of 1
            scoreElement.textContent = `Score: ${score}`;
            lives++;
            livesElement.textContent = `Lives: ${lives}`;
            timer += 5; // Increase timer by 5 seconds for correct answer
            timerElement.textContent = `Time: ${timer} seconds`;
            newProblem();
            answerInput.value = '';
        } else {
            wrongSound.play();
            lives--;
            livesElement.textContent = `Lives: ${lives}`;
            if (lives <= 0) {
                clearInterval(timerInterval);
                showGameOverPopup();
            }
        }
    });
}

initGame();
