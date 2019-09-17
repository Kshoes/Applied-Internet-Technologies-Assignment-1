// require your module, connectmoji
// require any other modules that you need, like clear and readline-sync

const c = require('./connectmoji.js');
const readlineSync = require('readline-sync');

const input = process.argv;

const PLAYER_VALUE = input[0];
const MOVE_STRING = input[1];
const NUMBER_ROWS = input[2];
const NUMBER_COLS = input[3];
const NUMBER_CONSECUTIVE = input[4];

c.generateBoard(NUMBER_ROWS, NUMBER_COLS, null);
