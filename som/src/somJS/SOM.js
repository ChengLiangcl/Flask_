
/**
 * A single node in the SOM
 */
class Node {
  /**
   * @param {*} y y-coordinate of the node in the SOM
   * @param {*} x x-coordinate of the node in the SOM
   * @param {*} vector reference vector in higher dimensional space
   */
  constructor(y, x, vector, label) {
    this.x = x
    this.y = y
    this.vector = vector
    this.neighbours = {}
    this.label = label
  }

  /**
   * use https://mathjs.org/docs/datatypes/matrices.html 
   * @param {'top-left'|'top-right'|'left'|'bottom-left'|'bottom-right'|'right'} position position of the neighbour relative to this node
   * @returns Euclidean distance to that neighbour
   */
  getDistance(position) {
    const neighbour = this.neighbours[position]
    if(neighbour) {
      let distance = 0

      for(let i = 0; i < this.vector.length; i++) {
        const diff = this.vector[i] - neighbour.vector[i]
        distance += diff * diff
      }
      return Math.sqrt(distance)

    } else {
      return null
    }
  }

  /**
   * @returns Returns the average distance between this vector and its immediate neighbours
   */
  getAverageDistance() {
    const neighbours = Object.keys(this.neighbours)
    return neighbours.map(neighbour => this.getDistance(neighbour))
          .reduce((sum, val) => sum + val, 0) / neighbours.length
  }

  /**
   * @returns Returns the max distance between this vector and its immediate neighbours
   */
  getMaxDistance() {
    return Math.max(...Object.keys(this.neighbours).map(neighbour => this.getDistance(neighbour)))
  }

  /**
   * @returns Returns the min distance between this vector and its immediate neighbours
   */
  getMinDistance() {
    return Math.min(...Object.keys(this.neighbours).map(neighbour => this.getDistance(neighbour)))
  }
}

/**
 * Hexagonal SOM
 */
class SOM {

  /**
   * yDim: the number of rows (containing vectors)
   * xDim: the number of columns 
   * @param {Node[][]} nodeGrid a 2D array of nodes in the format [yDim][xDim]
   * @param {number} vectorDim dimension of each node's reference vector
   * @param {number} xDim size of the vectorGrid's x dimension -> column of umatrix
   * @param {number} yDim size of the vectorGrid's y dimension -> row of umatrix
   */
  constructor(nodeGrid, vectorDim, xDim, yDim) {
    this.grid = nodeGrid
    this.vectorDim = vectorDim // 5
    this.xDim = xDim // 12
    this.yDim = yDim // 8
  }

  /**
   * @param {number} colNum 
   * @param {number} rowNum 
   * @returns {boolean} whether coordinates (colNum, rowNum) is out of bounds in the SOM vector grid 
   */
  inBounds(rowNum, colNum) {
    return colNum >= 0 && colNum < this.xDim
    && rowNum >= 0 && rowNum < this.yDim;
  }

  /**
   * @param {number} rowNum 
   * @param {number} colNum 
   * @returns a dictionary of functions that calculates the (x,y) coordinates of the neighbour vectors of the vector at (rowNum, colNum)
   */
  neighbourCalculators(rowNum, colNum) {
    // hexagons on odd-indexed rows are shifted forward once, compared to hexagons on even-indexed rows
    const rowIndexShift = (rowNum % 2 === 0) ? 0 : 1

    return {
      'top-left':     () => [colNum - 1 + rowIndexShift,  rowNum - 1],
      'top-right':    () => [colNum + rowIndexShift,      rowNum - 1],
      'left':         () => [colNum - 1,                  rowNum],
      'right':        () => [colNum + 1,                  rowNum],
      'bottom-left':  () => [colNum - 1 + rowIndexShift,  rowNum + 1],
      'bottom-right': () => [colNum + rowIndexShift,      rowNum + 1]
    }
  }

  /**
   * Set the immediate neighbours of each vector in the SOM
   */
  calculateAllNeighbours() {
    for (let rowNum = 0; rowNum < this.yDim; rowNum++) {
      for (let colNum = 0; colNum < this.xDim; colNum++) {
        this.calculateNeighbours(rowNum, colNum)
      }
    }
  }

