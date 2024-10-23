const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const leaderboard = document.getElementById('leaderboard');
let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let startTime = null;

document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
});

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (!gameOver && !board[index]) {
            if (!startTime) {
                startTime = new Date();
            }
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            checkWinner();
            if (!gameOver) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                computerMove();
            }
        }
    });
});

function computerMove() {
    let emptyCells = board.map((value, index) => value === null ? index : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
        let randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomMove] = 'O';
        cells[randomMove].textContent = 'O';
        checkWinner();
        if (!gameOver) {
            currentPlayer = 'X';
        }
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            result.textContent = `¡${board[a]} ha ganado!`;
            if (board[a] === 'X') {
                saveRecord();
            }
            return;
        }
    }

    if (board.every(cell => cell !== null)) {
        gameOver = true;
        result.textContent = '¡Es un empate!';
    }
}

function saveRecord() {
    let playerName = prompt('¡Ganaste! Introduce tu nombre:');
    if (playerName) {
        let endTime = new Date();
        let timeTaken = (endTime - startTime) / 1000;
        let records = JSON.parse(localStorage.getItem('leaderboard')) || [];
        records.push({ name: playerName, time: timeTaken, date: new Date().toLocaleString() });
        records.sort((a, b) => a.time - b.time);
        records = records.slice(0, 10); // Mantener solo los primeros 10
        localStorage.setItem('leaderboard', JSON.stringify(records));
        loadLeaderboard();
    }
}

function loadLeaderboard() {
    let records = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.innerHTML = '';
    records.forEach(record => {
        let li = document.createElement('li');
        li.textContent = `${record.name}: ${record.time}s - ${record.date}`;
        leaderboard.appendChild(li);
    });
}

