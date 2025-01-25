const { puzzlesAndSolutions } = require('./controllers/puzzle-strings.js');
const SudokuSolver = require('./controllers/sudoku-solver.js');

const string = puzzlesAndSolutions[0][0];
const solver = new SudokuSolver();


//const string = '11111112222222233333333.......11111111166666666663333333333888888888t222222222442'

const puzzle = '11111112222222233333333.......111111111666666666633333333338888888881222222222442';
console.log(solver.isLegal(puzzle));

const puzzleB = puzzlesAndSolutions[0][0];
console.log(solver.isLegal(puzzleB));