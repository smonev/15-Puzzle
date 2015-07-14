let Tile = function(value, row, column) {
  this.value = value || '';
  this.row = row || -1;
  this.column = column || -1;
  this.id = Tile.id++;
};

Tile.id = 0;

const SIZE = 4;

export default class Board {

  calcCellWidth() {
    if (window.innerWidth > window.innerHeight) {
      return Math.round(window.innerHeight / (SIZE + 2));
    } else {
      return Math.round(window.innerWidth / (SIZE + 2));
    }
  }

  constructor() {
    this.tiles = [];
    this.cells = [];
    this.size = SIZE;

    this.CELL_WIDTH = this.calcCellWidth();
    this.CELL_PADDING = Math.random(this.CELL_WIDTH / 7);

    this.addCells();
    this.addTiles();
    this.setPositions();
  }

  createTile() {
    let res = new Tile();
    Tile.apply(res, arguments);
    return res;
  }

  addCells() {
    for (let i = 0; i < this.size; ++i) {
      this.cells[i] = [this.createTile(), this.createTile(), this.createTile(), this.createTile()];
    }
  }

  addTiles() {
    let counter = 0;
    for (let r = 0; r < this.size; ++r) {
      for (let c = 0; c < this.size; ++c) {
        counter = counter + 1;
        if (counter < 16) {
          this.cells[r][c] = this.createTile(counter);
        } else {
          this.cells[r][c] = this.createTile('');
        }

        this.tiles.push(this.cells[r][c]);
      }
    }
  }

  setPositions() {
    const that = this;
    this.cells.forEach(function(row, rowIndex) {
      row.forEach(function(cell, columnIndex) {
        cell.row = rowIndex;
        cell.column = columnIndex;
        cell.top = rowIndex * that.CELL_WIDTH;
        cell.left = columnIndex * that.CELL_WIDTH;
        cell.width = Math.round(that.CELL_WIDTH * 0.7);
        cell.height = Math.round(that.CELL_WIDTH * 0.7);
      });
    });
  }

  checkForCollision(handleTile, callback) {
    let detected = false;
    let i;
    let j;
    let tile;
    let halfTile = Math.round(this.cells[0][0].width / 2);
    let margin = Math.round(this.cells[0][0].width / 7);

    for (i = 0; i < this.cells.length; i++) {
      for (j = 0; j < this.cells[i].length; j++) {
        tile = this.cells[i][j];

        if (tile !== handleTile) {
          if (
            (tile.left + halfTile + (margin * 2 * j) < handleTile.startX + handleTile.width) &&
            (tile.left + tile.width + (margin * 2 * j) > handleTile.startX) &&
            (tile.top + halfTile + (margin * 2 * i) < handleTile.startY + handleTile.height) &&
            (tile.top + tile.height + (margin * 2 * i) > handleTile.startY)
          ) {
            detected = true;
            callback.call(this, tile);
            break;
          }
        }
      }

      if (detected) {
        break;
      }
    }
  }

  move(fromTile, toTile) {
    let tileValue;
    let indexFromTile;
    let indexToTile;

    if ((Math.abs(fromTile.column - toTile.column)) + (Math.abs(fromTile.row - toTile.row)) === 1) {
      indexFromTile = this.tiles.indexOf(fromTile);
      indexToTile = this.tiles.indexOf(toTile);

      tileValue = this.tiles[indexToTile].value;
      this.tiles[indexToTile].value = this.tiles[indexFromTile].value;
      this.tiles[indexFromTile].value = tileValue;

      return this.tiles;
    }
  }

  hasWon() {
    return this.won;
  }

  hasLost() {
    let canMove = true;
    return !canMove;
  }
}

