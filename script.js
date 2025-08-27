let words = [];
let currentIndex = 0;
let timer;
let timeLeft = 60;

function generateFields() {
    const numWords = parseInt(document.getElementById("numWords").value);
    const form = document.getElementById("wordForm");
    form.innerHTML = '';
    for (let i = 0; i < numWords; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Palabra ${i + 1}`;
        input.required = true;
        input.name = `word${i}`;
        form.appendChild(input);
        form.appendChild(document.createElement("br"));
    }
    const startBtn = document.createElement("button");
    startBtn.type = "submit";
    startBtn.textContent = "Comenzar juego";
    form.appendChild(startBtn);
}

function startGame(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll("#wordForm input[type='text']");
    words = Array.from(inputs).map(input => input.value.trim()).filter(w => w !== "");
    shuffleArray(words);
    currentIndex = 0;
    timeLeft = 60;
    document.getElementById("input-section").classList.add("hidden");
    document.getElementById("game-section").classList.remove("hidden");
    document.getElementById("currentWord").textContent = words[currentIndex];
    startTimer();
}

function nextWord() {
    currentIndex++;
    if (currentIndex < words.length) {
        document.getElementById("currentWord").textContent = words[currentIndex];
    } else {
        endGame("¡Juego terminado!");
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Tiempo: ${timeLeft}`;
        if (timeLeft <= 0) {
            endGame("¡Tiempo terminado!");
        }
    }, 1000);
}

function endGame(message) {
    clearInterval(timer);
    document.getElementById("currentWord").textContent = message;
    document.getElementById("nextBtn").disabled = true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
