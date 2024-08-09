const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

const boardSize = 40;
let snake = [{ x: 20, y: 20, direction: 'right' }];
let food = { x: 25, y: 25 };
let direction = { x: 1, y: 0 }; // Default starting direction
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let speed = 200; // Starting speed in milliseconds
let gameInterval;

highScoreElement.textContent = highScore;

const createBoard = () => {
    gameBoard.innerHTML = ''; // Clear any existing cells
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }
};

const getDirectionClass = (dir) => {
    if (dir.x === 1 && dir.y === 0) return 'right';
    if (dir.x === -1 && dir.y === 0) return 'left';
    if (dir.x === 0 && dir.y === -1) return 'up';
    if (dir.x === 0 && dir.y === 1) return 'down';
};

const updateBoard = () => {
    document.querySelectorAll('.cell').forEach((cell, i) => {
        const x = i % boardSize;
        const y = Math.floor(i / boardSize);
        cell.classList.remove('snake-head', 'snake-body', 'food', 'right', 'left', 'up', 'down');
        if (snake.some((segment, index) => segment.x === x && segment.y === y)) {
            const segmentIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
            const dirClass = getDirectionClass(segmentIndex === 0 ? direction : snake[segmentIndex].direction);
            cell.classList.add(segmentIndex === 0 ? 'snake-head' : 'snake-body');
            cell.classList.add(dirClass);
        } else if (food.x === x && food.y === y) {
            cell.classList.add('food');
        }
    });
};

const updateFoodPosition = () => {
    food = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
    };
};

const moveSnake = () => {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y, direction: getDirectionClass(direction) };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('highScore', highScore);
        }
        updateFoodPosition();
        if (score % 10 === 0) {
            speed = Math.max(50, speed - 20); // Increase speed every 10 points
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
        }
    } else {
        snake.pop();
    }
};

const checkCollision = () => {
    const head = snake[0];
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
    }
};

const gameOver = () => {
    clearInterval(gameInterval);
    const gameOverScreen = document.createElement('div');
    gameOverScreen.classList.add('game-over');
    gameOverScreen.textContent = 'GAME OVER';
    gameBoard.appendChild(gameOverScreen);
    let growing = true;
    let size = 100;
    const gameOverInterval = setInterval(() => {
        size += growing ? 5 : -5;
        if (size >= 200 || size <= 100) growing = !growing;
        gameOverScreen.style.width = `${size}px`;
        gameOverScreen.style.height = `${size}px`;
    }, 100);

    setTimeout(() => {
        clearInterval(gameOverInterval);
        gameBoard.removeChild(gameOverScreen);
        resetGame();
    }, 3000); // Show game over animation for 3 seconds
};

const resetGame = () => {
    snake = [{ x: 20, y: 20, direction: 'right' }];
    direction = { x: 1, y: 0 }; // Reset direction
    score = 0;
    speed = 200;
    scoreElement.textContent = score;
    updateFoodPosition();
    updateBoard();
};

const gameLoop = () => {
    moveSnake();
    checkCollision();
    updateBoard();
};

const startGame = () => {
    direction = { x: 1, y: 0 }; // Ensure direction is reset at start
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
};

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

createBoard();
updateBoard();
