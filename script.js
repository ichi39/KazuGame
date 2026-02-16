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

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const optionsContainer = document.getElementById('options-container');
const targetTypeIcon = document.getElementById('target-type-icon');
const questionText = document.getElementById('question-text');
const feedbackDisplay = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score-display');
const countDisplay = document.getElementById('question-count');

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
    currentScore = 0;
    questionCount = 0;
    showScreen('quiz');
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

    generateQuestion();
}

function generateQuestion() {
    const keys = Object.keys(TYPE_DATA);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const targetType = TYPE_DATA[randomKey];

    // Decide question type (Weakness or Resistance?) 
    // For now, let's focus on WEAKNESS (Super Effective) as the primary mode
    // Meaning: "Here is a Fire Pokemon. What is super effective against it?"
    
    currentQuestion = {
        target: randomKey,
        targetLabel: targetType.label,
        correctAnswers: targetType.weak // Array of types that are super effective against target
    };

    // UI Update
    targetTypeIcon.textContent = targetType.label;
    targetTypeIcon.className = `type-icon type-${randomKey}`;
    questionText.textContent = `${targetType.label}に こうかは ばつぐん なのは？`;

    // Generate Options
    // We need at least 1 correct answer and 3 wrong answers
    if (currentQuestion.correctAnswers.length === 0) {
        // Fallback for types with no weaknesses? (Eelektross lol, but standard types all have weaknesses)
        // Saberleye used to have none before fairy.
        // In standard Gen 9, everything has a weakness.
        // Just in case logic catch
        console.warn("Type has no weakness?", randomKey);
        nextQuestion(); 
        return;
    }

    const correct = currentQuestion.correctAnswers[Math.floor(Math.random() * currentQuestion.correctAnswers.length)];
    
    // Pick 3 wrong answers
    const wrongs = [];
    while (wrongs.length < 3) {
        const rand = keys[Math.floor(Math.random() * keys.length)];
        // Must not be in correctAnswers and not already in wrongs
        if (!currentQuestion.correctAnswers.includes(rand) && !wrongs.includes(rand)) {
            wrongs.push(rand);
        }
    }

    // Combine and shuffle
    const options = [correct, ...wrongs];
    shuffleArray(options);

    // Render Options
    optionsContainer.innerHTML = '';
    options.forEach(typeKey => {
        const btn = document.createElement('button');
        btn.className = `option-btn type-${typeKey}`;
        btn.textContent = TYPE_DATA[typeKey].label;
        btn.addEventListener('click', () => handleAnswer(typeKey, correct));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedType, correctType) {
    // Disable all buttons to prevent double clicking
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = currentQuestion.correctAnswers.includes(selectedType);

    if (isCorrect) {
        currentScore += 10; // Simple scoring
        feedbackDisplay.textContent = 'せいかい！';
        feedbackDisplay.className = 'feedback correct';
        // Play sound effect placeholder
    } else {
        feedbackDisplay.textContent = 'ざんねん...';
        feedbackDisplay.className = 'feedback wrong';
        // Highlight correct answer
        buttons.forEach(btn => {
            if (currentQuestion.correctAnswers.includes(btn.className.split('type-')[1])) {
                btn.style.border = "4px solid yellow";
                btn.style.transform = "scale(1.1)";
            }
        });
    }

    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function endGame() {
    showScreen('result');
    document.getElementById('final-score').textContent = `あなたのスコア: ${currentScore}点`;
    
    let msg = "";
    if (currentScore === MAX_QUESTIONS * 10) msg = "すごい！ ポケモンマスターだ！";
    else if (currentScore >= MAX_QUESTIONS * 8) msg = "あとちょっと！ ジムリーダーレベル！";
    else msg = "もっとべんきょうしよう！";
    
    document.getElementById('result-message').textContent = msg;
}

// Utility
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
