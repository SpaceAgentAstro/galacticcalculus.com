/*
 * Mock Exam Generator
 *
 * This script powers the mock exam creation page. It defines a small
 * question bank covering several GCSE/A‑level maths topics and uses
 * pdfmake to assemble a customised PDF exam. Users can adjust the
 * total marks, difficulty level and the proportion of each topic.
 */

// Question bank organised by topic and difficulty. Each question has
// a prompt and an answer. Feel free to add more questions to extend
// coverage or increase randomness. Difficulty values: 'easy', 'medium', 'hard'.
const QUESTION_BANK = [
    // Algebra questions
    { topic: 'algebra', difficulty: 'easy', question: 'Solve for x: 2x + 3 = 11', answer: 'x = 4' },
    { topic: 'algebra', difficulty: 'easy', question: 'Factorise: x^2 - 9', answer: '(x - 3)(x + 3)' },
    { topic: 'algebra', difficulty: 'easy', question: 'Simplify: 3(x + 2) - 5', answer: '3x + 1' },
    { topic: 'algebra', difficulty: 'medium', question: 'Solve for x: x^2 - 5x + 6 = 0', answer: 'x = 2, 3' },
    { topic: 'algebra', difficulty: 'medium', question: 'Expand and simplify: (x + 3)(x - 4)', answer: 'x^2 - x - 12' },
    { topic: 'algebra', difficulty: 'medium', question: 'Simplify: \n\frac{2x^2y}{4xy^2}', answer: '\n\frac{x}{2y}' },
    { topic: 'algebra', difficulty: 'hard', question: 'Solve for x: 3x^2 + 2x - 1 = 0', answer: 'x = \n\frac{-2 \pm \sqrt{16}}{6}' },
    { topic: 'algebra', difficulty: 'hard', question: 'Simplify: (2x - 5)^2 - (x + 4)^2', answer: '3x^2 - 18x - 9' },
    { topic: 'algebra', difficulty: 'hard', question: 'Find the inverse function of f(x) = 5x - 2', answer: 'f^{-1}(x) = \n\frac{x + 2}{5}' },
    // Geometry questions
    { topic: 'geometry', difficulty: 'easy', question: 'Find the area of a rectangle with length 5cm and width 3cm.', answer: '15 cm^2' },
    { topic: 'geometry', difficulty: 'easy', question: 'What is the sum of interior angles of a triangle?', answer: '180°' },
    { topic: 'geometry', difficulty: 'easy', question: 'Find the perimeter of a square with side 4 cm.', answer: '16 cm' },
    { topic: 'geometry', difficulty: 'medium', question: 'Calculate the circumference of a circle with radius 7 cm (use \n\pi ≈ 3.14).', answer: '≈ 43.96 cm' },
    { topic: 'geometry', difficulty: 'medium', question: 'Find the volume of a rectangular prism 3cm × 4cm × 5cm.', answer: '60 cm^3' },
    { topic: 'geometry', difficulty: 'medium', question: 'Determine the exterior angle of a regular hexagon.', answer: '60°' },
    { topic: 'geometry', difficulty: 'hard', question: 'Find the area of a trapezium with bases 6 cm and 10 cm and height 4 cm.', answer: '32 cm^2' },
    { topic: 'geometry', difficulty: 'hard', question: 'Calculate the length of the hypotenuse of a right triangle with legs 8 cm and 15 cm.', answer: '17 cm' },
    { topic: 'geometry', difficulty: 'hard', question: 'Find the area of a sector of angle 90° in a circle of radius 6 cm.', answer: '≈ 28.27 cm^2' },
    // Trigonometry questions
    { topic: 'trig', difficulty: 'easy', question: 'Evaluate: \n\sin(30°)', answer: '0.5' },
    { topic: 'trig', difficulty: 'easy', question: 'Evaluate: \n\cos(60°)', answer: '0.5' },
    { topic: 'trig', difficulty: 'easy', question: 'What is \n\tan(45°)?', answer: '1' },
    { topic: 'trig', difficulty: 'medium', question: 'Solve for x: \n\sin(x) = \n\frac{\sqrt{3}}{2}, 0° ≤ x ≤ 180°', answer: 'x = 60°, 120°' },
    { topic: 'trig', difficulty: 'medium', question: 'Find the exact value of \n\cos(45°)', answer: '\n\frac{\sqrt{2}}{2}' },
    { topic: 'trig', difficulty: 'medium', question: 'Determine the amplitude of y = 4 \n\sin(x)', answer: '4' },
    { topic: 'trig', difficulty: 'hard', question: 'Solve for x: 2 \n\cos^2(x) - 1 = 0, 0° ≤ x < 360°', answer: 'x = 45°, 315°' },
    { topic: 'trig', difficulty: 'hard', question: 'Prove the identity: \n\sin^2(x) + \n\cos^2(x) = 1', answer: 'Using Pythagorean identity.' },
    { topic: 'trig', difficulty: 'hard', question: 'Find the period of y = \n\tan(2x)', answer: '90°' },
    // Statistics questions
    { topic: 'stats', difficulty: 'easy', question: 'What is the mean of 4, 7, 9?', answer: '\n\frac{20}{3} ≈ 6.67' },
    { topic: 'stats', difficulty: 'easy', question: 'Find the median of 2, 5, 8, 12, 17.', answer: '8' },
    { topic: 'stats', difficulty: 'easy', question: 'What is the mode of the set {1, 2, 2, 3, 4}?', answer: '2' },
    { topic: 'stats', difficulty: 'medium', question: 'Calculate the range of the data 3, 8, 12, 14, 18.', answer: '15' },
    { topic: 'stats', difficulty: 'medium', question: 'Find the probability of rolling a sum of 7 on two fair six‑sided dice.', answer: '\n\frac{6}{36} = \n\frac{1}{6}' },
    { topic: 'stats', difficulty: 'medium', question: 'A fair coin is tossed 3 times. What is the probability of getting exactly two heads?', answer: '\n\frac{3}{8}' },
    { topic: 'stats', difficulty: 'hard', question: 'What is the standard deviation of 2, 4, 4, 4, 5, 5, 7, 9?', answer: '≈ 2' },
    { topic: 'stats', difficulty: 'hard', question: 'Find the expected value of a fair six‑sided die.', answer: '3.5' },
    { topic: 'stats', difficulty: 'hard', question: 'Given P(A) = 0.4, P(B) = 0.5, and P(A ∩ B) = 0.1, find P(A ∪ B).', answer: '0.8' },
    // Calculus questions (reuse from the game but simplified)
    { topic: 'calculus', difficulty: 'easy', question: 'Differentiate: f(x) = x^2', answer: '2x' },
    { topic: 'calculus', difficulty: 'easy', question: 'Integrate: \n\int 3x^2 \, dx', answer: 'x^3 + C' },
    { topic: 'calculus', difficulty: 'easy', question: 'Differentiate: f(x) = \n\sin(x)', answer: '\n\cos(x)' },
    { topic: 'calculus', difficulty: 'medium', question: 'Integrate: \n\int (2x + 1) \, dx', answer: 'x^2 + x + C' },
    { topic: 'calculus', difficulty: 'medium', question: 'Differentiate: f(x) = x^3 - 4x', answer: '3x^2 - 4' },
    { topic: 'calculus', difficulty: 'medium', question: 'Integrate: \n\int \n\cos(x) \, dx', answer: '\n\sin(x) + C' },
    { topic: 'calculus', difficulty: 'hard', question: 'Differentiate: f(x) = e^{2x}', answer: '2e^{2x}' },
    { topic: 'calculus', difficulty: 'hard', question: 'Integrate: \n\int 1/x \, dx', answer: '\n\ln|x| + C' },
    { topic: 'calculus', difficulty: 'hard', question: 'Differentiate: f(x) = \n\ln(x)', answer: '\n\frac{1}{x}' }
];

