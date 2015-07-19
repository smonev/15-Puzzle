import React from 'react/addons';
import {Spring} from 'react-motion';

let classNames = require('classnames');

export default class TileView extends React.Component {

  static propTypes = {
    tileMoving: React.PropTypes.bool.isRequired,
    tile: React.PropTypes.any.isRequired,
    animatingTile: React.PropTypes.any,
    width: React.PropTypes.number.isRequired,
    onBoardMouseMove: React.PropTypes.func.isRequired,
    onBoardTouchMove: React.PropTypes.func.isRequired,
    onBoardTouchOrMoveEnd: React.PropTypes.func.isRequired,
  }

  render() {
    let tile = this.props.tile;
    let classArray = ['tile'];

    classArray.push('tile' + this.props.tile.value);
    classArray.push('position_' + tile.row + '_' + tile.column);
    if (tile.value === '') {
      classArray.push('empty');
    }

    let classes = classNames.apply(null, classArray);
    let tileCaption = tile.value !== 'a' ? tile.value : '';
    let margin = Math.round(this.props.width / 8);

    let left;
    let top;
    const TILE_FULL_WIDTH = (this.props.width + margin * 2);
    const TABLE_FULL_HEIGHT = (4 * TILE_FULL_WIDTH);

    if (this.state.tileMoving) {
      left = this.state.startX;
      top = this.state.startY;
    } else {
      left = tile.column * TILE_FULL_WIDTH;
      top = tile.row * TILE_FULL_WIDTH - TABLE_FULL_HEIGHT;
    }

    let endValue = this.endValue.bind(this,
     this.props.animatingTile ? this.props.animatingTile.left + (2 * margin * this.props.animatingTile.column) : left,
     this.props.animatingTile ? this.props.animatingTile.top - TABLE_FULL_HEIGHT + (2 * margin * this.props.animatingTile.row) : top
    );

    return (

      <Spring endValue={endValue}>
        {x => {
          return (
            <span className={classes} style={{
                fontSize: (this.props.width / 1.6) + 'px',
                width: this.props.width + 'px',
                height: this.props.width + 'px',
                margin: margin + 'px',
                transform: 'translate(' + x.left.val + 'px, ' + x.top.val + 'px)  translateZ(0)',
                zIndex: this.state.tileMoving ? 1100 : 1,
              }}
              onMouseDown={this.handleTileMouseDown.bind(this)}
              onMouseUp={this.handleTileMouseUp.bind(this)}
              onMouseMove={this.handleTileMouseMove.bind(this)}
              onTouchStart={this.handleTileTouchStart.bind(this)}
              onTouchEnd={this.handleTileTouchEnd.bind(this)}
              onTouchMove={this.handleTileTouchMove.bind(this)}
              key={tile.id}>{tileCaption}
              </span>
            );
        }}
      </Spring>

    );
  }

  endValue(left, top) {
    return {
      left: {
        val: left,
        config: [500, 20],
      },
      top: {
        val: top,
        config: [500, 20],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      tileMouseDown: false,
      tileMoving: false,
      startX: 0,
      startY: 0,
      startTile: null,
    };

    this.board = document.querySelectorAll('#boardDiv')[0];
  }

  handleTileTouchStart() {
    this.setState({
        tileMouseDown: true,
        startTile: this.props.tile,
    });
  }

  handleTileTouchEnd(event) {
    this.setState({
        tileMoving: false,
        tileMouseDown: false,
    });

    this.props.onBoardTouchOrMoveEnd(event, this, this.state.startTile);
  }

  handleTileMouseDown() {
    this.setState({
        tileMouseDown: true,
        startTile: this.props.tile,
    });
  }

  handleTileMouseUp(event) {
    this.setState({
        tileMoving: false,
        tileMouseDown: false,
    });

    this.props.onBoardTouchOrMoveEnd(event, this, this.state.startTile);
  }

  handleTileTouchMove(event) {
    event.preventDefault();

    if (!this.state.tileMouseDown) {
      return false;
    }

    if (event.changedTouches.length !== 1) {
      return false;
    }

    let dom = React.findDOMNode(this);
    this.setState({
        tileMoving: true,
        startX: event.touches[0].clientX - dom.offsetLeft - this.board.offsetLeft - this.props.width / 2,
        startY: event.touches[0].clientY - dom.offsetTop - this.board.offsetTop - this.props.width / 2,
    });

    this.props.tile.startX = event.touches[0].clientX - this.board.offsetLeft - this.props.width / 2;
    this.props.tile.startY = event.touches[0].clientY - this.board.offsetTop - this.props.width / 2;

    this.props.onBoardTouchMove(event, this);
  }

  handleTileMouseMove(event) {
    if (!this.state.tileMouseDown) {
      return;
    }

    let dom = React.findDOMNode(this);

    this.setState({
        tileMoving: true,
        startX: event.clientX - dom.offsetLeft - this.board.offsetLeft - this.props.width / 2,
        startY: event.clientY - dom.offsetTop - this.board.offsetTop - this.props.width / 2,
    });

    this.props.tile.startX = event.clientX - this.board.offsetLeft - this.props.width / 2;
    this.props.tile.startY = event.clientY - this.board.offsetTop - this.props.width / 2;

    this.props.onBoardMouseMove(event, this);
  };
}
