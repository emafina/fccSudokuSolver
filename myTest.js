const { puzzlesAndSolutions } = require('./controllers/puzzle-strings.js');
const SudokuSolver = require('./controllers/sudoku-solver.js');

const string = puzzlesAndSolutions[0][0];
console.log(string);
const solver = new SudokuSolver();
const solution = solver.solve(string);
if(solution){
    console.log(solution);
}else{
    console.log('No solution')
};

//const string = '11111112222222233333333.......11111111166666666663333333333888888888t222222222442'