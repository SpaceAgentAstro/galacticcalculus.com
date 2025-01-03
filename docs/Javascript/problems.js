function getDifferentiationProblems() {
    const differentiationRules = [
        { pattern: /x\^(\d+)/, answer: (match, exponent) => `${exponent}x^${exponent - 1}` },
        { pattern: /(\d+)x\^(\d+)/, answer: (match, coefficient, exponent) => `${coefficient * exponent}x^${exponent - 1}` },
        { pattern: /(\d+)x/, answer: (match, coefficient) => coefficient },
        { pattern: /x/, answer: '1' },
        { pattern: /(\d+)/, answer: '0' },
        { pattern: /e\^x/, answer: 'e^x' },
        { pattern: /sin\(x\)/, answer: 'cos(x)' },
        { pattern: /cos\(x\)/, answer: '-sin(x)' },
        { pattern: /tan\(x\)/, answer: 'sec^2(x)' },
        { pattern: /ln\(x\)/, answer: '1/x' },
        { pattern: /e\^(\d+)x/, answer: (match, coefficient) => `${coefficient}e^${coefficient}x` },
        { pattern: /x\^(\d+) \+ (\d+)x \+ (\d+)/, answer: (match, exponent, coefficient, constant) => `${exponent}x^${exponent - 1} + ${coefficient}` },
        { pattern: /x\^(\d+) - (\d+)x\^(\d+) \+ (\d+)/, answer: (match, exponent, coefficient, exponent2, constant) => `${exponent}x^${exponent - 1} - ${coefficient * exponent2}x^${exponent2 - 1}` },
        { pattern: /x\^(\d+) \+ (\d+)x\^(\d+) - (\d+)x/, answer: (match, exponent, coefficient, exponent2, coefficient2) => `${exponent}x^${exponent - 1} + ${coefficient * exponent2}x^${exponent2 - 1} - ${coefficient2}` },
        { pattern: /x\^(\d+) \+ (\d+)/, answer: (match, exponent, constant) => `${exponent}x^${exponent - 1}` },
        { pattern: /x\^(\d+) - (\d+)x\^(\d+)/, answer: (match, exponent, coefficient, exponent2) => `${exponent}x^${exponent - 1} - ${coefficient * exponent2}x^${exponent2 - 1}` }
    ];

    const differentiationProblems = [
        { question: 'x^2', answer: '2x' },
        { question: '3x^3', answer: '9x^2' },
        { question: 'x^3', answer: '3x^2' },
        { question: '5x^4', answer: '20x^3' },
        { question: 'x^5', answer: '5x^4' },
        { question: '2x', answer: '2' },
        { question: '7x', answer: '7' },
        { question: '10x', answer: '10' },
        { question: 'x', answer: '1' },
        { question: '8', answer: '0' },
        { question: '15', answer: '0' },
        { question: 'x^6', answer: '6x^5' },
        { question: '4x^2', answer: '8x' },
        { question: '6x^3', answer: '18x^2' },
        { question: '2x^4', answer: '8x^3' },
        { question: 'x^7', answer: '7x^6' },
        { question: '9x^5', answer: '45x^4' },
        { question: '12x^2', answer: '24x' },
        { question: 'x^8', answer: '8x^7' },
        { question: '20x', answer: '20' },
        { question: 'x^9', answer: '9x^8' },
        { question: '11x^3', answer: '33x^2' },
        { question: 'x^{10}', answer: '10x^9' },
        { question: '13x^4', answer: '52x^3' },
        { question: 'x^{11}', answer: '11x^{10}' },
        { question: 'e^x', answer: 'e^x' },
        { question: '\\sin(x)', answer: '\\cos(x)' },
        { question: '\\cos(x)', answer: '-\\sin(x)' },
        { question: '\\tan(x)', answer: '\\sec^2(x)' },
        { question: '\\ln(x)', answer: '\\frac{1}{x}' },
        { question: 'e^{2x}', answer: '2e^{2x}' },
        { question: 'x^2 + 3x + 2', answer: '2x + 3' },
        { question: 'x^3 - 4x^2 + 6', answer: '3x^2 - 8x' },
        { question: 'x^4 + 2x^3 - x', answer: '4x^3 + 6x^2 - 1' },
        { question: 'x^5 + 5', answer: '5x^4' },
        { question: 'x^6 - 3x^2 + 2', answer: '6x^5 - 6x' }
    ];

    return differentiationProblems;
}
function getIntegrationProblems() {
    const integrationRules = [
        { pattern: /x\^(\d+)/, answer: (match, exponent) => `\\frac{x^${exponent + 1}}{${exponent + 1}} + C` },
        { pattern: /(\d+)x\^(\d+)/, answer: (match, coefficient, exponent) => `\\frac{${coefficient}x^${exponent + 1}}{${exponent + 1}} + C` },
        { pattern: /(\d+)x/, answer: (match, coefficient) => `\\frac{${coefficient}x^2}{2} + C` },
        { pattern: /x/, answer: `\\frac{x^2}{2} + C` },
        { pattern: /(\d+)/, answer: (match, constant) => `${constant}x + C` }
    ];

    const integrationProblems = [
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

    return integrationProblems;
}
