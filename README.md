Connectmoji:

A terminal-based version of Connect-4, with emojis and customizable settings!

To run: node src/game.js

To run a pre-set scenario, add a string to the commandline argument in the format of: 

PLAYER_VALUE,MOVE_STRING,NUMBER_ROWS,NUMBER_COLUMNS,NUMBER_CONSECUTIVE (ex: 😎,😎💻AABBCC,6,7,4)  

😎- PLAYER_VALUE: the value that the player will use for the game  
😎💻AABBCC - MOVE_STRING: a string where the first 2 characters contain the emojis representing the two players on the board, and the remaining characters are alternating column letters that represent moves for those values (first emoji will take the first move)  
6 - NUMBER_ROWS: the number of rows in the board  
7 - NUMBER_COLUMNS: the number of columns in the board  
4 - NUMBER_CONSECUTIVE: the number of repeated consecutive values needed for a win  
