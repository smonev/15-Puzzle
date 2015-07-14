import React from 'react';
import Board from './Board';
import Cell from './Cell';
import TileView from './TileView';

require('../sass/index.scss');

export default class BoardView extends React.Component {

  onBoardMouseMove(event, domElement) {
    this.state.board.checkForCollision(domElement.props.tile, this.onHoverWhileMoving);
  }

  onBoardTouchMove(event, domElement) {
    this.state.board.checkForCollision(domElement.props.tile, this.onHoverWhileMoving);
  }

  onBoardTouchOrMoveEnd(event, domElement, fromTile) {
    let hovered;
    const that = this;
    this.state.board.checkForCollision(domElement.props.tile, function(toTile) {
      let newTiles = this.move(fromTile, toTile);
      newTiles = (typeof newTiles !== 'undefined') ? newTiles : that.state.board.tiles;

      that.state.board.tiles = newTiles;
      that.setState({board: that.state.board});
    });

    hovered = document.querySelector('.hovered');
    if (hovered !== null) {
      hovered.classList.remove('hovered');
    }
  }

  onHoverWhileMoving(tyle) {
    let hovered;
    let newHovered;

    newHovered = document.querySelector('.position_' + tyle.row + '_' + tyle.column);
    hovered = document.querySelector('.hovered');

    if ((hovered !== null) && (newHovered !== null)) {
      if (hovered !== newHovered) {
        hovered.classList.remove('hovered');
        newHovered.classList.add('hovered');
      }
    } else if (hovered !== null) {
      hovered.classList.remove('hovered');
    } else if (newHovered !== null) {
      newHovered.classList.add('hovered');
    }
  }

  render() {
    const that = this;

    if (!this.state) {
      return <div />;
    }

    const cells = this.state.board.cells.map(function(row, i) {
      return (
              <div key={i}>
                {row.map(
                  function(item, j) {
                    return <Cell width={that.state.board.CELL_WIDTH} key={j} />;
                  }
                )}
              </div>
            );
    });

    const tiles = this.state.board.tiles.filter(function(tile) {
      return tile.value !== 0;
    }).map(function(tile) {
      const tileMoving = false;
      return (
          <TileView tile={tile}
            onBoardMouseMove={that.onBoardMouseMove.bind(that)}
            onBoardTouchMove={that.onBoardTouchMove.bind(that)}
            onBoardTouchOrMoveEnd={that.onBoardTouchOrMoveEnd.bind(that)}
            tileMoving={tileMoving}
            key={tile.id}
            width={that.state.board.CELL_WIDTH} />
      );
    });
    return (
      <div className="board" tabIndex="1">
        {cells}
        {tiles}
      </div>
    );
  }

  constructor() {
    super();
    this.state = {
      board: new Board(),
    };
  }

}
