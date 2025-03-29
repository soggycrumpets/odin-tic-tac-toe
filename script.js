function Player(playerName, playerSymbol) {
    let name = playerName;
    let symbol = playerSymbol;

    return { name, symbol };
}

const gameBoard = (function Board() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const mark = function (row, col, symbol) {
        if (board[row][col] !== "") {
            return false;
        }
        board[row][col] = symbol;
        return true;
    }

    const reset = function () {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                board[row][col] = "";
            }
        }
    }

    const get = function () {
        return board;
    }

    return { mark, reset, get }
})();

const game = (function Game() {
    let round = 0;
    const player1 = Player("player1", "X");
    const player2 = Player("player2", "O");

    const doRound = function (row, col) {

        const activePlayer = getActivePlayer(player1, player2);
        const symbol = activePlayer.symbol;

        if (!gameBoard.mark(row, col, symbol)) {
            return false;
        }

        ++round;
        return true;
    }

    const getActivePlayer = function () {
        return round % 2 === 0 ? player1 : player2;
    }

    const checkWinner = function () {
        const winningSymbol = getWinningSymbol();
        if (winningSymbol === "") {
            if (round >= 9) {
                return "tie";
            }
            return "";
        }

        if (winningSymbol === player1.symbol) {
            return player1;
        }
        return player2;
    }

    const getWinningSymbol = function () {
        const board = gameBoard.get();

        // Check rows
        for (row in board) {
            const winningSymbol = checkSpaces(board[row][0], board[row][1], board[row][2]);
            if (winningSymbol !== "") {
                return winningSymbol;
            }
        }

        // Check cols
        for (col in board) {
            const winningSymbol = checkSpaces(board[0][col], board[1][col], board[2][col]);
            if (winningSymbol !== "") {
                return winningSymbol;
            }
        }

        let winningSymbol;
        // Check diagonal 1
        winningSymbol = checkSpaces(board[0][0], board[1][1], board[2][2]);
        if (winningSymbol !== "") {
            return winningSymbol;
        }
            
        // Check diagonal 2
        winningSymbol = checkSpaces(board[2][0], board[1][1], board[0][2]);
        if (winningSymbol !== "") {
            return winningSymbol;
        }

        return "";
    }

    // If all 3 spaces' symbols match, returns that symbol
    const checkSpaces = function (space1, space2, space3) {
        if (space1 === space2 && space2 === space3) {
            return space1;
        } else {
            return "";
        }
    }

    const reset = function () {
        gameBoard.reset();
        round = 0;
    }

    const getBoard = function () {
        return gameBoard.get();
    }

    return { doRound, getActivePlayer, checkWinner, reset, getBoard, player1, player2 }
})();

(function Display() {
    const createBoardSpaceElements = function () {
        const boardSpaceElements = Array.from(Array(3), () => new Array(3));
        const boardElement = document.querySelector(".gameboard")

        const board = game.getBoard();
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                const boardSpaceElement = document.createElement("div");
                boardElement.appendChild(boardSpaceElement);
                boardSpaceElements[row][col] = boardSpaceElement;
            }
        }

        return boardSpaceElements;
    }

    const addEventListeners = function () {
        // Tic-tac-toe board spaces
        for (let row = 0; row < boardSpaces.length; row++) {
            for (let col = 0; col < boardSpaces[0].length; col++) {
                const spaceElement = boardSpaces[row][col];
                spaceElement.addEventListener("click", () => doRound(spaceElement, row, col));
            }
        }

        // Buttons
        startButton.addEventListener("click", () => startGame());
        resetButton.addEventListener("click", () => reset());
    }

    const doRound = function (spaceElement, row, col) {
        if (!gameIsRunning) {
            return;
        }

        let activePlayer = game.getActivePlayer();
        if (game.doRound(row, col)) {
            spaceElement.textContent = activePlayer.symbol;
        }

        displayActivePlayer();
        const winner = game.checkWinner();
        if (winner !== "") {
            gameIsRunning = false;
            displayWinner(winner);
            resetButton.style.visibility = "visible";
            return;
        }

    }

    const reset = function () {
        game.reset();
        for (let row = 0; row < boardSpaces.length; row++) {
            for (let col = 0; col < boardSpaces[0].length; col++) {
                boardSpaces[row][col].textContent = "";
            }
        }
        gameIsRunning = true;
        resetButton.style.visibility = "hidden";
        displayActivePlayer();
    }

    const startGame = function () {
        startSection.style.visibility = "hidden";

        const player1NameInput = document.querySelector(".player1-name").value;
        const player2NameInput = document.querySelector(".player2-name").value;
        if (player1NameInput !== "") {
            game.player1.name = player1NameInput;
        }
        if (player2NameInput !== "") {
            game.player2.name = player2NameInput;
        }
        gameIsRunning = true;
        displayActivePlayer();
    }

    const displayActivePlayer = function () {
        displayMessage.textContent = gameIsRunning ?
            `${game.getActivePlayer().name}'s turn!` : "";
    }

    const displayWinner = function (winner) {
        if (winner === "tie") {
            displayMessage.textContent = "It's a tie!";
            return;
        }

        displayMessage.textContent = `${winner.name} won!`;
    }

    let gameIsRunning = false;
    const displayMessage = document.querySelector(".display-message");
    const startSection = document.querySelector(".start");
    const startButton = document.querySelector(".start-button");
    const resetButton = document.querySelector(".reset-button");
    const boardSpaces = createBoardSpaceElements();

    addEventListeners();
    displayMessage.textContent = "Enter your names (optional) and press \"Start\" to begin!"
})();