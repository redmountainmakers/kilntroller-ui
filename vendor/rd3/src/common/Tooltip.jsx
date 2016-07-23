'use strict';

const React = require('react');

module.exports = React.createClass({

  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    dangerousInnerHTML: React.PropTypes.string,
    show: React.PropTypes.bool,
  },

  render() {
    const { show, x, y, dangerousInnerHTML } = this.props;
    const display = show ? 'inherit' : 'none';
    const containerStyles = {
      top: y,
      left: x,
      display,
    };

    // TODO: add 'right: 0px' style when tooltip is off the chart
    return (
      <div className="rd3__tooltip" style={containerStyles}>
        <div
          className="tip"
          dangerouslySetInnerHTML={ { __html : dangerousInnerHTML } }
        />
      </div>
    );
  },
});
