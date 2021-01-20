// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync

const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');
const clear = require('clear');

const input = process.argv[2].split(',');

const PLAYER_VALUE = input[0];
const MOVE_STRING = input[1];
const NUMBER_ROWS = input[2];
const NUMBER_COLS = input[3];
const NUMBER_CONSECUTIVE = input[4];


// console.log(PLAYER_VALUE);
// console.log(MOVE_STRING);
// console.log(NUMBER_ROWS);
// console.log(NUMBER_COLS);
// console.log(NUMBER_CONSECUTIVE);

// console.log(c.generateBoard(NUMBER_ROWS, NUMBER_COLS, null));

let originalBoard = c.generateBoard(NUMBER_ROWS, NUMBER_COLS, null);
// console.log(c.boardToString(board));
let result = c.autoplay(originalBoard, MOVE_STRING, NUMBER_CONSECUTIVE);
// console.log(c.boardToString(result.board));
// console.log("Press ENTER to start the game");

const startGamePrompt = readlineSync.question('Press ENTER to start the game');
console.log(c.boardToString(result.board));

while(!result.winner && c.getAvailableColumns(result.board).length !== 0) {

    let moveCol;

    if(result.lastPieceMoved === '💻') {        // player's turn is next

        let validMove = false;
        
        while(!validMove) {
            const nextPlayerMove = readlineSync.question('Choose a column to drop your piece in: ');

            if(c.getEmptyRowCol(result.board, nextPlayerMove)) {

                validMove = true;
                const index = c.getEmptyRowCol(result.board, nextPlayerMove);

                result.board = c.setCell(result.board, index.row, index.col, PLAYER_VALUE);
                result.lastPieceMoved = PLAYER_VALUE;

                moveCol = nextPlayerMove;

                if(c.hasConsecutiveValues(result.board, index.row, index.col, NUMBER_CONSECUTIVE)) {
                    result.winner = PLAYER_VALUE;
                }
            }
            else {      // invalid move handling
                console.log('Oops, that wasn\'t a valid move, try again!')
            }
        }   
    }
    else {         // AI's turn is next

        const nextAIMove = readlineSync.question('Press ENTER to see AI move: ');
        const availableColumns = c.getAvailableColumns(result.board);
        moveCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];

        if(c.getEmptyRowCol(result.board, moveCol)) {
            const index = c.getEmptyRowCol(result.board, moveCol);
            result.board = c.setCell(result.board, index.row, index.col, '💻');
            result.lastPieceMoved = '💻';

            if(c.hasConsecutiveValues(result.board, index.row, index.col, NUMBER_CONSECUTIVE)) {
                result.winner = '💻';
            }
        }
    }

    clear();
    console.log('...dropping in column ' + moveCol);
    console.log(c.boardToString(result.board));

}

if(!result.winner) {
    console.log('No winner. So sad 😭')
}
else {
    console.log('Winner is: ' + result.winner);
}


