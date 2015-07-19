import Tile from './Tile';

const SIZE = 4;

export default class Board {

  calcCellWidth() {
    if (window.innerWidth > window.innerHeight) {
      return Math.round(window.innerHeight / (SIZE + 2));
    } else {
      return Math.round(window.innerWidth / (SIZE + 2));
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  findTileByRowAndColumn(row, column) {
    let result = null;
    this.tiles.forEach(function(tile) {
      if ((tile.row === row) && (tile.column === column)) {
        result = tile; // todo break it
      }
    });

    return result;
  }

  initializeLevel(level) {
    let emptyTile = this.tiles[15];
    let movesCount = 0;
    let fromTile;
    let whereTo;

    while (movesCount < (level * 10)) {
      whereTo = this.getRandomInt(1, 4);

      if (whereTo === 1) {
        // up
        fromTile = this.findTileByRowAndColumn(emptyTile.row - 1, emptyTile.column);
      } else if (whereTo === 2) {
        // down
        fromTile = this.findTileByRowAndColumn(emptyTile.row + 1, emptyTile.column);
      } else if (whereTo === 3) {
        // left
        fromTile = this.findTileByRowAndColumn(emptyTile.row, emptyTile.column - 1);
      } else if (whereTo === 4) {
        // right
        fromTile = this.findTileByRowAndColumn(emptyTile.row, emptyTile.column + 1);
      }

      if ((fromTile !== null) && (fromTile !== emptyTile)) {
        let tiles = this.move(fromTile, emptyTile);
        if (tiles) {
          movesCount = movesCount + 1;
          emptyTile = fromTile;
        }
      }
    }

    return this.tiles;
  }

  constructor() {
    this.tiles = [];
    this.cells = [];
    this.size = SIZE;
    this.answer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ''];

    this.CELL_WIDTH = this.calcCellWidth();
    this.CELL_PADDING = Math.random(this.CELL_WIDTH / 7);

    this.addTilesAndCells();
    this.setPositions();
    this.initializeLevel(1);
  }

  addTilesAndCells() {
    let counter = 0;
    for (let r = 0; r < this.size; r++) {
      this.cells[r] = [];
      for (let c = 0; c < this.size; c++) {
        counter = counter + 1;
        let tile = new Tile(counter < 16 ? counter : '');
        this.cells[r][c] = tile;
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
    let halfTile = Math.round(this.cells[0][0].width / 2);
    let margin = Math.round(this.cells[0][0].width / 7);

    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        let tile = this.cells[i][j];

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

    if (!detected) {
      callback.call(this);
    }
  }

  move(fromTile, toTile) {
    if (((Math.abs(fromTile.column - toTile.column)) + (Math.abs(fromTile.row - toTile.row)) === 1) && (toTile.value === '')) {
      let indexFromTile = this.tiles.indexOf(fromTile);
      let indexToTile = this.tiles.indexOf(toTile);
      let tileValue = this.tiles[indexToTile].value;

      this.tiles[indexToTile].value = this.tiles[indexFromTile].value;
      this.tiles[indexFromTile].value = tileValue;

      return this.tiles;
    }
  }

  hasWon() {
    let that = this;
    let won = true;
    this.tiles.forEach(function(tile, i) {
      won = won && that.answer[i] === tile.value;
    });

    return won;
  }
}

