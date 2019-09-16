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

    console.log(masterString);

}

function letterToCol(letter) {

    
}

module.exports = {
    generateBoard: generateBoard,
    rowColToIndex: rowColToIndex,
    indexToRowCol: indexToRowCol,
    setCell: setCell,
    setCells: setCells,
    boardToString: boardToString,
    letterToCol: letterToCol
};