// Helper to retrieve selected numeric value for a topic percentage, defaulting to 0
function getTopicPercentage(id) {
    const input = document.getElementById(id);
    return input ? parseInt(input.value, 10) || 0 : 0;
}

// Entry point: when the page loads, attach event listener
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateExamButton');
    generateButton.addEventListener('click', () => {
        generateExam();
    });

    // Update total marks based on specification selection. These values are
    // rough approximations of typical exam lengths. Users can still
    // override the value manually.
    const specSelect = document.getElementById('specSelect');
    const boardSelect = document.getElementById('boardSelect');
    const totalMarksInput = document.getElementById('totalMarks');

    // Map combinations of board and spec to typical total marks
    const DEFAULT_MARKS = {
        edexcel: { igcse_math_a: 100, intl_gcse_math: 100, as_math: 100, a_level_math: 200, further_math: 200 },
        cambridge: { igcse_math_a: 80, intl_gcse_math: 100, as_math: 100, a_level_math: 200, further_math: 200 },
        aqa: { igcse_math_a: 100, intl_gcse_math: 100, as_math: 100, a_level_math: 100, further_math: 200 },
        ocr: { igcse_math_a: 100, intl_gcse_math: 100, as_math: 100, a_level_math: 200, further_math: 200 },
        wjec: { igcse_math_a: 100, intl_gcse_math: 100, as_math: 100, a_level_math: 200, further_math: 200 }
    };

    function updateDefaultMarks() {
        const board = boardSelect.value;
        const spec = specSelect.value;
        const boardMap = DEFAULT_MARKS[board] || {};
        const defaultMarks = boardMap[spec] || 100;
        totalMarksInput.value = defaultMarks;
    }
    specSelect.addEventListener('change', updateDefaultMarks);
    boardSelect.addEventListener('change', updateDefaultMarks);
    // Initialise default marks on load
    updateDefaultMarks();
});

