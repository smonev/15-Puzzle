import React from 'react';

export default class Cell extends React.Component {

  static propTypes = {
    width: React.PropTypes.number.isRequired,
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const margin = Math.round(this.props.width / 8);

    const style = {
        width: this.props.width + 'px',
        height: this.props.width + 'px',
        margin: margin + 'px',
    };

    return (
      <span style={style} className="cell">{''}</span>
    );
  }
}