  /**
   * Set the immediate neighbour vectors of the hexagon at (colNum, rowNum)
   * @param {number} rowNum 
   * @param {number} colNum 
   */
  calculateNeighbours(rowNum, colNum) {
    const hexagon = this.grid[rowNum][colNum] // current vector

    for (const [key, getCoordinates] of Object.entries(this.neighbourCalculators(rowNum, colNum))) {
      const [x, y] = getCoordinates() // x-colNum, y-rowNum

      // set neighbour vectors
      if (this.inBounds(y, x)) {
        const neighbour = this.grid[y][x]
        hexagon.neighbours[key] = neighbour // set the neighbours dictionary of class Node (hexagon)
      }
    }
  }

  /**
   * to set colors for hexagons
   * @returns returns the maximum distance between any 2 neighbouring vectors in the SOM
   */
  getMaxDistance() {
    return Math.max(
          ...this.grid.map(row => 
          Math.max(...row.map(hexagon => 
          hexagon.getMaxDistance()))))
  }

  /**
   * to set colors for hexagons
   * @returns returns the minimum distance between any 2 neighbouring vectors in the SOM
   */
   getMinDistance() {
    return Math.min(
          ...this.grid.map(row => 
          Math.min(...row.map(hexagon => 
          hexagon.getMinDistance()))))
  }
}

/**
 * @param {number[][][]} vectorGrid a 2D array of vectors in the format [yDim][xDim][vectorDim]
 * grid[0] = row of vectors
 * grid[0][0] = single vector
 * grid[0][0][0] = first number in vector
 * @param {number} vectorDim dimension of each vector
 * @param {number} xDim size of the vectorGrid's x dimension
 * @param {number} yDim size of the vectorGrid's y dimension
 * @returns A SOM object
 */
function constructSOM(vectorGrid, vectorDim, xDim, yDim) {
  const grid = vectorGrid.map((vectorRow, rowNum) => // rowNum: 8
                vectorRow.map((vector, colNum) =>  // colNum: 12
                new Node(rowNum, colNum, vector.slice(0, vectorDim), vector.length > vectorDim ? vector[vectorDim] : null)))
  //console.log(`SOM.js grid: ${grid.vector}, label is: ${grid.label}`);
  const som = new SOM(grid, vectorDim, xDim, yDim)
  som.calculateAllNeighbours()
  return som
}

/**
 * Given a flattened array of vectors, convert them to a 2D array of vectors (which is a 3D array of numbers)
 * @param {string[]} vectorArr A flattened array of vectors in string format
 * @param {number} vectorDim Number of elements per vector in the SOM
 * @param {number} xDim Number of nodes on the x dimension in the SOM
 * @param {number} yDim Number of nodes on the y dimension in the SOM
 * @returns {number[][][]} A 2D array of vectors
 */
function getVectorGrid(vectorArr, vectorDim, xDim, yDim) {
  const vectorGrid = Array(yDim)
  for (let rowNum = 0; rowNum < yDim; rowNum++) {
    const vectorRow = Array(xDim)

    for (let colNum = 0; colNum < xDim; colNum++) {
      const dirtyVector = vectorArr[rowNum * xDim + colNum].split('\n').map(num => num);
      const currentVector = dirtyVector[0]
        .split(' ')
        .map((num, index) => index > vectorDim-1 ? num : parseFloat(num)) // contain labels
      
      vectorRow[colNum] = currentVector
    }
    //console.log("SOM.js vector row: ", vectorRow);
    vectorGrid[rowNum] = vectorRow
  }

  return vectorGrid
}

/**
 * Generates a SOM given ./ex.cod
 * @returns {SOM} 
 */
async function getSOM(model) {
  const vectorDim = parseInt(model.Model_info["vectorDim"])
  const xDim = parseInt(model.Model_info["xDim"])
  const yDim = parseInt(model.Model_info["yDim"])
  const vectorGrid = getVectorGrid(model.data, vectorDim, xDim, yDim)
  return constructSOM(vectorGrid, vectorDim, xDim, yDim)
}

export { getSOM }