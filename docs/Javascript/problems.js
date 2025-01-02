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
        { question: 'x^2', answer: differentiationRules[0].answer('x^2') },
        { question: '3x^3', answer: differentiationRules[1].answer('3x^3') },
        { question: 'x^3', answer: differentiationRules[0].answer('x^3') },
        { question: '5x^4', answer: differentiationRules[1].answer('5x^4') },
        { question: 'x^5', answer: differentiationRules[0].answer('x^5') },
        { question: '2x', answer: differentiationRules[2].answer('2x') },
        { question: '7x', answer: differentiationRules[2].answer('7x') },
        { question: '10x', answer: differentiationRules[2].answer('10x') },
        { question: 'x', answer: differentiationRules[3].answer('x') },
        { question: '8', answer: differentiationRules[4].answer('8') },
        { question: '15', answer: differentiationRules[4].answer('15') },
        { question: 'x^6', answer: differentiationRules[0].answer('x^6') },
        { question: '4x^2', answer: differentiationRules[1].answer('4x^2') },
        { question: '6x^3', answer: differentiationRules[1].answer('6x^3') },
        { question: '2x^4', answer: differentiationRules[1].answer('2x^4') },
        { question: 'x^7', answer: differentiationRules[0].answer('x^7') },
        { question: '9x^5', answer: differentiationRules[1].answer('9x^5') },
        { question: '12x^2', answer: differentiationRules[1].answer('12x^2') },
        { question: 'x^8', answer: differentiationRules[0].answer('x^8') },
        { question: '20x', answer: differentiationRules[2].answer('20x') },
        { question: 'x^9', answer: differentiationRules[0].answer('x^9') },
        { question: '11x^3', answer: differentiationRules[1].answer('11x^3') },
        { question: 'x^10', answer: differentiationRules[0].answer('x^10') },
        { question: '13x^4', answer: differentiationRules[1].answer('13x^4') },
        { question: 'x^11', answer: differentiationRules[0].answer('x^11') },
        { question: 'e^x', answer: differentiationRules[5].answer('e^x') },
        { question: 'sin(x)', answer: differentiationRules[6].answer('sin(x)') },
        { question: 'cos(x)', answer: differentiationRules[7].answer('cos(x)') },
        { question: 'tan(x)', answer: differentiationRules[8].answer('tan(x)') },
        { question: 'ln(x)', answer: differentiationRules[9].answer('ln(x)') },
        { question: 'e^(2x)', answer: differentiationRules[10].answer('e^(2x)') },
        { question: 'x^2 + 3x + 2', answer: differentiationRules[11].answer('x^2 + 3x + 2') },
        { question: 'x^3 - 4x^2 + 6', answer: differentiationRules[12].answer('x^3 - 4x^2 + 6') },
        { question: 'x^4 + 2x^3 - x', answer: differentiationRules[13].answer('x^4 + 2x^3 - x') },
        { question: 'x^5 + 5', answer: differentiationRules[14].answer('x^5 + 5') },
        { question: 'x^6 - 3x^2 + 2', answer: differentiationRules[15].answer('x^6 - 3x^2 + 2') }
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
        { question: "\\int x \\, dx", answer: integrationRules[3].answer('x') },
        { question: "\\int 2x \\, dx", answer: integrationRules[2].answer('2x') },
        { question: "\\int 3x^2 \\, dx", answer: integrationRules[1].answer('3x^2') },
        { question: "\\int 4x^3 \\, dx", answer: integrationRules[1].answer('4x^3') },
        { question: "\\int 5 \\, dx", answer: integrationRules[4].answer('5') },
        { question: "\\int x^4 \\, dx", answer: integrationRules[0].answer('x^4') },
        { question: "\\int 6x^5 \\, dx", answer: integrationRules[1].answer('6x^5') },
        { question: "\\int 7 \\, dx", answer: integrationRules[4].answer('7') },
        { question: "\\int x^3 + 2x \\, dx", answer: `\\frac{x^4}{4} + \\frac{2x^2}{2} + C` },
        { question: "\\int 8x^2 \\, dx", answer: integrationRules[1].answer('8x^2') },
        { question: "\\int 9 \\, dx", answer: integrationRules[4].answer('9') },
        { question: "\\int x^5 + 3 \\, dx", answer: `\\frac{x^6}{6} + 3x + C` },
        { question: "\\int 10x \\, dx", answer: integrationRules[2].answer('10x') },
        { question: "\\int 11 \\, dx", answer: integrationRules[4].answer('11') },
        { question: "\\int 12x^3 \\, dx", answer: integrationRules[1].answer('12x^3') },
        { question: "\\int 13 \\, dx", answer: integrationRules[4].answer('13') },
        { question: "\\int 14x^2 \\, dx", answer: integrationRules[1].answer('14x^2') },
        { question: "\\int 15 \\, dx", answer: integrationRules[4].answer('15') },
        { question: "\\int x^2 + 4 \\, dx", answer: `\\frac{x^3}{3} + 4x + C` },
        { question: "\\int 16x \\, dx", answer: integrationRules[2].answer('16x') },
        { question: "\\int 17 \\, dx", answer: integrationRules[4].answer('17') },
        { question: "\\int 18x^4 \\, dx", answer: integrationRules[1].answer('18x^4') },
        { question: "\\int 19 \\, dx", answer: integrationRules[4].answer('19') },
        { question: "\\int 20x^3 \\, dx", answer: integrationRules[1].answer('20x^3') }
    ];

    return integrationProblems;
}
