
function isSquare(num){
  return num>0 && Math.sqrt(num) % 1 === 0;
};

class SudokuSolver {

  isLegal(string) {
    const matrix = this.parse(string);
    // check rows
    for(let i=0;i<matrix.length;i++){
      for(let ja=0;ja<matrix.length-1;ja++){
        for(let jb=ja+1;jb<matrix.length;jb++){
          if(matrix[i][ja]&&matrix[i][ja]==matrix[i][jb]){
            return false;
          };
        };
      };
    };
    // check columns
    for(let j=0;j<matrix.length;j++){
      for(let ia=0;ia<matrix.length-1;ia++){
        for(let ib=ia+1;ib<matrix.length;ib++){
          if(matrix[ia][j]&&matrix[ia][j]==matrix[ib][j]){
            return false;
          };
        };
      };
    };
    // check regions
    for(let is=0;is<=6;is+=3){
      for(let js=0;js<=6;js+=3){
        const arr=[];
        for(let i=is;i<is+3;i++){
          for(let j=js;j<js+3;j++){
            arr.push(matrix[i][j]);
          };
        };
        for(let k=0;k<arr.length-1;k++){
          for(let y=k+1;y<arr.length;y++){
            if(arr[k]&&arr[k]==arr[y]){
              return false;
            };
          };
        };
      };
    };
    return true;
  };

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

  parseCoord(string){
    const regex = new RegExp('^([A-I])([1-9])$');
    const result = regex.exec(string);
    if(!result){return {success:false}};
    const row = result[1].charCodeAt(0)-65;
    const column = parseInt(result[2])-1;
    return {row,column,success:true};
  };

  // **
  validate(puzzleString) {
    const regex = new RegExp('^[1-9\\.]{81}$');
    const result = {
      valid: regex.test(puzzleString)
    };
    if(!result.valid){
      result.message = puzzleString.length!==81
        ? 'Expected puzzle to be 81 characters long'
        : 'Invalid characters in puzzle';
    };
    return result;
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
    for(let i=0;i<matrix.length;i++){
      for(let j=0;j<matrix.length;j++){
        if(!matrix[i][j]){
          return {i,j}
        };
      };
    };
    return null;
  };

  isAllowed(matrix,row,column,value){
    let valid = true;
    let conflict = [];
    if(!this.isAllowedRow(matrix,row,column,value)){
      valid = false;
      conflict.push('row');
    };
    if(!this.isAllowedColumn(matrix,row,column,value)){
      valid = false;
      conflict.push('column');
    };
    if(!this.isAllowedRegion(matrix,row,column,value)){
      valid = false;
      conflict.push('region');
    };
    return valid?{valid}:{valid,conflict};
  };

  solveMatrix(matrix){
    // search for an empty cell
    const emptyCell = this.findEmpty(matrix);
    // no empty cell / matrix complete : return true
    if(!emptyCell){return true};
    // empty cell: search for an allowed value
    for(let n=1;n<=matrix.length;n++){
      const {i,j} = emptyCell;
      if(this.isAllowed(matrix,i,j,n).valid){
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
  };

  stringify(matrix){
    return matrix
      .map(row=>(row.join('')))
      .join('');
  };

  solve(puzzleString) {
    // validate string
    if(!this.validate(puzzleString).valid||!this.isLegal(puzzleString)){return null};
    // parse string
    const matrix = this.parse(puzzleString);
    // solve matrix / stringify / return
    if(this.solveMatrix(matrix)){
      return this.stringify(matrix);
    };
    // no solution: return null
    return null;
  };

}

module.exports = SudokuSolver;

