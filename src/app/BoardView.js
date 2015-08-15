import React from 'react';

import Board from './Board';
import Cell from './Cell';
import LevelView from './Level';
import TileView from './TileView';

require('../sass/index.scss');

export default class BoardView extends React.Component {

  componentDidMount() {
    document.addEventListener('mousemove', this.mousemove.bind(this));
    document.addEventListener('touchmove', this.mousemove.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.mousemove.bind(this));
    document.removeEventListener('touchmove', this.mousemove.bind(this));
  }

  onBoardTouchOrMouseMove(event, domElement) {
    if (this.state.resetTile) {
      this.setState({
        resetTile: null,
      });
    }

    this.state.board.checkForCollision(domElement.props.tile, this.onHoverWhileMoving);
  }

  onBoardTouchOrMoveStart() {
    this.setState({
      hasMoved: false,
      hasWon: false,
    });
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
          hasMoved: true,
        });

        if (that.state.board.hasWon()) {
          that.state.level = that.state.level + 1;
          that.state.board.tiles = that.state.board.initializeLevel(that.state.level);

          that.setState({
            board: that.state.board,
            level: that.state.level,
            hasWon: true,
            tileBackgroundColor: that.chooseTileBackgroundColor(),
            tileRadius: that.chooseTileRadius(),
            showLevel: true,
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
      let resetTile;
      if (tile === that.state.resetTile) {
        resetTile = tile;
      }

      return (
        <TileView tile={tile}
          key={tile.id}
          resetTile={resetTile}
          mousemoveEvent={that.state.mousemoveEvent}
          width={that.state.board.CELL_WIDTH}
          hasWon={that.state.hasWon}
          hasMoved={that.state.hasMoved}
          tileBackgroundColor={that.state.tileBackgroundColor}
          tileRadius={that.state.tileRadius}
          onBoardTouchOrMouseMove={that.onBoardTouchOrMouseMove.bind(that)}
          onBoardTouchOrMoveStart={that.onBoardTouchOrMoveStart.bind(that)}
          onBoardTouchOrMoveEnd={that.onBoardTouchOrMoveEnd.bind(that)} />
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
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      mousemoveEvent: event, // Whole event? hmm
    });
  }

  chooseTileBackgroundColor() {
    const colors = ['8bc34a', 'ffeb3b', 'ffc107', 'ff5722', 'e91e63', '259b24', 'cddc39', 'ff9800', 'e51c23', '9c27b0', '3f51b5', '03a9f4', '00bcd4', '607d8b', '673ab7', '5677fc', '009688', '795548'];
    return '#' + colors[Math.floor(Math.random() * colors.length)];
  }

  chooseTileRadius() {
    let maximum = 50;
    let minimum = 0;
    let randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    return randomnumber + '%';
  }

  constructor() {
    super();
    this.state = {
      board: new Board(),
      level: 1,
      showLevel: false,
      mousemoveEvent: null,
      hasWon: false,
      hasMoved: false,
      tileBackgroundColor: this.chooseTileBackgroundColor(),
      tileRadius: this.chooseTileRadius(),
    };
  }
}
