const wcwidth = require("wcwidth");
// implement your functions here
// ...don't forget to export functions!


function generateBoard(rows, cols, fill = null) {

    const board = {
        data: Array(rows*cols).fill(fill),
        rows: rows,
        cols: cols
    };
    return board;
}

function rowColToIndex(board, row, col) {

    return board.cols * row + col;
}

function indexToRowCol(board, i) {

    const rowCol = {
        row: Math.floor(i/board.cols),
        col: i%board.cols
    };
    return rowCol;
}

function setCell(board, row, col, value) {

    const updatedBoard = {
        data: [...board.data],
        rows: board.rows,
        cols: board.cols
    };

    const index = rowColToIndex(board, row, col);
    updatedBoard.data[index] = value;

    return updatedBoard;
}

function setCells(board, ...args) {

    let updatedBoard = board;
    for(let i = 0; i < args.length; i++){
        updatedBoard = setCell(updatedBoard, args[i].row, args[i].col, args[i].val);
    }

    return updatedBoard;
}

function boardToString(board) {

    let masterString = "";
    for(let rc = 0; rc < board.rows; rc++) {

        let rowString = "|";
        for(let cc = 0; cc < board.cols; cc++) {
            
            const index = rowColToIndex(board, rc, cc);
            if(board.data[index] == null) {
                rowString += "    |";
            }
            else if(wcwidth(board.data[index]) == 1) {
                rowString += " " + board.data[index] + "  |";
            }
            else if(wcwidth(board.data[index]) == 2) {
                rowString += " " + board.data[index] + " |";
            }  
            else if(wcwidth(board.data[index]) == 3) {
                rowString += board.data[index] + " |";
            }
            else {
                rowString += board.data[index];   
            }

        }
        masterString += rowString + "\n";

    }

    let baseline = "|";
    for(let cc = 0; cc < board.cols - 1; cc++) {
        baseline += "----+";
    }
    baseline += "----|";
    masterString += baseline + "\n";

    let labels = "|";
    for(let cc = 0; cc < board.cols; cc++) {
        labels += " " + String.fromCodePoint(65 + cc) + "  |";
    }
    masterString += labels;

    // console.log(masterString);
    return masterString;

}

function letterToCol(letter) {

    let letterToUnicode = letter.charCodeAt(0);
    if(letterToUnicode < 65 || letterToUnicode > 90 || letter.length > 1){
        return null;
    }
    else {
        return letterToUnicode-=65;
    }
}

function getEmptyRowCol(board, letter, empty = null) {

    const colNumber = letterToCol(letter);

    if(colNumber == null || colNumber > board.cols-1) {
        return empty;
    }

    for(let i = board.rows - 1; i >= 0; i--) {

        const index = rowColToIndex(board, i, colNumber);

        if(board.data[index] == null) {

            while(i > 0) {

                if(board.data[rowColToIndex(board, i-1, colNumber)] !== null) {
                    i-=2;
                    break;
                }
                if(board.data[rowColToIndex(board, i, colNumber)] == null && board.data[rowColToIndex(board, 0, colNumber)] == null) {
                    const emptyCell = {
                        row: i,
                        col: colNumber
                    };
                    return emptyCell;
                }
                else {
                    i--;
                }
            }

            if(i == 0 && board.data[rowColToIndex(board, i, colNumber)] == null) {
                const emptyCell = {
                    row: i,
                    col: colNumber
                };
                return emptyCell;
            }
        }
    }
    return null;
}

function getAvailableColumns(board) {
    
    const availableColumns = [];

    for(let i = 0; i < board.cols; i++) {

        const letter = String.fromCodePoint(65 + i);
        if(getEmptyRowCol(board, letter) !== null) {
            availableColumns.push(letter);
        }
    }

    return availableColumns;
}

function checkConsecutiveLine (...args) {

    return (args[0] !== null && args.every(x => x === args[0]));

}

