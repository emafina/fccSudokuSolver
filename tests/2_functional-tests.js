const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const {puzzlesAndSolutions} = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(2000);
    // #1
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve',function(done){
        const puzzle = puzzlesAndSolutions[0][0];
        const puzzleSolution = puzzlesAndSolutions[0][1];
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle})
            .end((err,res)=>{
                const {solution} = res.body;
                assert.equal(solution,puzzleSolution);
                done();
            });
    });
    // #2
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve',function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({property:''})
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Required field missing');
                done();
            });
    });
    // #3
    test('Solve a puzzle with invalid characters: POST request to /api/solve',function(done){
        const puzzle = '11111112222222233333333.......11111111166666666663333333333888888888t222222222442';
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle})
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Invalid characters in puzzle');
                done();
            });
    });
    // #4
    test('Solve a puzzle with incorrect length: POST request to /api/solve',function(done){
        const puzzle = '11111112222222233333333.......11111111166666666663333333888888222222222442';
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle})
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Expected puzzle to be 81 characters long');
                done();
            });
    });
    // #5
    test('Solve a puzzle that cannot be solved: POST request to /api/solve',function(done){
        const puzzle = '11111112222222233333333.......11111111166666666663333333888888222222222442';
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle})
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Expected puzzle to be 81 characters long');
                done();
            });
    });
    // #6
    test('Solve a puzzle that cannot be solved: POST request to /api/solve',function(done){
        const puzzle = '11111112222222233333333.......111111111666666666633333333338888888881222222222442';
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle})
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Puzzle cannot be solved');
                done();
            });
    });
    // #7
    test('Check a puzzle placement with all fields: POST request to /api/check',function(done){
        const puzzle = puzzlesAndSolutions[0][0];
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                coordinate:'A2',
                value:3
            })
            .end((err,res)=>{
                const {valid} = res.body;
                assert.isTrue(valid);
                done();
            });
    });
    // #8
    test('Check a puzzle placement with single placement conflict: POST request to /api/check',function(done){
        const puzzle = puzzlesAndSolutions[0][0];
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                coordinate:'A2',
                value:7
            })
            .end((err,res)=>{
                const {valid,conflict} = res.body;
                assert.isFalse(valid);
                assert.equal(conflict.length,1);
                done();
            });
    });
    // #9
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check',function(done){
        const puzzle = puzzlesAndSolutions[0][0];
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                coordinate:'A2',
                value:6
            })
            .end((err,res)=>{
                const {valid,conflict} = res.body;
                assert.isFalse(valid);
                assert.isAbove(conflict.length,1);
                done();
            });
    });
    // #10
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check',function(done){
        const puzzle = puzzlesAndSolutions[0][0];
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                coordinate:'B8',
                value:7
            })
            .end((err,res)=>{
                const {valid,conflict} = res.body;
                assert.isFalse(valid);
                assert.equal(conflict.length,3);
                done();
            });
    });
    // #11
    test('Check a puzzle placement with missing required fields: POST request to /api/check',function(done){
        const puzzle = puzzlesAndSolutions[0][0];
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                value:7
            })
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Required field(s) missing');
                done();
            });
    });
    // #12
    test('Check a puzzle placement with invalid characters: POST request to /api/check',function(done){
        const puzzle = '11111112222222233333333.......11111111166666666663333333333888888888t222222222442';
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                coordinate:'A1',
                value:7
            })
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Invalid characters in puzzle');
                done();
            });
    });
    // #13
    test('Check a puzzle placement with incorrect length: POST request to /api/check',function(done){
        const puzzle = '11111112222222233333333.......11111111166666666663333333333888888888122222222244';
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                coordinate:'A1',
                value:7
            })
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Expected puzzle to be 81 characters long');
                done();
            });
    });
    // #14
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check',function(done){
        const puzzle = puzzlesAndSolutions[0][0];
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                coordinate:'A12',
                value:7
            })
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Invalid coordinate');
                done();
            });
    });
    // #14
    test('Check a puzzle placement with invalid placement value: POST request to /api/check',function(done){
        const puzzle = puzzlesAndSolutions[0][0];
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle,
                coordinate:'A1',
                value:12
            })
            .end((err,res)=>{
                const {error} = res.body;
                assert.equal(error,'Invalid value');
                done();
            });
    });

});