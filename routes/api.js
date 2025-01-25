'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  // 7. You can POST to /api/check an object containing puzzle, coordinate, 
  // and value where the coordinate is the letter A-I indicating the row, followed 
  // by a number 1-9 indicating the column, and value is a number from 1-9.

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle,coordinate,value} = req.body;
      // check fields
      if(!puzzle||!coordinate||!value){
        res.json({error:'Required field(s) missing'});
      };
      // check coordinate
      const {row,column,success} = solver.parseCoord(coordinate);
      if(!success){
        res.json({error: 'Invalid coordinate'});
      };
      // check puzzle
      const {valid:validPuzzle,message} = solver.validate(puzzle);
      if(!validPuzzle){
        res.json({error: message});
      };
      // check value
      if(parseInt(value)<1||parseInt(value)>9){
        res.json({error: 'Invalid value'});
      };
      // check placement
      const matrix = solver.parse(puzzle);
      const {valid,conflict} = solver.isAllowed(matrix,row,column,parseInt(value));
      res.json({valid,conflict});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      // extract puzzle string from req body
      const {puzzle} = req.body;
      if(!puzzle){
        res.json({
          error: 'Required field missing'
        });
      };
      // check puzzle string
      const result = solver.validate(puzzle);
      if(!result.valid){
        res.json({
          error: result.message
        });
      };
      // try to solve puzzle
      const solution = solver.solve(puzzle);
      if(!solution){
        res.json({
          error: 'Puzzle cannot be solved'
        });
      };
      res.json({solution});
    });
};
