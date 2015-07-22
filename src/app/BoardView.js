import React from 'react';

import Board from './Board';
import Cell from './Cell';
import LevelView from './Level';
import TileView from './TileView';

require('../sass/index.scss');

export default class BoardView extends React.Component {

  onBoardMouseMove(event, domElement) {
    this.setState({
      resetTile: null,
    });

    this.state.board.checkForCollision(domElement.props.tile, this.onHoverWhileMoving);
  }

  onBoardTouchMove(event, domElement) {
    this.setState({
      resetTile: null,
    });

    this.state.board.checkForCollision(domElement.props.tile, this.onHoverWhileMoving);
  }

  onBoardTouchOrMoveEnd(event, domElement, fromTile) {
    const that = this;

    this.state.board.checkForCollision(domElement.props.tile, function(toTile) {
      let newTiles;
      if (typeof toTile !== 'undefined') {
        newTiles = this.move(fromTile, toTile);
        that.setState({
          resetTile: null,
        });
      } else {
        that.setState({
          resetTile: fromTile,
        });
      }

      if (typeof newTiles !== 'undefined') {
        that.state.board.tiles = newTiles;
        that.setState({
          board: that.state.board,
          fromTile: fromTile,
          toTile: toTile,
        });

        if (that.state.board.hasWon()) {
          that.setState({
            hasWon: true,
            showLevel: true,
          });

          that.state.level = that.state.level + 1;
          that.state.board.tiles = that.state.board.initializeLevel(that.state.level);

          that.setState({
            board: that.state.board,
            level: that.state.level,
          });
        }
      } else {
        that.setState({
          resetTile: fromTile,
        });
      }
    });

    let hovered = document.querySelector('.hovered');
    if (hovered !== null) {
      hovered.classList.remove('hovered');
    }
  }

  onHoverWhileMoving(tile) {
    if (typeof tile !== 'undefined') {
      let newHovered = document.querySelector('.position_' + tile.row + '_' + tile.column);
      let hovered = document.querySelector('.hovered');

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
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.mousemove.bind(this));
  }

  onLevelClick() {
    this.setState({
      showLevel: !this.state.showLevel,
    });
  }

  render() {
    const that = this;
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
      let animatingTile;
      if (tile === that.state.resetTile) {
        animatingTile = tile;
      }

      return (
        <TileView tile={tile}
          animatingTile={animatingTile}
          onBoardMouseMove={that.onBoardMouseMove.bind(that)}
          onBoardTouchMove={that.onBoardTouchMove.bind(that)}
          onBoardTouchOrMoveEnd={that.onBoardTouchOrMoveEnd.bind(that)}
          tileMoving={false}
          key={tile.id}
          mousemoveEvent={that.state.mousemoveEvent}
          width={that.state.board.CELL_WIDTH} />
      );
    });

    return (
      <div className="board" tabIndex="1">
        <LevelView
          level={that.state.level}
          tileWidth={that.state.board.CELL_WIDTH}
          hasWon={that.state.hasWon}
          showLevel={that.state.showLevel}
          onLevelClick={that.onLevelClick.bind(that)}
        />
        {cells}
        {tiles}
      </div>
    );
  }

  mousemove(event) {
    event.preventDefault();
    this.setState({
      mousemoveEvent: event, // Whole event? hmm
    });
  }

  constructor() {
    super();
    this.state = {
      board: new Board(),
      level: 1,
      showLevel: false,
      mousemoveEvent: null,
    };
  }
}
