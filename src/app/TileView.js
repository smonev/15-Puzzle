import React from 'react/addons';
import {Spring} from 'react-motion';

let classNames = require('classnames');

export default class TileView extends React.Component {

  static propTypes = {
    tile: React.PropTypes.any.isRequired,
    resetTile: React.PropTypes.any,
    hasMoved: React.PropTypes.bool.isRequired,
    hasWon: React.PropTypes.bool.isRequired,
    mousemoveEvent: React.PropTypes.any,
    width: React.PropTypes.number.isRequired,
    onBoardTouchOrMouseMove: React.PropTypes.func.isRequired,
    onBoardTouchOrMoveStart: React.PropTypes.func.isRequired,
    onBoardTouchOrMoveEnd: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.dom = this.dom ? this.dom : React.findDOMNode(this);
  }

  shouldComponentUpdate(newProps, newState) {
    if (
        (!this.state.tileMoving) &&
        (
          (newProps.hasWon) ||
          (newProps.hasMoved)
        )
    ) {
      return true;
    }

    if (
        (!this.state.tileMoving) &&

        (this.props.tile.value !== '') &&
        (newProps.tile.value !== '') &&

        (this.props.tile.value === newProps.tile.value) &&
        (this.props.tile.row === newProps.tile.row) &&
        (this.props.tile.column === newProps.tile.column) &&

        (this.props.width === newProps.width) &&
        (this.state.tileMoving === newState.tileMoving) &&
        (this.state.tileMouseDown === newState.tileMouseDown)
    ) {
      return false;
    }

    return true;
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
    let margin = Math.round(this.props.width / 8);

    const TILE_FULL_WIDTH = (this.props.width + margin * 2);
    const TABLE_FULL_HEIGHT = (4 * TILE_FULL_WIDTH);

    let left = tile.column * TILE_FULL_WIDTH;
    let top = tile.row * TILE_FULL_WIDTH - TABLE_FULL_HEIGHT;

    if (this.state.tileMoving) {
      if (!this.props.mousemoveEvent) {
        // console.log('hmm'); // we should never end here
        left = tile.column * TILE_FULL_WIDTH;
        top = tile.row * TILE_FULL_WIDTH - TABLE_FULL_HEIGHT;
      } else {
        let touchOrMouseClientX = this.props.mousemoveEvent.touches ? this.props.mousemoveEvent.touches[0].clientX : this.props.mousemoveEvent.clientX;
        let touchOrMouseClientY = this.props.mousemoveEvent.touches ? this.props.mousemoveEvent.touches[0].clientY : this.props.mousemoveEvent.clientY;

        left = touchOrMouseClientX - this.dom.offsetLeft - this.board.offsetLeft - this.props.width / 2;
        top = touchOrMouseClientY - this.dom.offsetTop - this.board.offsetTop - this.props.width / 2;
      }
    }

    let endValue = this.endValue.bind(this,
     this.props.resetTile ? this.props.resetTile.left + (2 * margin * this.props.resetTile.column) : left,
     this.props.resetTile ? this.props.resetTile.top - TABLE_FULL_HEIGHT + (2 * margin * this.props.resetTile.row) : top
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
                // color: '#' + Math.random().toString().substring(2, 8),

                // transform: 'translate(' + x.left.val + 'px, ' + x.top.val + 'px)  translateZ(0)',
                // WebkitTransform: 'translate(' + x.left.val + 'px, ' + x.top.val + 'px)  translateZ(0)',
                // MozTransform: 'translate(' + x.left.val + 'px, ' + x.top.val + 'px)  translateZ(0)',
                // OTransform: 'translate(' + x.left.val + 'px, ' + x.top.val + 'px)  translateZ(0)',
                // msTransform: 'translate(' + x.left.val + 'px, ' + x.top.val + 'px)  translateZ(0)',

                transform: 'translate3d(' + x.left.val + 'px, ' + x.top.val + 'px, 0)',
                WebkitTransform: 'translate3d(' + x.left.val + 'px, ' + x.top.val + 'px, 0)',
                MozTransform: 'translate3d(' + x.left.val + 'px, ' + x.top.val + 'px, 0)',
                OTransform: 'translate3d(' + x.left.val + 'px, ' + x.top.val + 'px, 0)',
                msTransform: 'translate3d(' + x.left.val + 'px, ' + x.top.val + 'px, 0)',

                zIndex: this.state.tileMoving ? 1100 : 1,
              }}
              onMouseDown={this.handleTileTouchOrMoveStart.bind(this)}
              onTouchStart={this.handleTileTouchOrMoveStart.bind(this)}

              onMouseMove={this.handleTileTouchOrMouseMove.bind(this)}
              onTouchMove={this.handleTileTouchOrMouseMove.bind(this)}

              onMouseUp={this.handleTileTouchOrMoveEnd.bind(this)}
              onTouchEnd={this.handleTileTouchOrMoveEnd.bind(this)}

              key={tile.id}>{tile.value}
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
    };

    this.board = document.querySelectorAll('#boardDiv')[0];
  }

  handleTileTouchOrMoveStart(event) {
    this.setState({
        tileMouseDown: true,
    });

    this.props.onBoardTouchOrMoveStart();

    event.stopPropagation();
  }

  handleTileTouchOrMoveEnd(event) {
    this.setState({
        tileMoving: false,
        tileMouseDown: false,
    });

    this.props.onBoardTouchOrMoveEnd(event, this, this.props.tile);

    event.stopPropagation();
  }

  handleTileTouchOrMouseMove(event) {
    event.preventDefault();

    let handleEvent = true;

    if (!this.state.tileMouseDown) {
      handleEvent = false;
    }

    if ((typeof event.changedTouches !== 'undefined') && (event.changedTouches.length !== 1)) {
      handleEvent = false;
    }

    if (handleEvent) {
      this.setState({
          tileMoving: true,
      });

      let touchOrMouseClientX = event.touches ? event.touches[0].clientX : event.clientX;
      let touchOrMouseClientY = event.touches ? event.touches[0].clientY : event.clientY;

      this.props.tile.startX = touchOrMouseClientX - this.board.offsetLeft - this.props.width / 2;
      this.props.tile.startY = touchOrMouseClientY - this.board.offsetTop - this.props.width / 2;
      this.props.onBoardTouchOrMouseMove(event, this);
    }

    event.stopPropagation();
  }
}
