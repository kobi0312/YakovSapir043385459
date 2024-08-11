let word = '';
let guessedLetters = [];
let wrongLetters = [];
let remainingGuesses = 6;
let isSinglePlayer = true;

const words = ["astronaut", "dolphin", "volcano", "pyramid", "giraffe", "chocolate", "sapphire", "kaleidoscope", "elephant", "hurricane", "waterfall", "mystery", "butterfly", "galaxy", "whisper", "jungle", "bicycle", "enchanted", "treasure", "rainbow"];


const wordDisplay = document.getElementById('word-display');
const wrongLettersDisplay = document.getElementById('wrong-letters');
const endMessageDisplay = document.getElementById('end-message');
const letterInput = document.getElementById('letter-input');
const gameContainer = document.getElementById('game-container');
const restartButton = document.getElementById('restart');
const gameMode = document.getElementById('game-mode');
const hangmanCanvas = document.getElementById('hangman-canvas');
const ctx = hangmanCanvas.getContext('2d');

function startSinglePlayer() {
    isSinglePlayer = true;
    word = words[Math.floor(Math.random() * words.length)];
    startGame();
}

function startTwoPlayers() {
    isSinglePlayer = false;
    word = prompt("Player 1, please enter a word:").toLowerCase();
    startGame();
}

function startGame() {
    guessedLetters = [];
    wrongLetters = [];
    remainingGuesses = 6;
    clearCanvas();
    updateDisplay();
    gameMode.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    endMessageDisplay.classList.add('hidden');
    letterInput.focus();
}

function updateDisplay() {
    const displayWord = word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    wordDisplay.innerText = displayWord;
    wrongLettersDisplay.innerText = `Wrong Letters: ${wrongLetters.join(', ')}`;
    if (remainingGuesses <= 0) {
        endMessageDisplay.innerText = `Game Over! The word was ${word}.`;
        endMessageDisplay.classList.remove('hidden');
        animateEndMessage();
        animateHangman();
        endGame();
    } else if (displayWord.split(' ').join('') === word) {
        endMessageDisplay.innerText = "Congratulations! You've guessed the word!";
        endMessageDisplay.classList.remove('hidden');
        animateEndMessage();
        endGame();
    }
}

function guessLetter() {
    const letter = letterInput.value.toLowerCase();
    letterInput.value = '';
    if (!letter || guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
        return;
    }
    if (word.includes(letter)) {
        guessedLetters.push(letter);
    } else {
        wrongLetters.push(letter);
        remainingGuesses--;
        drawHangman();
    }
    updateDisplay();
}

function drawHangman() {
    switch (remainingGuesses) {
        case 5:
            drawHead();
            break;
        case 4:
            drawBody();
            break;
        case 3:
            drawLeftArm();
            break;
        case 2:
            drawRightArm();
            break;
        case 1:
            drawLeftLeg();
            break;
        case 0:
            drawRightLeg();
            break;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    drawBase();
}

function drawBase() {
    ctx.beginPath();
    ctx.moveTo(10, 190);
    ctx.lineTo(190, 190);
    ctx.moveTo(30, 190);
    ctx.lineTo(30, 10);
    ctx.lineTo(100, 10);
    ctx.lineTo(100, 30);
    ctx.stroke();
}

function drawHead() {
    ctx.beginPath();
    ctx.arc(100, 50, 20, 0, Math.PI * 2, true);
    ctx.stroke();
}

function drawBody() {
    ctx.beginPath();
    ctx.moveTo(100, 70);
    ctx.lineTo(100, 130);
    ctx.stroke();
}

function drawLeftArm() {
    ctx.beginPath();
    ctx.moveTo(100, 90);
    ctx.lineTo(60, 110);
    ctx.stroke();
}

function drawRightArm() {
    ctx.beginPath();
    ctx.moveTo(100, 90);
    ctx.lineTo(140, 110);
    ctx.stroke();
}

function drawLeftLeg() {
    ctx.beginPath();
    ctx.moveTo(100, 130);
    ctx.lineTo(70, 170);
    ctx.stroke();
}

function drawRightLeg() {
    ctx.beginPath();
    ctx.moveTo(100, 130);
    ctx.lineTo(130, 170);
    ctx.stroke();
}

function animateEndMessage() {
    endMessageDisplay.style.animation = 'grow 1s forwards';
}

function animateHangman() {
    hangmanCanvas.style.animation = 'swing 1s infinite alternate';
}

function endGame() {
    letterInput.disabled = true;
    restartButton.classList.remove('hidden');
}

function restartGame() {
    letterInput.disabled = false;
    restartButton.classList.add('hidden');
    gameMode.classList.remove('hidden');
    gameContainer.classList.add('hidden');
    wordDisplay.innerText = '';
    wrongLettersDisplay.innerText = '';
    endMessageDisplay.innerText = '';
    endMessageDisplay.style.animation = '';
    hangmanCanvas.style.animation = '';
}

letterInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        guessLetter();
    }
});
