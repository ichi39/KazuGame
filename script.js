// Pokémon Type Data (Gen 9)
// 2.0 = Super Effective, 0.5 = Not Very Very Effective, 0.0 = No Effect
const TYPE_DATA = {
    normal: {
        label: 'ノーマル',
        weak: ['fighting'],
        resist: [],
        immune: ['ghost']
    },
    fire: {
        label: 'ほのお',
        weak: ['water', 'ground', 'rock'],
        resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
        immune: []
    },
    water: {
        label: 'みず',
        weak: ['electric', 'grass'],
        resist: ['fire', 'water', 'ice', 'steel'],
        immune: []
    },
    electric: {
        label: 'でんき',
        weak: ['ground'],
        resist: ['electric', 'flying', 'steel'],
        immune: []
    },
    grass: {
        label: 'くさ',
        weak: ['fire', 'ice', 'poison', 'flying', 'bug'],
        resist: ['water', 'electric', 'grass', 'ground'],
        immune: []
    },
    ice: {
        label: 'こおり',
        weak: ['fire', 'fighting', 'rock', 'steel'],
        resist: ['ice'],
        immune: []
    },
    fighting: {
        label: 'かくとう',
        weak: ['flying', 'psychic', 'fairy'],
        resist: ['bug', 'rock', 'dark'],
        immune: []
    },
    poison: {
        label: 'どく',
        weak: ['ground', 'psychic'],
        resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
        immune: []
    },
    ground: {
        label: 'じめん',
        weak: ['water', 'grass', 'ice'],
        resist: ['poison', 'rock'],
        immune: ['electric']
    },
    flying: {
        label: 'ひこう',
        weak: ['electric', 'ice', 'rock'],
        resist: ['grass', 'fighting', 'bug'],
        immune: ['ground']
    },
    psychic: {
        label: 'エスパー',
        weak: ['bug', 'ghost', 'dark'],
        resist: ['fighting', 'psychic'],
        immune: []
    },
    bug: {
        label: 'むし',
        weak: ['fire', 'flying', 'rock'],
        resist: ['grass', 'fighting', 'ground'],
        immune: []
    },
    rock: {
        label: 'いわ',
        weak: ['water', 'grass', 'fighting', 'ground', 'steel'],
        resist: ['normal', 'fire', 'poison', 'flying'],
        immune: []
    },
    ghost: {
        label: 'ゴースト',
        weak: ['ghost', 'dark'],
        resist: ['poison', 'bug'],
        immune: ['normal', 'fighting']
    },
    dragon: {
        label: 'ドラゴン',
        weak: ['ice', 'dragon', 'fairy'],
        resist: ['fire', 'water', 'electric', 'grass'],
        immune: []
    },
    dark: {
        label: 'あく',
        weak: ['fighting', 'bug', 'fairy'],
        resist: ['ghost', 'dark'],
        immune: ['psychic']
    },
    steel: {
        label: 'はがね',
        weak: ['fire', 'fighting', 'ground'],
        resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
        immune: ['poison']
    },
    fairy: {
        label: 'フェアリー',
        weak: ['poison', 'steel'],
        resist: ['fighting', 'bug', 'dark'],
        immune: ['dragon']
    }
};

// Game State
let currentScore = 0;
let questionCount = 0;
const MAX_QUESTIONS = 10;
let currentQuestion = null;
let currentMode = 'normal'; // 'normal' or 'hard'

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startNormalBtn = document.getElementById('start-normal-btn');
const startHardBtn = document.getElementById('start-hard-btn');
const restartBtn = document.getElementById('restart-btn');
const optionsContainer = document.getElementById('options-container');
const targetTypeIcon = document.getElementById('target-type-icon');
const questionText = document.getElementById('question-text');
const feedbackDisplay = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score-display');
const countDisplay = document.getElementById('question-count');
const submitBtn = document.getElementById('submit-btn'); // For Hard Mode

