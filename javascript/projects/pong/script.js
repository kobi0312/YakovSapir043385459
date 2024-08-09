document.addEventListener('DOMContentLoaded', function () {
    const game = document.getElementById('game');
    const paddlePlayer = document.getElementById('paddle-player');
    const paddleAi = document.getElementById('paddle-ai');
    const ball = document.getElementById('ball');
    const score = document.getElementById('score');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const levelSelect = document.getElementById('levelSelect');
    const bgColorSelect = document.getElementById('bgColorSelect');

    let gameWidth = game.offsetWidth;
    let gameHeight = game.offsetHeight;
    let paddleHeight = paddlePlayer.offsetHeight;
    let ballSize = ball.offsetWidth;
    let paddlePlayerY = (gameHeight - paddleHeight) / 2;
    let paddleAiY = paddlePlayerY;
    let ballX = (gameWidth - ballSize) / 2;
    let ballY = (gameHeight - ballSize) / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 4;
    let playerScore = 0;
    let aiScore = 0;
    let gameInterval;
    let isPaused = true;

    function update() {
        movePaddlePlayer();
        movePaddleAi();
        moveBall();
        checkCollision();
        updateScore();
    }

    function startGame() {
        if (isPaused) {
            gameInterval = setInterval(update, 1000 / 60);
            startPauseBtn.textContent = 'Pause';
        } else {
            clearInterval(gameInterval);
            startPauseBtn.textContent = 'Start';
        }
        isPaused = !isPaused;
    }

    function setDifficulty() {
        const level = levelSelect.value;
        switch (level) {
            case 'easy':
                ballSpeedX = 4;
                ballSpeedY = 4;
                break;
            case 'medium':
                ballSpeedX = 6;
                ballSpeedY = 6;
                break;
            case 'hard':
                ballSpeedX = 8;
                ballSpeedY = 8;
                break;
        }
    }

    function changeBackgroundColor() {
        const color = bgColorSelect.value;
        game.style.backgroundColor = color;
        game.style.backgroundImage = 'none';
    }

    function movePaddlePlayer() {
        document.addEventListener('mousemove', function (e) {
            paddlePlayerY = e.clientY - game.offsetTop - (paddleHeight / 2);
            if (paddlePlayerY < 0) paddlePlayerY = 0;
            if (paddlePlayerY > gameHeight - paddleHeight) paddlePlayerY = gameHeight - paddleHeight;
            paddlePlayer.style.top = paddlePlayerY + 'px';
        });
    }

    function movePaddleAi() {
        paddleAiY = ballY - (paddleHeight / 2);
        if (paddleAiY < 0) paddleAiY = 0;
        if (paddleAiY > gameHeight - paddleHeight) paddleAiY = gameHeight - paddleHeight;
        paddleAi.style.top = paddleAiY + 'px';
    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY <= 0 || ballY >= gameHeight - ballSize) ballSpeedY *= -1;
        if (ballX <= 0) {
            aiScore++;
            resetBall();
        }
        if (ballX >= gameWidth - ballSize) {
            playerScore++;
            resetBall();
        }

        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }

    function checkCollision() {
        if (ballX <= paddlePlayer.offsetWidth &&
            ballY + ballSize >= paddlePlayerY &&
            ballY <= paddlePlayerY + paddleHeight) {
            ballSpeedX *= -1;
        }

        if (ballX + ballSize >= gameWidth - paddleAi.offsetWidth &&
            ballY + ballSize >= paddleAiY &&
            ballY <= paddleAiY + paddleHeight) {
            ballSpeedX *= -1;
        }
    }

    function resetBall() {
        ballX = (gameWidth - ballSize) / 2;
        ballY = (gameHeight - ballSize) / 2;
        ballSpeedX = Math.abs(ballSpeedX) * (ballSpeedX < 0 ? -1 : 1); // Ensure ball goes towards the player after reset
        ballSpeedY = Math.abs(ballSpeedY);
    }

    function updateScore() {
        score.textContent = playerScore + ' - ' + aiScore;
    }

    startPauseBtn.addEventListener('click', startGame);
    levelSelect.addEventListener('change', setDifficulty);
    bgColorSelect.addEventListener('change', changeBackgroundColor);

    setDifficulty(); // Set initial difficulty based on default selection
});
