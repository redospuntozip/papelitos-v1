
let words = [];
let remainingWords = [];
let guessedWords = [];
let currentWord = '';
let timer;
let timeLeft = 60;
let waitTime = 15;

function generateFields() {
    const numWords = parseInt(document.getElementById('numWords').value);
    const form = document.getElementById('wordForm');
    form.innerHTML = '';
    for (let i = 0; i < numWords; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'word';
        input.required = true;
        input.placeholder = `Palabra ${i + 1}`;
        form.appendChild(input);
        form.appendChild(document.createElement('br'));
    }
    const startBtn = document.createElement('button');
    startBtn.type = 'submit';
    startBtn.textContent = 'Empezar juego';
    form.appendChild(startBtn);
}

function startGame(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    words = Array.from(formData.getAll('word'));
    remainingWords = [...words];
    guessedWords = [];
    document.getElementById('input-section').classList.add('hidden');
    document.getElementById('game-section').classList.remove('hidden');
    startRound();
}

function startRound() {
    timeLeft = 60;
    document.getElementById('timer').textContent = `Tiempo: ${timeLeft}`;
    nextWord();

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Tiempo: ${timeLeft}`;
        if (guessedWords.length === words.length) {
            clearInterval(timer);
            showEndGameButtons();
        } else if (timeLeft === 0) {
            clearInterval(timer);
            endRound();
        }
    }, 1000);
}

function nextWord() {
    if (remainingWords.length === 0) {
        document.getElementById('currentWord').textContent = '¡No hay más palabras!';
        return;
    }
    const index = Math.floor(Math.random() * remainingWords.length);
    currentWord = remainingWords[index];
    document.getElementById('currentWord').textContent = currentWord;
}

function markGuessed() {
    remainingWords = remainingWords.filter(word => word !== currentWord);
    guessedWords.push(currentWord);
    if (guessedWords.length === words.length) {
        clearInterval(timer);
        showEndGameButtons();
    } else {
        nextWord();
    }
}

function skipWord() {
    nextWord();
}

function endRound() {
    let countdown = waitTime;
    document.getElementById('currentWord').textContent = `⏱ Fin de la ronda. Siguiente ronda en ${countdown}...`;
    const interval = setInterval(() => {
        countdown--;
        document.getElementById('currentWord').textContent = `⏱ Fin de la ronda. Siguiente ronda en ${countdown}...`;
        if (countdown === 0) {
            clearInterval(interval);
            startRound();
        }
    }, 1000);
}

function showEndGameButtons() {
    document.getElementById('timer').textContent = '⏳ Tiempo detenido';
    document.getElementById('currentWord').textContent = '🎉 ¡Has acertado todas las palabras!';
    document.getElementById('guessedBtn').classList.add('hidden');
    document.getElementById('skipBtn').classList.add('hidden');

    const replayBtn = document.createElement('button');
    replayBtn.textContent = '🔁 Repetir con mismas palabras';
    replayBtn.onclick = () => {
        remainingWords = [...words];
        guessedWords = [];
        replayBtn.remove();
        newGameBtn.remove();
        document.getElementById('guessedBtn').classList.remove('hidden');
        document.getElementById('skipBtn').classList.remove('hidden');
        startRound();
    };

    const newGameBtn = document.createElement('button');
    newGameBtn.textContent = '🆕 Nueva partida';
    newGameBtn.onclick = () => {
        location.reload();
    };

    document.getElementById('game-section').appendChild(replayBtn);
    document.getElementById('game-section').appendChild(newGameBtn);
}
