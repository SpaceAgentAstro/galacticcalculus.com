/*
 * Mock Exam Generator
 *
 * Enhanced to provide syllabus-aware question selection, variable mark
 * weightings, an "Intense" difficulty mode and an on-page assistant that
 * explains how the generated paper is built.
 */

const SPEC_LABELS = {
    igcse_math_a: 'IGCSE Mathematics',
    intl_gcse_math: 'International GCSE Mathematics',
    as_math: 'AS Level Mathematics',
    a_level_math: 'A-Level Mathematics',
    further_math: 'Further Mathematics'
};

const BOARD_LABELS = {
    edexcel: 'Edexcel / Pearson',
    cambridge: 'Cambridge (CAIE)',
    aqa: 'AQA',
    ocr: 'OCR',
    wjec: 'WJEC / Eduqas'
};

const TOPIC_LABELS = {
    algebra: 'Algebra',
    geometry: 'Geometry',
    trig: 'Trigonometry',
    stats: 'Statistics',
    calculus: 'Calculus'
};

const SPEC_TOPIC_SUPPORT = {
    igcse_math_a: ['algebra', 'geometry', 'trig', 'stats'],
    intl_gcse_math: ['algebra', 'geometry', 'trig', 'stats'],
    as_math: ['algebra', 'geometry', 'trig', 'stats', 'calculus'],
    a_level_math: ['algebra', 'geometry', 'trig', 'stats', 'calculus'],
    further_math: ['algebra', 'geometry', 'trig', 'stats', 'calculus']
};

const SYLLABUS_SUMMARY = {
    igcse_math_a: 'Focuses on core algebra, geometry, number and statistics with light trigonometry but no calculus content.',
    intl_gcse_math: 'Covers algebraic manipulation, coordinate geometry, trigonometry and statistics. Calculus is excluded.',
    as_math: 'Introduces differentiation, integration and advanced algebra while retaining GCSE material.',
    a_level_math: 'Demands full calculus fluency alongside vectors, trigonometric identities, statistics and mechanics topics.',
    further_math: 'Extends A-Level content with complex algebra, matrices, polar coordinates and advanced calculus techniques.'
};

const DIFFICULTY_DESCRIPTIONS = {
    easy: 'Short recall questions worth 4–6 marks to build confidence.',
    medium: 'Multi-step problems worth 8–12 marks that mirror Section B exam items.',
    hard: 'Extended response questions worth 14–18 marks requiring full method explanations.',
    intense: 'Investigations worth up to 30 marks featuring layered reasoning, modelling or proof.'
};

const DIFFICULTY_FILTERS = {
    easy: ['easy'],
    medium: ['easy', 'medium'],
    hard: ['medium', 'hard'],
    intense: ['hard', 'intense']
};

const DIFFICULTY_ORDER = {
    easy: 0,
    medium: 1,
    hard: 2,
    intense: 3
};

