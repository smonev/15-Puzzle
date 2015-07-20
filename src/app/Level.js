import React from 'react/addons';
import {Spring} from 'react-motion';
// let classNames = require('classnames');

export default class LevelView extends React.Component {

  static propTypes = {
    level: React.PropTypes.number.isRequired,
    hasWon: React.PropTypes.bool.isRequired,
    tileWidth: React.PropTypes.number.isRequired,
  }

  render() {
    const baseWidth = Math.round(this.props.tileWidth / 4);
    const TILE_FULL_WIDTH = (this.props.tileWidth + baseWidth);
    const TABLE_FULL_HEIGHT = (4 * TILE_FULL_WIDTH);
    let that = this;

    return (
        <Spring endValue={this.endValue.bind(that, that.props.showLevel, TABLE_FULL_HEIGHT)}>
          {x => {
            let style = {
              width: x.val + baseWidth + 'px',
              height: x.val + baseWidth + 'px',
              lineHeight: x.val + baseWidth + 'px',
              fontSize: x.val + (baseWidth / 2) + 'px',
              zIndex: 10,
              overflow: 'hidden',
            };


            return (
              <span className="level" style={style} onClick={this.levelClick.bind(this)} >
                {this.props.level}
              </span>
              );
          }}
        </Spring>
    );
  }

  endValue(showLevel, TABLE_FULL_HEIGHT) {
    return {
      val: showLevel ? TABLE_FULL_HEIGHT : 0,
      config: [200, 15],
    };
  }

  levelClick() {
    this.props.onLevelClick();
  }

  constructor(props) {
    super(props);
  }
}
