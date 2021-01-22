// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync

const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');
const clear = require('clear');

if(process.argv[2]) {   // check if a preset move string is provided

    const input = process.argv[2].split(',');

    const PLAYER_VALUE = input[0];
    const MOVE_STRING = input[1];
    const NUMBER_ROWS = input[2];
    const NUMBER_COLS = input[3];
    const NUMBER_CONSECUTIVE = input[4];
    
    let originalBoard = c.generateBoard(NUMBER_ROWS, NUMBER_COLS, null);

    let result = c.autoplay(originalBoard, MOVE_STRING, NUMBER_CONSECUTIVE);

    let AI_VALUE;
    if(result.playerEmojis[0] === PLAYER_VALUE) 
        AI_VALUE = result.playerEmojis[1];
    else 
        AI_VALUE = result.playerEmojis[0];
    
    let startGamePrompt = readlineSync.question('Press ENTER to start the game');
    console.log(c.boardToString(result.board));

    runGameWithAI(result, PLAYER_VALUE, AI_VALUE, NUMBER_CONSECUTIVE);
}

else {      // User controlled game settings

    let input = readlineSync.question('Enter the number of rows, columns, and consecutive "pieces" for win (separated by commas): ');
    let gameParameters = input.split(',');


    // Check for valid values, add default values of 6 7 4 if no input

    if(gameParameters[0] === '') {
        gameParameters = [6, 7, 4];
    }
    const NUMBER_ROWS = gameParameters[0];
    const NUMBER_COLS = gameParameters[1];
    const NUMBER_CONSECUTIVE = gameParameters[2];
    console.log('Using rows, cols, and consecutive to win with these values: ' + NUMBER_ROWS + ' ' + NUMBER_COLS + ' ' + NUMBER_CONSECUTIVE);

    
    // Check for valid values, add default values of 😎 💻 if no input

    input = readlineSync.question('Enter two characters that represent the character and the AI respectively (separated by commas): ');
    let characterSelection = input.split(',');

    if(characterSelection[0] === '') {
        characterSelection = ['😎', '💻'];
    }
    const PLAYER_VALUE = characterSelection[0];
    const AI_VALUE = characterSelection[1];
    console.log('Using player and computer characters: ' + PLAYER_VALUE + ' ' + AI_VALUE);


    let player1;
    let player2;
    input = readlineSync.question('Who goes first, (P)layer or (C)omputer? ');
    switch(input) {
        case 'P':
            player1 = PLAYER_VALUE;
            player2 = AI_VALUE;
            console.log('Player goes first');
            break;
        case 'C':
            player1 = AI_VALUE;
            player2 = PLAYER_VALUE;
            console.log('Computer goes first');
            break;
        default:
            player1 = PLAYER_VALUE;
            player2 = AI_VALUE;
            console.log('Player goes first');
            break;
    }
    
    const MOVE_STRING = player1 + player2;      // determines who goes first (player1 always goes first)

    let board = c.generateBoard(NUMBER_ROWS, NUMBER_COLS, null);

    let result = c.autoplay(board, MOVE_STRING, NUMBER_CONSECUTIVE);

    input = readlineSync.question('Press ENTER to start the game');
    console.log(c.boardToString(result.board));

    runGameWithAI(result, PLAYER_VALUE, AI_VALUE, NUMBER_CONSECUTIVE);
}


function runGameWithAI(result, playerValue, aIValue, numConsecutive) {

    const player2 = result.playerEmojis[1];

    if(result.lastPieceMoved === undefined) {
        result.lastPieceMoved = player2;
    }

    while(!result.winner && c.getAvailableColumns(result.board).length !== 0) {
    
        let moveCol;
    
        if(result.lastPieceMoved === aIValue) {        // player's turn is next
    
            let validMove = false;
            
            while(!validMove) {     // keep prompting player until valid input is received
    
                const nextPlayerMove = readlineSync.question('Choose a column to drop your piece in: ');
    
                if(c.getEmptyRowCol(result.board, nextPlayerMove)) {
    
                    validMove = true;
                    const index = c.getEmptyRowCol(result.board, nextPlayerMove);
    
                    result.board = c.setCell(result.board, index.row, index.col, playerValue);
                    result.lastPieceMoved = playerValue;
    
                    moveCol = nextPlayerMove;
    
                    if(c.hasConsecutiveValues(result.board, index.row, index.col, numConsecutive)) {
                        result.winner = playerValue;
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
    
            moveCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];    // AI chooses random available column as a move
    
            if(c.getEmptyRowCol(result.board, moveCol)) {
                const index = c.getEmptyRowCol(result.board, moveCol);
                result.board = c.setCell(result.board, index.row, index.col, aIValue);
                result.lastPieceMoved = aIValue;
    
                if(c.hasConsecutiveValues(result.board, index.row, index.col, numConsecutive)) {
                    result.winner = aIValue;
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
}
