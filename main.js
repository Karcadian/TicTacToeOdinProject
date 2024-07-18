const gameboard = (function () {
    let board = new Array(9);
    return { board, player: null };
})();

function player(name) {
    return { name };
}

function putX(board, index) {
    board[index] = "X";
}

function putO(board, index) {
    board[index] = "O";
}

function resetBoard(board) {
    board.fill(undefined);
}

// async function gameLoop(board) {
//     let turn = 0;
//     while (!isBoardFilled(board) && !checkWin(board, "X") && !checkWin(board, "O")) {
//         if (turn == 0) {
//             // Player's turn - Wait for the player to click a cell
//         } else {
//             const aiMove = getBestMove(board, "O");
//             putO(board, aiMove);
//             updateBoardUI();
//         }
//         turn = 1 - turn; // Switch turns
//     }
//     checkGameResult(board);
// }

function getBestMove(board, char) {
    // Check for winning move
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = char;
            if (checkWin(board, char)) {
                board[i] = undefined;
                return i;
            }
            board[i] = undefined;
        }
    }
    
    // Check for blocking move
    const opponent = char === "X" ? "O" : "X";
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = opponent;
            if (checkWin(board, opponent)) {
                board[i] = undefined;
                return i;
            }
            board[i] = undefined;
        }
    }

    // Take center if available
    if (!board[4]) return 4;

    // Take any corner
    const corners = [0, 2, 6, 8];
    for (let i of corners) {
        if (!board[i]) return i;
    }

    // Take any available spot
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) return i;
    }
}

function isBoardFilled(board) {
    return !board.includes(undefined);
}

function checkWin(board, char) {
    // Check rows, columns, and diagonals for a win
    for (let i = 0; i < 3; i++) {
        if (board[i * 3] === char && board[i * 3 + 1] === char && board[i * 3 + 2] === char) return true;
    }
    for (let i = 0; i < 3; i++) {
        if (board[i] === char && board[i + 3] === char && board[i + 6] === char) return true;
    }
    return (board[0] === char && board[4] === char && board[8] === char) ||
           (board[2] === char && board[4] === char && board[6] === char);
}

function updateBoardUI() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const index = cell.getAttribute('data-index');
        cell.textContent = gameboard.board[index];
    });
}

function checkGameResult(board) {
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartButton = document.getElementById('restartGame');
    if (checkWin(board, "X")) {
        gameOverMessage.textContent = "Player wins!";
        restartButton.style.display = "block";
    } else if (checkWin(board, "O")) {
        gameOverMessage.textContent = "AI wins!";
        restartButton.style.display = "block";
    } else if (isBoardFilled(board)) {
        gameOverMessage.textContent = "It's a draw!";
        restartButton.style.display = "block";
    }
}

function resetGame() {
    resetBoard(gameboard.board);
    updateBoardUI();
    document.getElementById('gameOverMessage').textContent = "";
    document.getElementById('restartGame').style.display = "none";
}

resetBoard(gameboard.board);

document.getElementById('startGame').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        gameboard.player = player(playerName);
        document.getElementById('playerDisplay').textContent = `Player: ${playerName}`;
        resetGame();
    } else {
        alert('Please enter your name.');
    }
});

document.getElementById('restartGame').addEventListener('click', () => {
    resetGame();
});

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', async (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (!gameboard.board[index] && !isBoardFilled(gameboard.board) && !checkWin(gameboard.board, "X") && !checkWin(gameboard.board, "O")) {
            putX(gameboard.board, index);
            updateBoardUI();
            if (!isBoardFilled(gameboard.board) && !checkWin(gameboard.board, "X")) {
                const aiMove = getBestMove(gameboard.board, "O");
                putO(gameboard.board, aiMove);
                updateBoardUI();
                checkGameResult(gameboard.board);
            } else {
                checkGameResult(gameboard.board);
            }
        }
    });
});



// const openaiApiKey = 'OPENAI_API_KEY';

// // Fetch AI move from OpenAI
// async function getAIMove(board, char, digits) {
//     const boardState = board.map(cell => cell || "-").join("");
//     const prompt = `Given the board state "${boardState}" and ${digits} to choose from, what is the best move for ${char}? You can only replace indices indicated by a '-'. You can NOT write over an 'O' or an 'X'. Respond ONLY with an index in ${digits}.`;

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${openaiApiKey}`
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 { role: "system", content: "You are a tic-tac-toe AI that can only respond with numbers." },
//                 { role: "user", content: prompt }
//             ],
//             max_tokens: 20,
//             temperature: 0.7,
//         })
//     });

//     const data = await response.json();
//     const move = parseInt(data.choices[0].message.content.trim());
//     const index = digits.indexOf(move);
//     if (index > -1) {
//         digits.splice(index, 1);
//     }
//     return move;
// }
