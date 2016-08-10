'use strict';

const React = require('react');

module.exports = React.createClass({
  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    dangerousInnerHTML: React.PropTypes.string,
    show: React.PropTypes.bool,
    parentWidth: React.PropTypes.number,
  },

  getInitialState() {
    return this._calculateTipDimensions(null);
  },

  _tipRef(el) {
    this._tip = el;
  },

  _calculateTipDimensions(el) {
    if (el) {
      const tipWidth = el.offsetWidth;
      const computedStyle = window.getComputedStyle(el);
      const tipMargin =
        parseInt(computedStyle.getPropertyValue('margin-left'), 10) +
        parseInt(computedStyle.getPropertyValue('margin-right'), 10);
      return { tipWidth, tipMargin };
    } else {
      return {
        tipWidth: 0,
        tipMargin: 0,
      };
    }
  },

  render() {
    const { show, x, y, dangerousInnerHTML, parentWidth } = this.props;
    const { tipWidth, tipMargin } = this.state;
    const display = show ? 'inherit' : 'none';
    const containerStyles = {
      top: y,
      left: x,
      display,
    };

    if (parentWidth && x + tipWidth + tipMargin > parentWidth) {
      containerStyles.left = x - tipWidth - tipMargin;
    }

    if (show && !tipWidth) {
      setTimeout(() => {
        this.setState(this._calculateTipDimensions(this._tip));
      }, 0);
    }

    return (
      <div className="rd3__tooltip" style={containerStyles}>
        <div
          className="tip"
          ref={this._tipRef}
          dangerouslySetInnerHTML={ { __html : dangerousInnerHTML } }
        />
      </div>
    );
  },
});