const QUESTION_BANK = [
    // Algebra
    { id: 'ALG_E_LINEAR_01', topic: 'algebra', difficulty: 'easy', marks: 4, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Solve for x: 2x + 3 = 11.', answer: 'x = 4.' },
    { id: 'ALG_E_FACTOR_01', topic: 'algebra', difficulty: 'easy', marks: 5, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Factorise: x^2 - 9.', answer: '(x - 3)(x + 3).' },
    { id: 'ALG_E_SIMPLIFY_01', topic: 'algebra', difficulty: 'easy', marks: 4, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Simplify: 3(x + 2) - 5.', answer: '3x + 1.' },
    { id: 'ALG_E_INEQUALITY_01', topic: 'algebra', difficulty: 'easy', marks: 6, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Solve the inequality 3x - 7 < 11 and state the solution set.', answer: 'x < 6 with solution set (-∞, 6).' },
    { id: 'ALG_M_QUAD_01', topic: 'algebra', difficulty: 'medium', marks: 8, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Solve for x: x^2 - 5x + 6 = 0.', answer: 'x = 2 or x = 3.' },
    { id: 'ALG_M_EXPAND_01', topic: 'algebra', difficulty: 'medium', marks: 8, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Expand and simplify: (x + 3)(x - 4).', answer: 'x^2 - x - 12.' },
    { id: 'ALG_M_FRACTION_01', topic: 'algebra', difficulty: 'medium', marks: 9, specs: ['intl_gcse_math', 'as_math'], question: 'Simplify: (2x^2y) / (4xy^2).', answer: 'x / (2y).' },
    { id: 'ALG_M_LOG_01', topic: 'algebra', difficulty: 'medium', marks: 10, specs: ['as_math', 'a_level_math'], question: 'Solve for x: log_{3}(x - 1) + log_{3}(x + 1) = 2.', answer: 'x = 2.' },
    { id: 'ALG_H_QUAD_01', topic: 'algebra', difficulty: 'hard', marks: 14, specs: ['as_math', 'a_level_math', 'further_math'], question: 'Solve the simultaneous system 2x + 3y = 11 and x^2 - y = 5.', answer: 'x = 2 or x = -\frac{5}{2} with corresponding y values 1 and \frac{21}{4}.' },
    { id: 'ALG_H_SEQUENCE_01', topic: 'algebra', difficulty: 'hard', marks: 16, specs: ['as_math', 'a_level_math'], question: 'An arithmetic sequence has first term 7 and common difference -2. Find the 25th term and the sum of the first 25 terms.', answer: '25th term = -41, sum of first 25 terms = -425.' },
    { id: 'ALG_INT_POLY_01', topic: 'algebra', difficulty: 'intense', marks: 26, specs: ['a_level_math', 'further_math'], question: 'Let f(x) = x^3 - 3x^2 - 4x + 12. (a) Show that x = -2 is a root and factorise f(x) completely. (b) Solve f(x) \ge 0. (c) The curve y = f(x) meets the line y = 2x - 4. Find the coordinates of the intersection points.', answer: 'Factorisation: f(x) = (x + 2)(x - 2)(x - 3); inequality holds for -2 \le x \le 2 or x \ge 3; intersections at (-2, -8) and (3, 2).'},
    { id: 'ALG_INT_MATRIX_01', topic: 'algebra', difficulty: 'intense', marks: 28, specs: ['further_math'], question: 'Given matrices A = \n\begin{pmatrix}2 & 1\\0 & 3\end{pmatrix} and B = \n\begin{pmatrix}1 & -1\\4 & 2\end{pmatrix}, (a) compute AB and BA, (b) determine the eigenvalues of A, (c) find the invariant line of the transformation represented by A, and (d) explain whether A is diagonalisable.', answer: 'AB = \n\begin{pmatrix}6 & 0\\12 & 6\end{pmatrix}, BA = \n\begin{pmatrix}2 & 2\\8 & 5\end{pmatrix}; eigenvalues of A are 2 and 3; invariant line given by y = 0; A is diagonalisable because it has two distinct eigenvalues.' },
    // Geometry
    { id: 'GEO_E_AREA_01', topic: 'geometry', difficulty: 'easy', marks: 4, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'Find the area of a rectangle with length 5 cm and width 3 cm.', answer: '15 cm^2.' },
    { id: 'GEO_E_ANGLES_01', topic: 'geometry', difficulty: 'easy', marks: 4, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'What is the sum of interior angles of a triangle?', answer: '180°.' },
    { id: 'GEO_E_PERIMETER_01', topic: 'geometry', difficulty: 'easy', marks: 5, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'Find the perimeter of a square with side 4 cm.', answer: '16 cm.' },
    { id: 'GEO_M_CIRCLE_01', topic: 'geometry', difficulty: 'medium', marks: 8, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Calculate the circumference of a circle with radius 7 cm (use π ≈ 3.14).', answer: 'Approximately 43.96 cm.' },
    { id: 'GEO_M_VOLUME_01', topic: 'geometry', difficulty: 'medium', marks: 9, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Find the volume of a rectangular prism measuring 3 cm × 4 cm × 5 cm.', answer: '60 cm^3.' },
    { id: 'GEO_M_POLYGON_01', topic: 'geometry', difficulty: 'medium', marks: 10, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Determine the exterior angle of a regular hexagon and hence find the number of sides of a polygon with exterior angle 24°.', answer: 'Hexagon exterior angle 60°. A polygon with 24° exterior angle has 15 sides.' },
    { id: 'GEO_H_TRAPEZIUM_01', topic: 'geometry', difficulty: 'hard', marks: 16, specs: ['as_math', 'a_level_math'], question: 'Find the area of a trapezium with parallel sides 6 cm and 10 cm and height 4 cm. Then calculate the area if both parallel sides are increased by 20%.', answer: 'Original area 32 cm^2. Increased lengths 7.2 cm and 12 cm give area 38.4 cm^2.' },
    { id: 'GEO_H_PYTHAG_01', topic: 'geometry', difficulty: 'hard', marks: 15, specs: ['as_math', 'a_level_math'], question: 'Calculate the length of the hypotenuse of a right triangle with legs 8 cm and 15 cm. Hence find the area of the triangle.', answer: 'Hypotenuse 17 cm; area 60 cm^2.' },
    { id: 'GEO_H_SECTOR_01', topic: 'geometry', difficulty: 'hard', marks: 18, specs: ['as_math', 'a_level_math'], question: 'Find the area of a sector of angle 90° in a circle of radius 6 cm and the length of the corresponding arc.', answer: 'Area ≈ 28.27 cm^2; arc length ≈ 9.42 cm.' },
    { id: 'GEO_INT_VECTOR_01', topic: 'geometry', difficulty: 'intense', marks: 24, specs: ['a_level_math', 'further_math'], question: 'Points A(2, 1, -1), B(5, 3, 2) and C(1, 4, 0) define triangle ABC. (a) Find the area of triangle ABC using vectors. (b) Determine the equation of the plane containing the triangle. (c) Find the perpendicular distance from the origin to the plane.', answer: 'Area = \frac{1}{2}|AB \times AC| = \frac{\sqrt{101}}{2}; plane equation 5x - 5y + 9z = -2; distance from origin = \frac{2}{\sqrt{131}}.' },
    { id: 'GEO_INT_LOCI_01', topic: 'geometry', difficulty: 'intense', marks: 27, specs: ['a_level_math', 'further_math'], question: 'A circle has equation x^2 + y^2 - 6x + 4y - 3 = 0. (a) Find its centre and radius. (b) The line y = mx + c is tangent to the circle at point P with x-coordinate 5. Determine m and c. (c) Find the area of the triangle formed by the tangent, the x-axis and the y-axis.', answer: 'Centre (3, -2), radius \sqrt{16} = 4; tangent gradient m = \frac{1}{2}, intercept c = -\frac{9}{2}; triangle area = 8.1 square units.' },
    // Trigonometry
    { id: 'TRI_E_SIN_01', topic: 'trig', difficulty: 'easy', marks: 4, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'Evaluate sin(30°).', answer: '0.5.' },
    { id: 'TRI_E_COS_01', topic: 'trig', difficulty: 'easy', marks: 4, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'Evaluate cos(60°).', answer: '0.5.' },
    { id: 'TRI_E_TAN_01', topic: 'trig', difficulty: 'easy', marks: 5, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'What is tan(45°)?', answer: '1.' },
    { id: 'TRI_M_SOLVE_01', topic: 'trig', difficulty: 'medium', marks: 9, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Solve for 0° ≤ x ≤ 180°: sin(x) = \frac{\sqrt{3}}{2}.', answer: 'x = 60° or 120°.' },
    { id: 'TRI_M_VALUE_01', topic: 'trig', difficulty: 'medium', marks: 8, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Find the exact value of cos(45°).', answer: '\frac{\sqrt{2}}{2}.' },
    { id: 'TRI_M_GRAPH_01', topic: 'trig', difficulty: 'medium', marks: 10, specs: ['as_math', 'a_level_math'], question: 'Determine the amplitude and period of y = 4 sin(2x).', answer: 'Amplitude 4, period 180°.' },
    { id: 'TRI_H_EQUATION_01', topic: 'trig', difficulty: 'hard', marks: 14, specs: ['as_math', 'a_level_math'], question: 'Solve for 0° ≤ x < 360°: 2 cos^2(x) - 1 = 0.', answer: 'x = 45°, 135°, 225°, 315°.' },
    { id: 'TRI_H_IDENTITY_01', topic: 'trig', difficulty: 'hard', marks: 16, specs: ['as_math', 'a_level_math'], question: 'Prove the identity sin^2(x) + cos^2(x) = 1 and use it to find sin(x) when cos(x) = \frac{3}{5} with x acute.', answer: 'Identity follows from the unit circle; sin(x) = \frac{4}{5}.' },
    { id: 'TRI_H_PERIOD_01', topic: 'trig', difficulty: 'hard', marks: 15, specs: ['as_math', 'a_level_math'], question: 'Find the period of y = tan(2x) and sketch one cycle.', answer: 'Period 90°; sketch shows asymptotes at x = -45° and 45° with central intercept at 0.' },
    { id: 'TRI_INT_TRANSFORM_01', topic: 'trig', difficulty: 'intense', marks: 24, specs: ['a_level_math', 'further_math'], question: 'Given 3 sin(x) + 2 cos(x) = 1, express the left-hand side in the form R sin(x + α). Hence solve 3 sin(x) + 2 cos(x) = 1 for 0° ≤ x < 360° and determine the maximum value of the expression.', answer: 'R = \sqrt{13}, α ≈ 33.7°. Solutions: x ≈ 9.6°, 170.4°, 189.6°, 350.4°. Maximum value R ≈ 3.606.' },
    { id: 'TRI_INT_MODELLING_01', topic: 'trig', difficulty: 'intense', marks: 26, specs: ['a_level_math', 'further_math'], question: 'A Ferris wheel of radius 12 m rotates once every 8 minutes. The height h of a seat above the ground can be modelled by h(t) = 13 + 12 sin\left(\frac{\pi t}{4} - \frac{\pi}{6}\right). (a) Determine the highest and lowest heights. (b) Find the time taken to rise from the lowest point to 20 m. (c) Explain how the model changes if the rotation period increases to 10 minutes.', answer: 'Heights between 1 m and 25 m. Time to reach 20 m is approximately 1.52 minutes. With a 10-minute rotation the angular coefficient becomes \frac{\pi}{5} and phase shift is unchanged, stretching the graph horizontally.' },
    // Statistics
    { id: 'STA_E_MEAN_01', topic: 'stats', difficulty: 'easy', marks: 4, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'What is the mean of 4, 7, 9?', answer: '\frac{20}{3} ≈ 6.67.' },
    { id: 'STA_E_MEDIAN_01', topic: 'stats', difficulty: 'easy', marks: 4, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'Find the median of 2, 5, 8, 12, 17.', answer: '8.' },
    { id: 'STA_E_MODE_01', topic: 'stats', difficulty: 'easy', marks: 5, specs: ['igcse_math_a', 'intl_gcse_math'], question: 'What is the mode of the set {1, 2, 2, 3, 4}?', answer: '2.' },
    { id: 'STA_M_RANGE_01', topic: 'stats', difficulty: 'medium', marks: 8, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Calculate the range of the data 3, 8, 12, 14, 18.', answer: '15.' },
    { id: 'STA_M_PROB_01', topic: 'stats', difficulty: 'medium', marks: 9, specs: ['igcse_math_a', 'intl_gcse_math', 'as_math'], question: 'Find the probability of rolling a sum of 7 on two fair six-sided dice.', answer: '\frac{6}{36} = \frac{1}{6}.' },
    { id: 'STA_M_BINOMIAL_01', topic: 'stats', difficulty: 'medium', marks: 10, specs: ['as_math', 'a_level_math'], question: 'A fair coin is tossed 4 times. What is the probability of obtaining exactly two heads?', answer: '\frac{6}{16} = \frac{3}{8}.' },
    { id: 'STA_H_SD_01', topic: 'stats', difficulty: 'hard', marks: 16, specs: ['as_math', 'a_level_math'], question: 'What is the standard deviation of 2, 4, 4, 4, 5, 5, 7, 9?', answer: 'Approximately 2.0.' },
    { id: 'STA_H_EXPECTED_01', topic: 'stats', difficulty: 'hard', marks: 14, specs: ['as_math', 'a_level_math'], question: 'Find the expected value of a fair six-sided die and discuss how it changes if the die is biased to favour 6 with probability 0.3.', answer: 'Fair die expectation 3.5. With bias, expectation becomes 0.3×6 + 0.7×3 = 3.9.' },
    { id: 'STA_H_UNION_01', topic: 'stats', difficulty: 'hard', marks: 15, specs: ['as_math', 'a_level_math'], question: 'Given P(A) = 0.4, P(B) = 0.5 and P(A ∩ B) = 0.1, find P(A ∪ B) and the probability that exactly one of the events occurs.', answer: 'P(A ∪ B) = 0.8; exactly one occurs with probability 0.7.' },
    { id: 'STA_INT_HYP_01', topic: 'stats', difficulty: 'intense', marks: 25, specs: ['a_level_math', 'further_math'], question: 'A factory claims that at most 5% of its components are defective. In a random sample of 120 components, 11 are found to be defective. (a) Carry out a hypothesis test at the 5% level. (b) Find a 95% confidence interval for the true proportion. (c) Interpret the results in context.', answer: 'Test statistic z ≈ 2.19 giving p ≈ 0.028 < 0.05, so reject the claim. Confidence interval ≈ (0.034, 0.117). The data suggest the defect rate exceeds 5%.' },
    { id: 'STA_INT_REGRESSION_01', topic: 'stats', difficulty: 'intense', marks: 27, specs: ['a_level_math', 'further_math'], question: 'For data on time revision (hours) and exam score (%), the regression line is y = 32 + 4.6x with correlation 0.82. (a) Estimate the score for a student who revises 5 hours. (b) Interpret the correlation. (c) Discuss two limitations of using the model to predict the score of a student who revises 15 hours.', answer: 'Estimated score 55%. Correlation indicates a strong positive linear relationship. The model may break down beyond observed data and ignores other performance factors.' },
    // Calculus
    { id: 'CAL_E_DIFF_01', topic: 'calculus', difficulty: 'easy', marks: 6, specs: ['as_math', 'a_level_math', 'further_math'], question: 'Differentiate f(x) = x^2.', answer: 'f\'(x) = 2x.' },
    { id: 'CAL_E_INT_01', topic: 'calculus', difficulty: 'easy', marks: 6, specs: ['as_math', 'a_level_math', 'further_math'], question: 'Integrate ∫ 3x^2 dx.', answer: 'x^3 + C.' },
    { id: 'CAL_E_DIFF_02', topic: 'calculus', difficulty: 'easy', marks: 6, specs: ['as_math', 'a_level_math', 'further_math'], question: 'Differentiate f(x) = sin(x).', answer: 'f\'(x) = cos(x).' },
    { id: 'CAL_M_INT_01', topic: 'calculus', difficulty: 'medium', marks: 10, specs: ['as_math', 'a_level_math', 'further_math'], question: 'Integrate ∫ (2x + 1) dx.', answer: 'x^2 + x + C.' },
    { id: 'CAL_M_DIFF_01', topic: 'calculus', difficulty: 'medium', marks: 10, specs: ['as_math', 'a_level_math', 'further_math'], question: 'Differentiate f(x) = x^3 - 4x.', answer: 'f\'(x) = 3x^2 - 4.' },
    { id: 'CAL_M_INT_02', topic: 'calculus', difficulty: 'medium', marks: 11, specs: ['as_math', 'a_level_math', 'further_math'], question: 'Integrate ∫ cos(x) dx and state the general solution for y\' = cos(x).', answer: '∫ cos(x) dx = sin(x) + C; solution y = sin(x) + C.' },
    { id: 'CAL_H_DIFF_01', topic: 'calculus', difficulty: 'hard', marks: 16, specs: ['a_level_math', 'further_math'], question: 'Differentiate f(x) = e^{2x} and hence find the gradient of the curve at x = ln 2.', answer: 'Derivative 2e^{2x}; gradient at x = ln 2 is 8.' },
    { id: 'CAL_H_INT_01', topic: 'calculus', difficulty: 'hard', marks: 17, specs: ['a_level_math', 'further_math'], question: 'Integrate ∫ (3x^2 - 4x + 1) dx and evaluate between x = 0 and x = 2.', answer: 'Indefinite integral x^3 - 2x^2 + x; definite value at 0 ≤ x ≤ 2 is 4.' },
    { id: 'CAL_H_DIFF_02', topic: 'calculus', difficulty: 'hard', marks: 18, specs: ['a_level_math', 'further_math'], question: 'Differentiate f(x) = ln(x) and use the result to find the derivative of g(x) = ln(3x^2).', answer: 'f\'(x) = 1/x; g\'(x) = \frac{2}{x}.' },
    { id: 'CAL_INT_AREA_01', topic: 'calculus', difficulty: 'intense', marks: 26, specs: ['a_level_math', 'further_math'], question: 'The curve y = x^3 - 6x intersects the x-axis at x = -\sqrt{6}, 0 and \sqrt{6}. (a) Sketch the curve. (b) Find the area enclosed between the curve and the x-axis for -\sqrt{6} ≤ x ≤ \sqrt{6}. (c) Explain how the area changes if the function is transformed to y = (x - 1)^3 - 6(x - 1).', answer: 'Area is 2 ∫_{0}^{\sqrt{6}} (6x - x^3) dx = 18. The translation one unit right keeps the area magnitude at 18 but shifts it along the x-axis.' },
    { id: 'CAL_INT_DIFFEQ_01', topic: 'calculus', difficulty: 'intense', marks: 28, specs: ['further_math'], question: 'Solve the differential equation \frac{dy}{dx} = y\cos(x) with initial condition y(0) = 4. Hence find x when y = 2 and comment on the behaviour as x → \frac{\pi}{2}.', answer: 'Solution y = 4e^{\sin(x)}. When y = 2, sin(x) = -\ln 2, giving x ≈ -0.693 rad (principal value). As x → \frac{\pi}{2}, sin(x) → 1 and y → 4e.' },
];

function getTopicPercentage(id) {
    const input = document.getElementById(id);
    return input ? parseInt(input.value, 10) || 0 : 0;
}

function collectTopicWeights(spec) {
    const raw = {
        algebra: getTopicPercentage('topicAlgebra'),
        geometry: getTopicPercentage('topicGeometry'),
        trig: getTopicPercentage('topicTrig'),
        stats: getTopicPercentage('topicStats'),
        calculus: getTopicPercentage('topicCalculus')
    };
    const supported = SPEC_TOPIC_SUPPORT[spec] || Object.keys(TOPIC_LABELS);
    const adjusted = {};
    const warnings = [];
    Object.keys(raw).forEach(topic => {
        if (!supported.includes(topic)) {
            if (raw[topic] > 0) {
                warnings.push(`${TOPIC_LABELS[topic]} is not examined in ${SPEC_LABELS[spec]}. Those marks were removed.`);
            }
            adjusted[topic] = 0;
        } else {
            adjusted[topic] = raw[topic];
        }
    });
    let total = supported.reduce((sum, topic) => sum + (adjusted[topic] || 0), 0);
    if (total === 0 && supported.length > 0) {
        warnings.push('No topic weights supplied; distributing marks evenly across supported topics.');
        const evenShare = Math.floor(100 / supported.length);
        let remainder = 100 - evenShare * supported.length;
        supported.forEach(topic => {
            adjusted[topic] = evenShare + (remainder > 0 ? 1 : 0);
            if (remainder > 0) {
                remainder -= 1;
            }
        });
        total = 100;
    }
    const normalised = {};
    if (total > 0) {
        Object.keys(TOPIC_LABELS).forEach(topic => {
            normalised[topic] = supported.includes(topic) ? (adjusted[topic] || 0) / total : 0;
        });
    } else {
        Object.keys(TOPIC_LABELS).forEach(topic => {
            normalised[topic] = 0;
        });
    }
    return { raw: adjusted, normalised, warnings, supportedTopics: supported };
}

function difficultyMatches(questionDifficulty, selectedDifficulty) {
    const allowed = DIFFICULTY_FILTERS[selectedDifficulty] || [selectedDifficulty];
    return allowed.includes(questionDifficulty);
}

function candidatePriority(questionDifficulty, selectedDifficulty) {
    return Math.abs((DIFFICULTY_ORDER[questionDifficulty] || 0) - (DIFFICULTY_ORDER[selectedDifficulty] || 0));
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function selectQuestionsForTopic(topic, targetMarks, difficulty, spec, usedIds) {
    const candidates = QUESTION_BANK.filter(q => q.topic === topic && q.specs.includes(spec) && difficultyMatches(q.difficulty, difficulty) && !usedIds.has(q.id));
    if (candidates.length === 0 || targetMarks <= 0) {
        return { questions: [], marks: 0, shortage: targetMarks };
    }
    const ordered = shuffle(candidates).sort((a, b) => {
        const diff = candidatePriority(a.difficulty, difficulty) - candidatePriority(b.difficulty, difficulty);
        if (diff !== 0) return diff;
        return b.marks - a.marks;
    });
    const selected = [];
    let marks = 0;
    let remaining = targetMarks;
    while (ordered.length > 0 && remaining > 0) {
        let index = ordered.findIndex(q => q.marks <= remaining);
        if (index === -1) {
            index = ordered.length - 1;
        }
        const question = ordered.splice(index, 1)[0];
        selected.push(question);
        usedIds.add(question.id);
        marks += question.marks;
        remaining = Math.max(0, targetMarks - marks);
    }
    return { questions: selected, marks, shortage: Math.max(0, targetMarks - marks) };
}

function selectAdditionalQuestions(targetMarks, difficulty, spec, usedIds) {
    const candidates = QUESTION_BANK.filter(q => q.specs.includes(spec) && difficultyMatches(q.difficulty, difficulty) && !usedIds.has(q.id));
    if (candidates.length === 0 || targetMarks <= 0) {
        return { questions: [], marks: 0, shortage: targetMarks };
    }
    const ordered = shuffle(candidates).sort((a, b) => {
        const diff = candidatePriority(a.difficulty, difficulty) - candidatePriority(b.difficulty, difficulty);
        if (diff !== 0) return diff;
        return b.marks - a.marks;
    });
    const selected = [];
    let marks = 0;
    let remaining = targetMarks;
    while (ordered.length > 0 && remaining > 0) {
        let index = ordered.findIndex(q => q.marks <= remaining);
        if (index === -1) {
            index = ordered.length - 1;
        }
        const question = ordered.splice(index, 1)[0];
        selected.push(question);
        usedIds.add(question.id);
        marks += question.marks;
        remaining = Math.max(0, targetMarks - marks);
    }
    return { questions: selected, marks, shortage: Math.max(0, targetMarks - marks) };
}

function capitalise(word) {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
}

function buildExamDocDefinition(options) {
    const { board, spec, difficulty, totalMarksRequested, totalMarksAssigned, questions, markByTopic, distribution, warnings } = options;
    const docDefinition = { content: [], styles: {} };
    docDefinition.styles.header = {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 8]
    };
    docDefinition.styles.subheader = {
        fontSize: 12,
        bold: true,
        margin: [0, 12, 0, 4]
    };
    docDefinition.styles.note = {
        italics: true,
        color: '#c2410c',
        margin: [0, 0, 0, 4]
    };
    docDefinition.content.push({ text: 'Mock Exam', style: 'header' });
    docDefinition.content.push({ text: `Board: ${BOARD_LABELS[board] || capitalise(board)}`, margin: [0, 4, 0, 0] });
    docDefinition.content.push({ text: `Specification: ${SPEC_LABELS[spec] || spec}`, margin: [0, 0, 0, 0] });
    docDefinition.content.push({ text: `Difficulty: ${capitalise(difficulty)}`, margin: [0, 0, 0, 0] });
    docDefinition.content.push({ text: `Requested Marks: ${totalMarksRequested}`, margin: [0, 0, 0, 0] });
    docDefinition.content.push({ text: `Exam Total: ${totalMarksAssigned}`, margin: [0, 0, 0, 8] });
    const breakdown = Object.keys(markByTopic)
        .filter(topic => markByTopic[topic] > 0)
        .map(topic => {
            const marks = markByTopic[topic];
            const percent = totalMarksAssigned ? Math.round((marks / totalMarksAssigned) * 100) : 0;
            const targetPercent = distribution[topic] ? Math.round(distribution[topic] * 100) : 0;
            return `${TOPIC_LABELS[topic]} – ${marks} marks (${percent}% vs target ${targetPercent}%).`;
        });
    if (breakdown.length > 0) {
        docDefinition.content.push({ text: 'Mark breakdown by topic', style: 'subheader' });
        docDefinition.content.push({ ul: breakdown });
    }
    if (warnings.length > 0) {
        docDefinition.content.push({ text: 'Notes', style: 'subheader' });
        warnings.forEach(note => docDefinition.content.push({ text: note, style: 'note' }));
    }
    questions.forEach((question, index) => {
        docDefinition.content.push({ text: `${index + 1}. (${question.marks} marks) [${TOPIC_LABELS[question.topic]}] ${question.question}`, margin: [0, 6, 0, 0] });
    });
    docDefinition.content.push({ text: '', pageBreak: 'before' });
    docDefinition.content.push({ text: 'Answer Key', style: 'header' });
    questions.forEach((question, index) => {
        docDefinition.content.push({ text: `${index + 1}. ${question.answer}`, margin: [0, 6, 0, 0] });
    });
    return docDefinition;
}

function generateExam() {
    const specSelect = document.getElementById('specSelect');
    const boardSelect = document.getElementById('boardSelect');
    const totalMarksInput = document.getElementById('totalMarks');
    const difficultySelect = document.getElementById('difficultySelect');
    if (!specSelect || !boardSelect || !totalMarksInput || !difficultySelect) {
        return;
    }
    const spec = specSelect.value;
    const board = boardSelect.value;
    const totalMarks = parseInt(totalMarksInput.value, 10) || 0;
    const difficulty = difficultySelect.value;
    if (totalMarks <= 0) {
        alert('Please enter a positive total mark value.');
        return;
    }
    const { raw: topicWeights, normalised, warnings: topicWarnings, supportedTopics } = collectTopicWeights(spec);
    const warnings = [...topicWarnings];
    const activeTopics = supportedTopics.filter(topic => normalised[topic] > 0);
    if (activeTopics.length === 0) {
        alert('No valid topics remain for the chosen syllabus. Adjust the topic distribution.');
        return;
    }
    const usedIds = new Set();
    const selectedQuestions = [];
    const markByTopic = {};
    let assignedMarks = 0;
    let remainingMarks = totalMarks;
    const topicTargets = {};
    const sortedTopics = [...activeTopics].sort((a, b) => normalised[b] - normalised[a]);
    sortedTopics.forEach((topic, index) => {
        let target = Math.round(totalMarks * normalised[topic]);
        target = Math.min(target, Math.max(0, remainingMarks));
        if (index === sortedTopics.length - 1) {
            target = Math.max(0, remainingMarks);
        }
        topicTargets[topic] = target;
        remainingMarks -= target;
    });
    Object.keys(topicTargets).forEach(topic => {
        const target = topicTargets[topic];
        if (target <= 0) {
            return;
        }
        const result = selectQuestionsForTopic(topic, target, difficulty, spec, usedIds);
        selectedQuestions.push(...result.questions);
        assignedMarks += result.marks;
        markByTopic[topic] = (markByTopic[topic] || 0) + result.marks;
        if (result.shortage > 0) {
            warnings.push(`Only ${result.marks} of the requested ${target} marks were available for ${TOPIC_LABELS[topic]}.`);
        }
    });
    if (assignedMarks < totalMarks) {
        const additional = selectAdditionalQuestions(totalMarks - assignedMarks, difficulty, spec, usedIds);
        selectedQuestions.push(...additional.questions);
        assignedMarks += additional.marks;
        additional.questions.forEach(question => {
            markByTopic[question.topic] = (markByTopic[question.topic] || 0) + question.marks;
        });
        if (additional.shortage > 0) {
            warnings.push(`The generated paper totals ${assignedMarks} marks because the bank does not yet contain enough ${difficulty} questions for this syllabus.`);
        }
    }
    if (selectedQuestions.length === 0) {
        alert('No questions were available for this specification and difficulty. Try a different combination.');
        return;
    }
    if (assignedMarks > totalMarks) {
        warnings.push(`The paper totals ${assignedMarks} marks, which is slightly higher than requested to preserve whole-question mark values.`);
    }
    const docDefinition = buildExamDocDefinition({
        board,
        spec,
        difficulty,
        totalMarksRequested: totalMarks,
        totalMarksAssigned: assignedMarks,
        questions: selectedQuestions,
        markByTopic,
        distribution: normalised,
        warnings
    });
    pdfMake.createPdf(docDefinition).download('mock_exam.pdf');
    if (warnings.length > 0) {
        alert(warnings.join('\n'));
    }
}

function describeCurrentDistribution(spec, totalMarks) {
    const { raw, normalised, warnings } = collectTopicWeights(spec);
    const parts = Object.keys(normalised)
        .filter(topic => normalised[topic] > 0)
        .map(topic => {
            const marks = Math.round(normalised[topic] * totalMarks);
            return `${TOPIC_LABELS[topic]} ≈ ${marks} marks (${Math.round(normalised[topic] * 100)}%).`;
        });
    return { description: parts.length ? parts.join(' ') : 'No marks allocated yet.', warnings };
}

const TOPIC_RECOMMENDATIONS = {
    igcse_math_a: 'Aim for roughly 30% Algebra, 25% Geometry, 20% Trigonometry and 25% Statistics to reflect typical IGCSE papers.',
    intl_gcse_math: 'Balance Algebra (30%), Geometry (25%), Trigonometry (20%) and Statistics (25%) for an even coverage.',
    as_math: 'Try 30% Algebra, 20% Trigonometry, 20% Calculus and the rest split between Geometry and Statistics.',
    a_level_math: 'Weight Calculus and Algebra at about 30% each, with remaining marks across Trigonometry, Vectors/Geometry and Statistics.',
    further_math: 'Use 30% Calculus, 30% Advanced Algebra/Matrices, 20% Trigonometry and 20% Statistics & Modelling as a starting point.'
};

function buildAssistantResponse(message) {
    const lower = message.toLowerCase();
    const specSelect = document.getElementById('specSelect');
    const boardSelect = document.getElementById('boardSelect');
    const totalMarksInput = document.getElementById('totalMarks');
    const difficultySelect = document.getElementById('difficultySelect');
    const spec = specSelect ? specSelect.value : 'igcse_math_a';
    const board = boardSelect ? boardSelect.value : 'edexcel';
    const totalMarks = parseInt(totalMarksInput ? totalMarksInput.value : '0', 10) || 0;
    const difficulty = difficultySelect ? difficultySelect.value : 'medium';
    const specLabel = SPEC_LABELS[spec] || spec;
    if (lower.includes('syllabus')) {
        const summary = SYLLABUS_SUMMARY[spec] || 'The generator maps each question to its syllabus tags before selection.';
        return `For ${specLabel}, the generator only draws from questions tagged to that syllabus. ${summary}`;
    }
    if (lower.includes('mark')) {
        const { description, warnings } = describeCurrentDistribution(spec, totalMarks || 100);
        const notes = warnings.length ? ` Note: ${warnings.join(' ')}` : '';
        return `With the current settings the marks will distribute as: ${description}${notes}`;
    }
    if (lower.includes('intense') || (lower.includes('difficulty') && lower.includes('explain'))) {
        return `Intense difficulty leans on the extended-response tasks in the bank, capped at 30 marks each. ${DIFFICULTY_DESCRIPTIONS.intense}`;
    }
    if (lower.includes('recommend') || lower.includes('suggest')) {
        return TOPIC_RECOMMENDATIONS[spec] || 'Adjust the sliders so that the syllabus priorities you want receive the highest percentages.';
    }
    if (lower.includes('warning') || lower.includes('issue') || lower.includes('problem')) {
        const { warnings } = collectTopicWeights(spec);
        return warnings.length ? warnings.join(' ') : 'No distribution issues detected—your current setup is ready to generate.';
    }
    const difficultyDescription = DIFFICULTY_DESCRIPTIONS[difficulty] || '';
    return `You are building a ${capitalise(difficulty)} paper for ${BOARD_LABELS[board] || board} (${specLabel}). ${difficultyDescription} Ask about the syllabus or marks if you would like more detail.`;
}

function initExamAssistant() {
    const transcript = document.getElementById('assistantTranscript');
    const form = document.getElementById('assistantForm');
    const input = document.getElementById('assistantInput');
    const suggestionButtons = document.querySelectorAll('.assistant-suggestion');
    if (!transcript || !form || !input) {
        return;
    }
    function appendMessage(author, text) {
        const wrapper = document.createElement('div');
        wrapper.className = `assistant-message ${author}`;
        const heading = document.createElement('strong');
        heading.textContent = author === 'user' ? 'You' : 'Coach';
        const body = document.createElement('p');
        body.textContent = text;
        wrapper.appendChild(heading);
        wrapper.appendChild(body);
        transcript.appendChild(wrapper);
        transcript.scrollTop = transcript.scrollHeight;
    }
    function handleMessage(rawMessage) {
        const message = rawMessage.trim();
        if (!message) {
            return;
        }
        appendMessage('user', message);
        const response = buildAssistantResponse(message);
        appendMessage('assistant', response);
    }
    form.addEventListener('submit', event => {
        event.preventDefault();
        handleMessage(input.value);
        input.value = '';
        input.focus();
    });
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const message = button.getAttribute('data-assistant-message') || '';
            handleMessage(message);
        });
    });
    appendMessage('assistant', 'Hi! I\'m your exam design coach. Ask about syllabus coverage, mark splits or the new Intense difficulty any time.');
}

document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateExamButton');
    if (generateButton) {
        generateButton.addEventListener('click', generateExam);
    }
    const specSelect = document.getElementById('specSelect');
    const boardSelect = document.getElementById('boardSelect');
    const totalMarksInput = document.getElementById('totalMarks');
    const DEFAULT_MARKS = {
        edexcel: { igcse_math_a: 100, intl_gcse_math: 100, as_math: 100, a_level_math: 200, further_math: 200 },
        cambridge: { igcse_math_a: 80, intl_gcse_math: 100, as_math: 100, a_level_math: 200, further_math: 200 },
        aqa: { igcse_math_a: 100, intl_gcse_math: 100, as_math: 100, a_level_math: 150, further_math: 200 },
        ocr: { igcse_math_a: 100, intl_gcse_math: 100, as_math: 100, a_level_math: 200, further_math: 200 },
        wjec: { igcse_math_a: 100, intl_gcse_math: 100, as_math: 100, a_level_math: 180, further_math: 200 }
    };
    function updateDefaultMarks() {
        if (!specSelect || !boardSelect || !totalMarksInput) {
            return;
        }
        const board = boardSelect.value;
        const spec = specSelect.value;
        const boardDefaults = DEFAULT_MARKS[board] || {};
        const defaultMarks = boardDefaults[spec] || 100;
        totalMarksInput.value = defaultMarks;
    }
    if (specSelect && boardSelect) {
        specSelect.addEventListener('change', updateDefaultMarks);
        boardSelect.addEventListener('change', updateDefaultMarks);
        updateDefaultMarks();
    }
    initExamAssistant();
});