// Event Listeners
startNormalBtn.addEventListener('click', () => startGame('normal'));
startHardBtn.addEventListener('click', () => startGame('hard'));
restartBtn.addEventListener('click', () => showScreen('start'));
submitBtn.addEventListener('click', submitHardAnswer);

function startGame(mode) {
    currentMode = mode;
    currentScore = 0;
    questionCount = 0;
    showScreen('quiz');

    // Adjust UI for mode
    if (currentMode === 'hard') {
        optionsContainer.className = 'options-grid hard-mode';
        submitBtn.classList.remove('hidden');
    } else {
        optionsContainer.className = 'options-grid';
        submitBtn.classList.add('hidden');
    }

    nextQuestion();
}

function showScreen(screenName) {
    startScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');

    if (screenName === 'start') startScreen.classList.remove('hidden');
    else if (screenName === 'quiz') quizScreen.classList.remove('hidden');
    else if (screenName === 'result') resultScreen.classList.remove('hidden');
}

function nextQuestion() {
    questionCount++;
    if (questionCount > MAX_QUESTIONS) {
        endGame();
        return;
    }

    // Update HUD
    scoreDisplay.textContent = `スコア: ${currentScore}`;
    countDisplay.textContent = `もんだい: ${questionCount}/${MAX_QUESTIONS}`;
    feedbackDisplay.textContent = '';
    feedbackDisplay.className = 'feedback hidden';

    // Reset Hard Mode UI
    if (currentMode === 'hard') {
        submitBtn.disabled = false;
    }

    generateQuestion();
}

function generateQuestion() {
    const keys = Object.keys(TYPE_DATA);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const targetType = TYPE_DATA[randomKey];

    // Randomize Question Type
    // 0: Super Effective (Weakness)
    // 1: Not Very Effective (Resistance)
    // 2: No Effect (Immunity) - Check if exists first

    let qTypes = ['weak', 'resist'];
    if (targetType.immune && targetType.immune.length > 0) {
        qTypes.push('immune');
    }

    const qType = qTypes[Math.floor(Math.random() * qTypes.length)];

    let correctAnswers = [];
    let questionLabel = "";

    if (qType === 'weak') {
        correctAnswers = targetType.weak;
        questionLabel = "こうかは ばつぐん（2倍）なのは？";
    } else if (qType === 'resist') {
        correctAnswers = targetType.resist;
        questionLabel = "こうかは いまひとつ（0.5倍）なのは？";
    } else if (qType === 'immune') {
        correctAnswers = targetType.immune;
        questionLabel = "こうかは ない（0倍）のは？";
    }

    currentQuestion = {
        target: randomKey,
        targetLabel: targetType.label,
        qType: qType,
        correctAnswers: correctAnswers
    };

    // UI Update
    targetTypeIcon.textContent = targetType.label;
    targetTypeIcon.className = `type-icon type-${randomKey}`;
    questionText.textContent = `${targetType.label}に ${questionLabel}`;

    // Generate Options
    let totalOptions = currentMode === 'hard' ? 9 : 4;
    let options = [];

    if (currentMode === 'normal') {
        // Normal Mode: 1 Correct, 3 Wrong
        if (correctAnswers.length === 0) {
            // Should not happen with current logic filters, but safe fallback
            nextQuestion();
            return;
        }
        const correct = correctAnswers[Math.floor(Math.random() * correctAnswers.length)];
        options.push(correct);

        while (options.length < 4) {
            const rand = keys[Math.floor(Math.random() * keys.length)];
            if (!options.includes(rand) && !correctAnswers.includes(rand)) {
                options.push(rand);
            }
        }
    } else {
        // Hard Mode: ALL Correct answers included + fillers up to 9
        // If correct answers > 9 (rare/impossible), just take 9
        options = [...correctAnswers];

        while (options.length < totalOptions) {
            const rand = keys[Math.floor(Math.random() * keys.length)];
            if (!options.includes(rand)) { // Can duplicate if pool is small, but types are 18
                options.push(rand);
            }
        }
        // If we have more than 9 correct answers (not possible in Pokemon), slice it
        if (options.length > totalOptions) options = options.slice(0, totalOptions);
    }

    shuffleArray(options);

    // Render Options
    optionsContainer.innerHTML = '';
    options.forEach(typeKey => {
        const btn = document.createElement('button');
        btn.className = `option-btn type-${typeKey}`;
        btn.dataset.type = typeKey;
        btn.textContent = TYPE_DATA[typeKey].label;

        if (currentMode === 'normal') {
            btn.addEventListener('click', () => handleNormalAnswer(typeKey));
        } else {
            btn.addEventListener('click', (e) => toggleHardOption(e.target));
        }

        optionsContainer.appendChild(btn);
    });
}