/**
 * Generate the mock exam based on the user's selections. This function
 * validates topic distribution and total marks, selects an appropriate
 * number of questions from the bank, and builds a PDF using pdfmake.
 */
function generateExam() {
    const spec = document.getElementById('specSelect').value;
    const board = document.getElementById('boardSelect').value;
    const totalMarks = parseInt(document.getElementById('totalMarks').value, 10) || 100;
    const difficulty = document.getElementById('difficultySelect').value;
    // Gather topic percentages and normalise if sum differs from 100
    const topics = {
        algebra: getTopicPercentage('topicAlgebra'),
        geometry: getTopicPercentage('topicGeometry'),
        trig: getTopicPercentage('topicTrig'),
        stats: getTopicPercentage('topicStats'),
        calculus: getTopicPercentage('topicCalculus')
    };
    const sum = Object.values(topics).reduce((a, b) => a + b, 0);
    if (sum === 0) {
        alert('Please specify a non‑zero distribution for at least one topic.');
        return;
    }
    // Normalise weights to sum to 1
    const normalised = {};
    Object.keys(topics).forEach(key => {
        normalised[key] = topics[key] / sum;
    });
    // Determine number of questions. Assume each question is worth 5 marks.
    const marksPerQuestion = 5;
    const numQuestions = Math.max(1, Math.round(totalMarks / marksPerQuestion));
    // Build a list of questions according to distribution and difficulty
    const selectedQuestions = [];
    Object.keys(normalised).forEach(topic => {
        const topicCount = Math.round(numQuestions * normalised[topic]);
        const candidates = QUESTION_BANK.filter(q => q.topic === topic && (difficulty === 'easy' || q.difficulty === difficulty || (difficulty === 'medium' && q.difficulty !== 'hard') || (difficulty === 'hard')));
        for (let i = 0; i < topicCount; i++) {
            // Randomly choose a question from the filtered candidates
            if (candidates.length === 0) continue;
            const choice = candidates[Math.floor(Math.random() * candidates.length)];
            selectedQuestions.push(choice);
        }
    });
    // If the number of selected questions is less than required due to rounding, pad with random questions from any topic
    while (selectedQuestions.length < numQuestions) {
        const anyCandidates = QUESTION_BANK.filter(q => (difficulty === 'easy' || q.difficulty === difficulty || (difficulty === 'medium' && q.difficulty !== 'hard') || (difficulty === 'hard')));
        selectedQuestions.push(anyCandidates[Math.floor(Math.random() * anyCandidates.length)]);
    }
    // Build PDF document definition
    const docDefinition = {
        content: []
    };
    docDefinition.content.push({ text: 'Mock Exam', style: 'header' });
    docDefinition.content.push({ text: `Board: ${board.charAt(0).toUpperCase() + board.slice(1)}`, margin: [0, 4, 0, 0] });
    docDefinition.content.push({ text: `Specification: ${spec}`, margin: [0, 0, 0, 0] });
    docDefinition.content.push({ text: `Total Marks: ${totalMarks}`, margin: [0, 0, 0, 4] });
    docDefinition.content.push({ text: `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`, margin: [0, 0, 0, 8] });
    // Insert each question with numbering
    selectedQuestions.forEach((q, index) => {
        docDefinition.content.push({ text: `${index + 1}. ${q.question}`, margin: [0, 4, 0, 0] });
    });
    docDefinition.content.push({ text: '', pageBreak: 'before' });
    docDefinition.content.push({ text: 'Answer Key', style: 'header' });
    selectedQuestions.forEach((q, index) => {
        docDefinition.content.push({ text: `${index + 1}. ${q.answer}`, margin: [0, 4, 0, 0] });
    });
    // Styles for PDF
    docDefinition.styles = {
        header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 8]
        }
    };
    // Create and download the PDF
    pdfMake.createPdf(docDefinition).download('mock_exam.pdf');
}