
function isSquare(num){
  return num>0 && Math.sqrt(num) % 1 === 0;
};

class SudokuSolver {

  parse(string) {
  // converts string into matrix
    const dimString = string.length;
    if(!isSquare(dimString)){throw new Error('Non square string')};
    const dim = Math.sqrt(dimString);
    const arr = [];
    for(let i=0;i<dim;i++){
      const row = [];
      for(let j=0;j<dim;j++){
        const element = string[i*dim+j];
        row.push(element!=='.'?parseInt(element):0);
      };
      arr.push(row);
    };
    return arr;
  };

  // checkArray(arr){
  //   let check = true;
  //   for(let i=0;i<arr.length-1;i++){
  //     for(let j=i+1;j<arr.length;j++){
  //       if(arr[i]===arr[j]){check=false}
  //     };
  //   };
  //   return check;
  // };

  // getRegion(matrix,i,j){
  // // returns area in array form
  //   const n=3;
  //   const i0 = n*Math.trunc(i/n);
  //   const i1 = i0+n-1;
  //   const j0 = n*Math.trunc(j/n);
  //   const j1 = j0+n-1;
  //   const area = [];
  //   for(let i=i0;i<=i1;i++){
  //     for(let j=j0;j<=j1;j++){
  //       area.push(matrix[i][j])
  //     };
  //   };
  //   return area;
  // };
  
  // getColumn(matrix,j){
  //   const column = [];
  //   for(let i=0;i<matrix.length;i++){
  //     column.push(matrix[i][j]);
  //   };
  //   return column;
  // };

  // **
  validate(puzzleString) {
    const regex = new RegExp('[1-9\\.]{81}')
    return regex.test(puzzleString);
  }

  isAllowedRow(matrix,row,column,value){
    // if cell is already occupied with value, return true
    if(matrix[row][column]==value){return true};
    // check if row already contains value
    for(let j=0;j<matrix.length;j++){
      if(matrix[row][j]==value){return false}
    };
    return true;
  };

  // **
  checkRowPlacement(puzzleString, row, column, value) {
    const matrix = this.parse(puzzleString);
    return this.isAllowedRow(matrix,row,column,value);
  };

  isAllowedColumn(matrix,row,column,value){
    // if cell is already occupied with value, return true
    if(matrix[row][column]==value){return true};
    // check if column already contains value
    for(let i=0;i<matrix.length;i++){
      if(matrix[i][column]==value){return false}
    };
    return true;
  }

  // **
  checkColPlacement(puzzleString, row, column, value) {
    const matrix = this.parse(puzzleString);
    return this.isAllowedColumn(matrix,row,column,value);
  }

  isAllowedRegion(matrix,row,column,value){
    // if cell is already occupied with value, return true
    if(matrix[row][column]==value){return true};
    // check if region already contains value
    const sqrDim=Math.floor(Math.sqrt(matrix.length));
    const i0=row-row%sqrDim;
    const j0=column-column%sqrDim;
    for(let i=i0;i<i0+sqrDim;i++){
      for(let j=j0;j<j0+sqrDim;j++){
        if(matrix[i][j]==value){return false}
      };
    };
    return true;
  };

  checkRegionPlacement(puzzleString, row, column, value) {
    const matrix=this.parse(puzzleString);
    return this.isAllowedRegion(matrix,row,column,value);
  };

  findEmpty(matrix){
    for(i=0;i<matrix.length;i++){
      for(j=0;j<matrix.length;j++){
        if(!matrix[i][j]){
          return {i,j}
        };
      };
    };
    return null;
  };

  isAllowed(matrix,row,column,value){
    return (
      this.isAllowedRow(matrix,row,column,value) &&
      this.isAllowedColumn(matrix,row,column,value) &&
      this.isAllowedRegion(matrix,row,column,value)
    );
  };

  solveMatrix(matrix){
    // search for an empty cell
    const emptyCell = this.findEmpty(matrix);
    // no empty cell / matrix complete : return true
    if(!emptyCell){return true};
    // empty cell: search for an allowed value
    for(let n=0;n<=matrix.length;n++){
      const {i,j} = emptyCell;
      if(this.isAllowed(matrix,i,j,n)){
        // insert allowed number in empty cell
        matrix[i][j]=n;
        // try to solve
        if(this.solveMatrix(matrix)){
          return true
        }else{
        // if n does not bring to solution, replace
          matrix[i][j]=0;
        }
      };
    };
    return false;
  }

  stringify(matrix){
    return matrix
      .map(row=>(row.join()))
      .join();
  };

  solve(puzzleString) {
    const matrix = parse(puzzleString);
    if(this.solveMatrix(matrix)){
      return this.stringify(matrix);
    };
    return null;
  };

}

module.exports = SudokuSolver;

