$(document).ready(function () {
    const PLAYER_X = 'X';
    const PLAYER_O = 'O';
    const X_IMG = 'x.png';
    const O_IMG = 'o.png';
    const DELAY = 500;
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = PLAYER_X;
    let isGameOver = false;
    let playerMode = 2;
    let difficulty = 'medium';

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let colorIndex = 0;
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A6', '#33FFF5'];

    function renderBoard() {
        $('#board').empty();
        board.forEach((cell, index) => {
            let cellElement = $('<div>').addClass('cell').data('index', index);
            if (cell) {
                let img = $('<img>').attr('src', cell === PLAYER_X ? X_IMG : O_IMG);
                cellElement.append(img);
            }
            $('#board').append(cellElement);
        });
    }

    function checkWinner() {
        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes('') ? null : 'Draw';
    }

    function computerMove() {
        let move;
        if (difficulty === 'easy') {
            move = getRandomMove();
        } else if (difficulty === 'medium') {
            move = getMediumMove();
        } else {
            move = getBestMove();
        }
        board[move] = PLAYER_O;
        renderBoard();
        let winner = checkWinner();
        if (winner) {
            handleGameOver(winner);
        } else {
            currentPlayer = PLAYER_X;
        }
    }

    function getRandomMove() {
        let emptyIndices = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    function getMediumMove() {
        if (Math.random() > 0.5) {
            let winningMove = findWinningMove(PLAYER_O);
            if (winningMove !== null) return winningMove;
            let blockingMove = findWinningMove(PLAYER_X);
            if (blockingMove !== null) return blockingMove;
        }
        return getRandomMove();
    }

    function getBestMove() {
        let bestMove = -1;
        let bestValue = -Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = PLAYER_O;
                let moveValue = minimax(board, 0, false);
                board[index] = '';
                if (moveValue > bestValue) {
                    bestMove = index;
                    bestValue = moveValue;
                }
            }
        });
        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        let scores = {
            'O': 10,
            'X': -10,
            'Draw': 0
        };
        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }
        if (isMaximizing) {
            let bestValue = -Infinity;
            board.forEach((cell, index) => {
                if (cell === '') {
                    board[index] = PLAYER_O;
                    let value = minimax(board, depth + 1, false);
                    board[index] = '';
                    bestValue = Math.max(value, bestValue);
                }
            });
            return bestValue;
        } else {
            let bestValue = Infinity;
            board.forEach((cell, index) => {
                if (cell === '') {
                    board[index] = PLAYER_X;
                    let value = minimax(board, depth + 1, true);
                    board[index] = '';
                    bestValue = Math.min(value, bestValue);
                }
            });
            return bestValue;
        }
    }

    function findWinningMove(player) {
        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] === player && board[b] === player && board[c] === '') return c;
            if (board[a] === player && board[c] === player && board[b] === '') return b;
            if (board[b] === player && board[c] === player && board[a] === '') return a;
        }
        return null;
    }

    function handleGameOver(winner) {
        isGameOver = true;
        if (winner === 'Draw') {
            $('#game-result').text("It's a draw!");
        } else {
            $('#game-result').text(`${winner} wins!`);
            updateLeaderboard(winner);
        }
    }


    function updateLeaderboard(winner) {

        const colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33a6', '#a6ff33', '#33a6ff'];

        let color = colors[($('#leaderboard-list').children().length) % colors.length];

        let listItem = $('<li>')
            .addClass('list-group-item')
            .text(`${winner} wins!`)
            .css('color', color);

        $('#leaderboard-list').append(listItem);
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = PLAYER_X;
        isGameOver = false;
        $('#game-result').empty();
        renderBoard();
    }

    $('#board').on('click', '.cell', function () {
        if (isGameOver) return;
        let index = $(this).data('index');
        if (board[index] === '') {
            board[index] = currentPlayer;
            renderBoard();
            let winner = checkWinner();
            if (winner) {
                handleGameOver(winner);
            } else if (playerMode === 1 && currentPlayer === PLAYER_X) {
                currentPlayer = PLAYER_O;
                setTimeout(computerMove, DELAY);
            } else {
                currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
            }
        }
    });

    $('#reset-game').click(resetGame);

    $('#exit-game').click(function () {
        $('#game-screen').addClass('d-none');
        $('#welcome-screen').removeClass('d-none');
        resetGame();
    });

    $('#start-game').click(function () {
        $('#welcome-screen').addClass('d-none');
        $('#game-screen').removeClass('d-none');
        playerMode = parseInt($('#player-mode').val());
        difficulty = $('#game-difficulty').val();
        resetGame();
    });

    $('#player-mode').change(function () {
        playerMode = parseInt($(this).val());
    });

    $('#game-difficulty').change(function () {
        difficulty = $(this).val();
    });
    $('#clear-scores').click(function () {
        $('#leaderboard-list').empty();
    });

    renderBoard();
});
