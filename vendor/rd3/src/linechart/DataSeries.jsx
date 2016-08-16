'use strict';

import { voronoi } from 'd3-voronoi';
import { line, curveLinear } from 'd3-shape';

const React = require('react');
const VoronoiCircleContainer = require('./VoronoiCircleContainer');
const Line = require('./Line');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    color: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    data: React.PropTypes.array,
    interpolationCurve: React.PropTypes.func,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    hoverAnimation: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      data: [],
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      interpolationCurve: curveLinear,
      hoverAnimation: false,
    };
  },

  _isDate(d, accessor) {
    return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },

  render() {
    const props = this.props;
    const xScale = props.xScale;
    const yScale = props.yScale;
    const xAccessor = props.xAccessor;
    const yAccessor = props.yAccessor;

    const interpolatePath = line()
        .defined((d) => d.y !== null && typeof d.y !== 'undefined')
        .y((d) => props.yScale(yAccessor(d)))
        .curve(props.interpolationCurve);

    if (this._isDate(props.data[0].values[0], xAccessor)) {
      interpolatePath.x(d => props.xScale(props.xAccessor(d).getTime()));
    } else {
      interpolatePath.x(d => props.xScale(props.xAccessor(d)));
    }

    const lines = props.data.map((series, idx) => (
        <Line
          path={interpolatePath(series.values)}
          stroke={props.colors(props.colorAccessor(series, idx))}
          strokeWidth={series.strokeWidth}
          strokeDashArray={series.strokeDashArray}
          seriesName={series.name}
          key={idx}
        />
      )
    );

    const voronoiGenerator = voronoi()
      .x(d => xScale(d.coord.x))
      .y(d => yScale(d.coord.y))
      .extent([[0, 0], [props.width, props.height]]);

    let cx;
    let cy;
    let circleFill;
    const regions = voronoiGenerator(props.value).polygons().map((vnode, idx) => {
      const point = vnode.data.coord;
      if (Object.prototype.toString.call(xAccessor(point)) === '[object Date]') {
        cx = props.xScale(xAccessor(point).getTime());
      } else {
        cx = props.xScale(xAccessor(point));
      }
      if (Object.prototype.toString.call(yAccessor(point)) === '[object Date]') {
        cy = props.yScale(yAccessor(point).getTime());
      } else {
        cy = props.yScale(yAccessor(point));
      }
      circleFill = props.colors(props.colorAccessor(vnode, vnode.data.seriesIndex));

      return (
        <VoronoiCircleContainer
          key={idx}
          circleFill={circleFill}
          vnode={vnode}
          hoverAnimation={props.hoverAnimation}
          cx={cx} cy={cy}
          circleRadius={props.circleRadius}
          onMouseOver={props.onMouseOver}
          dataPoint={{
            xValue: xAccessor(point),
            yValue: yAccessor(point),
            seriesName: vnode.data.series.name,
          }}
        />
      );
    });

    return (
      <g>
        <g>{regions}</g>
        <g>{lines}</g>
      </g>
    );
  },
});
