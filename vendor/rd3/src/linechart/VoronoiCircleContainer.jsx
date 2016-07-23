'use strict';

const React = require('react');
const { findDOMNode } = require('react-dom');
const shade = require('../utils').shade;
const VoronoiCircle = require('./VoronoiCircle');

module.exports = React.createClass({

  displayName: 'VornoiCircleContainer',

  propTypes: {
    circleRadius: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.object,
    ]),
    circleFill: React.PropTypes.any,
    onMouseOver: React.PropTypes.any,
    dataPoint: React.PropTypes.any,
  },

  getDefaultProps() {
    return {
      circleRadius: 3,
      circleFill: '#1f77b4',
      hoverAnimation: true,
    };
  },

  getInitialState() {
    return {
      circleRadius: this._getCircleRadius(false),
      circleFill: this.props.circleFill,
    };
  },

  _getCircleRadius(active) {
    const circleRadius = this.props.circleRadius;
    if (typeof circleRadius === 'number') {
      if (active) {
        return circleRadius * (5 / 4);
      } else {
        return circleRadius;
      }
    } else {
      if (active) {
        return circleRadius.active;
      } else {
        return circleRadius.inactive;
      }
    }
  },

  _animateCircle() {
    const rect = findDOMNode(this).getElementsByTagName('circle')[0].getBoundingClientRect();
    this.props.onMouseOver.call(this, rect.right, rect.top, this.props.dataPoint);
    this.setState({
      circleRadius: this._getCircleRadius(true),
      circleFill: shade(this.props.circleFill, 0.2),
    });
  },

  _restoreCircle() {
    this.setState({
      circleRadius: this._getCircleRadius(false),
      circleFill: this.props.circleFill,
    });
  },

  _drawPath(d) {
    if (d === undefined) {
      return 'M Z';
    }
    return `M${d.join(',')}Z`;
  },

  render() {
    const props = this.props;

    // animation controller
    let handleMouseOver;
    let handleMouseLeave;
    if (props.hoverAnimation) {
      handleMouseOver = this._animateCircle;
      handleMouseLeave = this._restoreCircle;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    return (
      <g>
        <VoronoiCircle
          handleMouseOver={handleMouseOver}
          handleMouseLeave={handleMouseLeave}
          voronoiPath={this._drawPath(props.vnode)}
          cx={props.cx}
          cy={props.cy}
          circleRadius={this.state.circleRadius}
          circleFill={this.state.circleFill}
        />
      </g>
    );
  },
});
