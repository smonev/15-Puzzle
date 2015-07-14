import React from 'react/addons';

let classNames = require('classnames');

export default class TileView extends React.Component {

  static propTypes = {
    tileMoving: React.PropTypes.bool.isRequired,
    tile: React.PropTypes.any.isRequired,
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

    let classes = classNames.apply(null, classArray);
    let tileCaption = tile.value !== 'a' ? tile.value : '';
    let margin = Math.round(this.props.width / 8);

    let style = {
      transform: 'none',
      zIndex: 1,
      top: 5 + (tile.row) * (this.props.width + margin * 2) + 'px',
      left: 5 + (tile.column) * (this.props.width + margin * 2) + 'px',
      fontSize: (this.props.width / 1.6) + 'px',
      width: this.props.width + 'px',
      height: this.props.width + 'px',
      margin: margin + 'px',
    };

    if (this.state.tileMoving) {
      style.transform = 'translate(' + (this.state.startX) + 'px, ' + (this.state.startY) + 'px)  translateZ(0)';
      style.zIndex = 1100;
      style.pading = 3000;
    }

    return (
      <span className={classes} style={style}
          onMouseDown={this.handleTileMouseDown.bind(this)}
          onMouseUp={this.handleTileMouseUp.bind(this)}
          onMouseMove={this.handleTileMouseMove.bind(this)}
          onTouchStart={this.handleTileTouchStart.bind(this)}
          onTouchEnd={this.handleTileTouchEnd.bind(this)}
          onTouchMove={this.handleTileTouchMove.bind(this)}
          key={tile.id}>{tileCaption}</span>
    );
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

    return false;
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