function hasConsecutiveValues(board, row, col, n) {

    let origin = rowColToIndex(board, row, col);

    // VERTICAL CHECKS:
    let vertCounter = n-1;

    // traverse up
    let currIndex = origin;
    let r = row;

    while(r > 0 && board.data[rowColToIndex(board, r-1, col)] === board.data[currIndex]) {  // check if out of bounds yet and if next index matches current
        vertCounter--;
        currIndex = rowColToIndex(board, r-1, col);
        r--;
    }

    // traverse down
    currIndex = origin;
    r = row;

    while(r < board.rows && board.data[rowColToIndex(board, r+1, col)] === board.data[currIndex]) {
        vertCounter--;
        currIndex = rowColToIndex(board, r+1, col);
        r++;
    }
    if(vertCounter === 0) {
        return true;
    }

    // HORIZONTAL CHECKS:
    let horizCounter = n-1;

    // traverse left
    currIndex = origin;
    let c = col;

    while(c > 0 && board.data[rowColToIndex(board, row, c-1)] === board.data[currIndex]) {
        horizCounter--;
        currIndex = rowColToIndex(board, row, c-1);
        c--;
    }

    // traverse right
    currIndex = origin;
    c = col;
    
    while(c < board.cols && board.data[rowColToIndex(board, row, c+1)] === board.data[currIndex]) {
        horizCounter--;
        currIndex = rowColToIndex(board, row, c+1);
        c++;
    }
    if(horizCounter === 0) {
        return true;
    }

    // DIAGONAL CHECKS:

    // Diagonal Down-slope Checks:
    let diagDownCounter = n-1;

    // traverse up left
    currIndex = origin;
    r = row, c = col;

    while(r > 0 && c > 0 && board.data[rowColToIndex(board, r-1, c-1)] === board.data[currIndex]) {
        diagDownCounter--;
        currIndex = rowColToIndex(board, r-1, c-1);
        r--; c--;
    }

    // traverse down left
    currIndex = origin;
    r = row, c = col;

    while(r < board.rows && c < board.cols && board.data[rowColToIndex(board, r+1, c+1)] === board.data[currIndex]) {
        diagDownCounter--;
        currIndex = rowColToIndex(board, r+1, c+1);
        r++; c++;
    }
    if(diagDownCounter === 0) {
        return true;
    }

    // Diagonal Up-slope Checks: 
    let diagUpCounter = n-1;

    // traverse up right
    currIndex = origin;
    r = row, c = col;

    while(r > 0 && c < board.cols && board.data[rowColToIndex(board, r-1, c+1)] === board.data[currIndex]) {
        diagDownCounter--;
        currIndex = rowColToIndex(board, r-1, c+1);
        r--; c++;
    }

    // traverse down left
    currIndex = origin;
    r = row, c = col;

    while(r < board.rows && c > 0 && board.data[rowColToIndex(board, r+1, c-1)] === board.data[currIndex]) {
        diagDownCounter--;
        currIndex = rowColToIndex(board, r+1, c-1);
        r++; c--;
    }
    if(diagDownCounter === 0) {
        return true;
    }

    return false;

}

// function autoplay(board, s, numConsecutive) {

//     const strArr = s.split();

//     const player1 = strArr[0];
//     const player2 = strArr[1];

//     let i = 2;
//     while(i < strArr.length) {
//         if(i%2 === 1){
//             getEmptyRowCol(board, strArr[i]);
//         }
//     }

//     const result = {
//         board: ,
//         lastPieceMoved: ,
//         error: ,
//         winner: 
//     }

//     return result;
// }


module.exports = {
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex,
    indexToRowCol: indexToRowCol,
    setCell: setCell,
    setCells: setCells,
    boardToString: boardToString,
    letterToCol: letterToCol,
    getEmptyRowCol: getEmptyRowCol,
    getAvailableColumns: getAvailableColumns,
    hasConsecutiveValues: hasConsecutiveValues
    // autoplay: autoplay
};