function handleNormalAnswer(selectedType) {
    // Disable all buttons
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = currentQuestion.correctAnswers.includes(selectedType);

    if (isCorrect) {
        currentScore += 10;
        feedbackDisplay.textContent = 'せいかい！';
        feedbackDisplay.className = 'feedback correct';
    } else {
        feedbackDisplay.textContent = 'ざんねん...';
        feedbackDisplay.className = 'feedback wrong';
        // Highlight correct answer if present
        buttons.forEach(btn => {
            if (currentQuestion.correctAnswers.includes(btn.dataset.type)) {
                btn.classList.add('dimmed'); // Dim others?
                btn.style.border = "4px solid #FFD700";
                btn.style.transform = "scale(1.1)";
            } else {
                btn.style.opacity = "0.5";
            }
        });
    }

    setTimeout(nextQuestion, 1500);
}

function toggleHardOption(btn) {
    if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        btn.style.border = 'none';
        btn.style.transform = 'none';
    } else {
        btn.classList.add('selected');
        btn.style.border = '4px solid #333';
        btn.style.transform = 'scale(0.95)';
    }
}

function submitHardAnswer() {
    submitBtn.disabled = true;
    const selectedBtns = Array.from(optionsContainer.querySelectorAll('.selected'));
    const selectedTypes = selectedBtns.map(btn => btn.dataset.type);

    // Logic: MUST select ALL correct answers and NO wrong answers
    // 1. Check if all selected are correct
    const noWrongSelected = selectedTypes.every(t => currentQuestion.correctAnswers.includes(t));
    // 2. Check if all correct are selected
    const allCorrectSelected = currentQuestion.correctAnswers.every(t => selectedTypes.includes(t));

    const isPerfect = noWrongSelected && allCorrectSelected;

    if (isPerfect) {
        currentScore += 20; // Hard mode bonus
        feedbackDisplay.textContent = 'パーフェクト！';
        feedbackDisplay.className = 'feedback correct';
    } else {
        // Detailed feedback
        if (!noWrongSelected) feedbackDisplay.textContent = 'まちがいがあるよ...';
        else if (!allCorrectSelected) feedbackDisplay.textContent = 'たりないよ...';
        feedbackDisplay.className = 'feedback wrong';

        // Show answers
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            const type = btn.dataset.type;
            if (currentQuestion.correctAnswers.includes(type)) {
                btn.style.border = "4px solid #FFD700"; // Correct
            } else if (selectedTypes.includes(type)) {
                btn.style.opacity = "0.3"; // Wrongly selected
            }
        });
    }

    setTimeout(nextQuestion, 2000);
}

function endGame() {
    showScreen('result');
    document.getElementById('final-score').textContent = `あなたのスコア: ${currentScore}点`;

    // Calculate max possible score based on mode
    const MAX_SCORE = currentMode === 'hard' ? 200 : 100;

    let msg = "";
    if (currentScore === MAX_SCORE) {
        msg = "すごい！ ポケモンマスターだ！";
    } else if (currentScore >= MAX_SCORE * 0.8) {
        msg = "あとちょっと！ ジムリーダーレベル！";
    } else {
        msg = "もっとべんきょうしよう！";
    }

    document.getElementById('result-message').textContent = msg;
}

// Utility
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
