const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();
const {puzzlesAndSolutions} = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
    // #1
    test('Logic handles a valid puzzle string of 81 characters',function(){
        const string = puzzlesAndSolutions[0][0];
        assert.isTrue(solver.validate(string).valid);
    });
    // #2
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',function(){
        const string = '11111112222222233333333.......11111111166666666663333333333888888888t222222222442';
        assert.isFalse(solver.validate(string).valid);
        assert.equal(solver.validate(string).message,'Invalid characters in puzzle');
    });
    // #3
    test('Logic handles a puzzle string that is not 81 characters in length',function(){
        const string = '11111112222222233333333.......11111111166666666663333333333888888888122222222244212';
        assert.isFalse(solver.validate(string).valid);
        assert.equal(solver.validate(string).message,'Expected puzzle to be 81 characters long');
    });
    // #4
    test('Logic handles a valid row placement',function(){
        const string = puzzlesAndSolutions[0][0];
        console.table(solver.parse(string));
        assert.isTrue(solver.checkRowPlacement(string,0,1,6));
    });
    // #5
    test('Logic handles an invalid row placement',function(){
        const string = puzzlesAndSolutions[0][0];
        assert.isFalse(solver.checkRowPlacement(string,0,1,2));
    });
    // #6
    test('Logic handles a valid column placement',function(){
        const string = puzzlesAndSolutions[0][0];
        assert.isTrue(solver.checkColPlacement(string,0,1,4));
    });
    // #7
    test('Logic handles an invalid column placement',function(){
        const string = puzzlesAndSolutions[0][0];
        assert.isFalse(solver.checkColPlacement(string,0,1,7));
    });
    // #8
    test('Logic handles a valid region (3x3 grid) placement',function(){
        const string = puzzlesAndSolutions[0][0];
        assert.isTrue(solver.checkRegionPlacement(string,0,1,4));
    });
    // #9
    test('Logic handles an invalid region (3x3 grid) placement',function(){
        const string = puzzlesAndSolutions[0][0];
        assert.isFalse(solver.checkRegionPlacement(string,0,1,6));
    });
    // #10
    test('Valid puzzle strings pass the solver',function(){
        const string = puzzlesAndSolutions[0][0];
        assert.isNotNull(solver.solve(string));
    });
    // #11
    test('Invalid puzzle strings fail the solver',function(){
        const string = '11111112222222233333333.......11111111166666666663333333333888888888122222222244212';
        assert.isNull(solver.solve(string));
    });
    // #12
    test('Solver returns the expected solution for an incomplete puzzle',function(){
        const puzzle = puzzlesAndSolutions[0][0];
        const solution = puzzlesAndSolutions[0][1];
        assert.equal(solver.solve(puzzle),solution);
    });
});