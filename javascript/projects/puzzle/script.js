let moveCount = 0;
let maxMoves = 0;
let draggedTile = null;

document.getElementById('startGame').addEventListener('click', startGame);

function startGame() {
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const boardSize = difficulty; // גודל הפאזל נקבע לפי הבחירה
    const gameBoard = document.getElementById('gameBoard');
    const message = document.getElementById('message');
    const moveCounter = document.getElementById('moveCounter');

    gameBoard.innerHTML = '';
    message.textContent = '';
    message.classList.remove('grow-shrink');

    maxMoves = 100; // מספר המהלכים נשאר 100 עבור כל רמת קושי

    moveCount = maxMoves;
    moveCounter.textContent = `Moves left: ${moveCount}`;

    let tiles = [];
    for (let i = 1; i <= boardSize * boardSize - 1; i++) {
        tiles.push(i);
    }
    tiles.push(null);

    // בודקים שהארגומנט של הפונקציה shuffle תקין
    if (tiles.length !== boardSize * boardSize) {
        console.error("Invalid array length for tiles.");
        return;
    }

    tiles = shuffle(tiles, boardSize);

    const randomImageIndex = Math.floor(Math.random() * 9) + 1;
    const bgImage = `images/${randomImageIndex}.jpg`;

    gameBoard.style.width = '800px';
    gameBoard.style.height = '600px';

    const pieceWidth = 800 / boardSize;
    const pieceHeight = 600 / boardSize;

    tiles.forEach((tileNumber, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.width = `${pieceWidth}px`;
        tile.style.height = `${pieceHeight}px`;
        tile.style.left = `${(index % boardSize) * pieceWidth}px`;
        tile.style.top = `${Math.floor(index / boardSize) * pieceHeight}px`;

        if (tileNumber !== null) {
            const row = Math.floor((tileNumber - 1) / boardSize);
            const col = (tileNumber - 1) % boardSize;
            tile.style.backgroundImage = `url(${bgImage})`;
            tile.style.backgroundSize = `${boardSize * 100}% ${boardSize * 100}%`;
            tile.style.backgroundPosition = `-${col * (800 / boardSize)}px -${row * (600 / boardSize)}px`;
        } else {
            tile.classList.add('empty');
        }

        tile.dataset.index = index;
        tile.dataset.tileNumber = tileNumber;

        tile.draggable = true;
        tile.addEventListener('dragstart', dragStart);
        tile.addEventListener('dragover', dragOver);
        tile.addEventListener('drop', drop);

        gameBoard.appendChild(tile);
    });
}

function shuffle(array, boardSize) {
    if (array.length !== boardSize * boardSize) {
        throw new Error("Invalid array length during shuffle.");
    }

    do {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    } while (!isSolvable(array, boardSize));
    return array;
}

function isSolvable(array, boardSize) {
    let inversions = 0;
    const arrayWithoutNull = array.filter(n => n !== null);
    for (let i = 0; i < arrayWithoutNull.length - 1; i++) {
        for (let j = i + 1; j < arrayWithoutNull.length; j++) {
            if (arrayWithoutNull[i] > arrayWithoutNull[j]) {
                inversions++;
            }
        }
    }
    const emptyRow = Math.floor(array.indexOf(null) / boardSize);
    return (boardSize % 2 === 1 && inversions % 2 === 0) ||
        (boardSize % 2 === 0 && (inversions + emptyRow) % 2 === 1);
}

function dragStart(event) {
    draggedTile = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const targetTile = event.target;

    if (targetTile.classList.contains('tile')) {
        const draggedIndex = parseInt(draggedTile.dataset.index);
        const targetIndex = parseInt(targetTile.dataset.index);

        const draggedTileNumber = draggedTile.dataset.tileNumber;
        const targetTileNumber = targetTile.dataset.tileNumber;

        console.log(`Swapping tiles: Dragged ${draggedTileNumber}, Target ${targetTileNumber}`);

        const draggedLeft = draggedTile.style.left;
        const draggedTop = draggedTile.style.top;
        const targetLeft = targetTile.style.left;
        const targetTop = targetTile.style.top;

        draggedTile.style.left = targetLeft;
        draggedTile.style.top = targetTop;
        targetTile.style.left = draggedLeft;
        targetTile.style.top = draggedTop;

        draggedTile.dataset.index = targetIndex;
        targetTile.dataset.index = draggedIndex;

        draggedTile.dataset.tileNumber = targetTileNumber;
        targetTile.dataset.tileNumber = draggedTileNumber;

        moveCount--;
        document.getElementById('moveCounter').textContent = `Moves left: ${moveCount}`;

        if (isSolved()) {
            console.log('Puzzle solved!');
            document.getElementById('message').textContent = 'כל הכבוד הצלחתם!';
            document.getElementById('message').classList.add('grow-shrink');
        } else if (moveCount <= 0) {
            gameOver();
        }
    }
}
