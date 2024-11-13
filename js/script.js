// Game variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Player "X" will play first
let isGameActive = true;

// DOM elements
const gameBoard = document.getElementById("gameBoard");
const gameStatus = document.getElementById("gameStatus");
const resetButton = document.getElementById("resetButton");

// Winning combinations
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

// Initialize game board
gameBoard.addEventListener("click", (event) => {
    const clickedCell = event.target;
    const cellIndex = clickedCell.getAttribute("data-index");

    if (cellIndex && isGameActive && board[cellIndex] === "" && currentPlayer === "X") {
        board[cellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        checkResult();
        if (isGameActive) {
            currentPlayer = "O"; // Switch to AI
            aiMove(); // Let AI play
        }
    }
});

// Reset button event
resetButton.addEventListener("click", resetGame);

// Function to check for a win or a draw
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatus.textContent = `Player ${currentPlayer} wins!`;
        isGameActive = false;
        return;
    }

    if (!board.includes("")) {
        gameStatus.textContent = "It's a draw!";
        isGameActive = false;
    }
}

// Function to reset the game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    document.querySelectorAll(".cell").forEach(cell => (cell.textContent = ""));
}

// AI Logic - Minimax Algorithm
function aiMove() {
    let bestScore = -Infinity;
    let bestMove;

    // Loop through all cells and find the best move for the AI
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O"; // Try AI move
            let score = minimax(board, 0, false);
            board[i] = ""; // Undo AI move
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    board[bestMove] = "O"; // Make the best move for AI
    document.querySelector(`[data-index='${bestMove}']`).textContent = "O"; // Update DOM
    checkResult();
    if (isGameActive) {
        currentPlayer = "X"; // Switch to player after AI move
        gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
    const winner = checkWinner(board);
    if (winner === "X") return -10;
    if (winner === "O") return 10;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O"; // AI's move
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X"; // Player's move
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check the winner
function checkWinner(board) {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

