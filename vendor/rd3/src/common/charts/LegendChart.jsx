'use strict';

import { scaleOrdinal, schemeCategory20c } from 'd3-scale';

const React = require('react');
const Legend = require('../Legend');

module.exports = React.createClass({

  displayName: 'LegendChart',

  propTypes: {
    children: React.PropTypes.node,
    createClass: React.PropTypes.string,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    data: React.PropTypes.array,
    height: React.PropTypes.node,
    legend: React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    margins: React.PropTypes.object,
    sideOffset: React.PropTypes.number,
    svgClassName: React.PropTypes.string,
    title: React.PropTypes.node,
    titleClassName: React.PropTypes.string,
    viewBox: React.PropTypes.string,
    width: React.PropTypes.node,
  },

  getDefaultProps() {
    return {
      className: 'rd3-legend-chart',
      colors: scaleOrdinal(schemeCategory20c),
      colorAccessor: (d, idx) => idx,
      data: [],
      legend: false,
      legendPosition: 'right',
      sideOffset: 110,
      svgClassName: 'rd3-chart',
      titleClassName: 'rd3-chart-title',
      title: '',
    };
  },

  _renderLegend() {
    const props = this.props;

    if (props.legend) {
      return (
        <Legend
          colors={props.colors}
          colorAccessor={props.colorAccessor}
          data={props.data}
          legendPosition={props.legendPosition}
          margins={props.margins}
          width={props.sideOffset}
        />
      );
    }

    return null;
  },

  _renderTitle() {
    const props = this.props;

    if (props.title !== '') {
      return (
        <h4
          className={props.titleClassName}
        >
          {props.title}
        </h4>
      );
    }
    return null;
  },

  _renderChart() {
    const props = this.props;

    return (
      <svg
        className={props.svgClassName}
        height="100%"
        viewBox={props.viewBox}
        width="100%"
      >
        {props.children}
      </svg>
    );
  },

  render() {
    const props = this.props;

    return (
      <div
        className={props.className}
        style={{ width: props.width, height: props.height }}
      >
        {this._renderTitle()}
        <div className="container">
          <div className="chart">
            {this._renderChart()}
          </div>
          <div className="legend" style={{ width: props.sideOffset }}>
            {this._renderLegend()}
          </div>
        </div>
      </div>
    );
  },
});
