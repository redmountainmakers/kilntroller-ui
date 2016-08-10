import React from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';
import { debounce, get, omit } from 'lodash';
import debugModule from 'debug';

import { LineChart } from '../vendor/rd3/src';
import SectionHeader from './SectionHeader';
import * as utils from './lib/utils';
import {
	isRequestingChartData,
	getChartData,
} from './selectors/chart';

import './TemperatureChart.scss';

const debug = debugModule('TemperatureChart');

class TemperatureChart extends React.Component {
	constructor(props) {
		super(props);

		this.formatTooltip = this.formatTooltip.bind(this);
		this.state = {
			windowWidth: window.innerWidth
		};
		this._resize = debounce(this._resize.bind(this), 500);
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { data, min, max, loading, readError } = this.props;
		const { windowWidth } = this.state;
		return (
			min !== nextProps.min ||
			max !== nextProps.max ||
			loading !== nextProps.loading ||
			readError !== nextProps.readError ||
			get(data, 'length', 0) !== get(nextProps.data, 'length', 0) ||
			windowWidth !== nextState.windowWidth
		);
	}

	componentWillMount() {
		this._isFirstLoad = true;
		window.addEventListener('resize', this._resize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this._resize);
	}

	getFormattedData() {
		const { min, data } = this.props;

		const actual = { name : 'Actual', values : [], _missing : 0 };
		const target = { name : 'Target', values : [], _missing : 0 };

		if (data && data.length) {
			debug('getFormattedData length=%d', data.length);
			data.forEach(value => {
				const x = utils.date(value.timestamp);
				if (typeof value.temperature === 'number') {
					actual._missing = 0;
					actual.values.push({ x, y : value.temperature });
				} else if (++actual._missing === 5) {
					actual.values.push({ x, y : null });
				}
				if (typeof value.setpoint === 'number') {
					target._missing = 0;
					target.values.push({ x, y : value.setpoint });
				} else if (++target._missing === 5) {
					target.values.push({ x, y : null });
				}
			});
		} else {
			// LineChart needs at least 1 data value?
			const x = utils.date(min);
			const y = 0;
			actual.values.push({ x, y });
			target.values.push({ x, y });
		}

		return [omit(actual, '_missing'), omit(target, '_missing')];
	}

	getDomain() {
		const { min, max, data } = this.props;

		let temperatureRange;
		if (data && data.length) {
			temperatureRange = d3.extent(data, point => point.temperature);
		} else {
			temperatureRange = [Infinity, -Infinity];
		}

		return {
			x : [
				utils.date(min),
				utils.date(max),
			],
			y : [
				Math.min(temperatureRange[0], 0),
				Math.max(temperatureRange[1] * 1.4, 100),
			],
		};
	}

	formatTooltip(d) {
		return [
			utils.timeFormatters.second(d.xValue),
			d.seriesName + ': ' + String(d.yValue),
		].join('<br />');
	}

	render() {
		const { data, readError } = this.props;
		const hasData = Boolean(data && data.length);

		if (hasData) {
			this._isFirstLoad = false;
		}

		const loading = this.props.loading && this._isFirstLoad;
		const circleRadius = {
			inactive : 0,
			active   : (hasData ? 4 : 0),
		};

		let status = null;
		if (readError) {
			status = (
				<div className="status">
					Error fetching data from API:<br />
					{ readError }
				</div>
			);
		} else if (loading) {
			status = (
				<div className="status">
					Loading chart data...
				</div>
			);
		} else if (!hasData) {
			status = (
				<div className="status">
					No data for selected time period
				</div>
			);
		}

		const { windowWidth } = this.state;
		const pixelsPerTickLabel = 115;
		const tickCount = Math.max(
			2,
			Math.min(
				Math.floor(windowWidth / pixelsPerTickLabel) - 3,
				10
			)
		);

		return (
			<div className="TemperatureChart">
				<SectionHeader icon="stats">
					Temperature Chart
				</SectionHeader>
				<LineChart
					legend
					data={ this.getFormattedData() }
					colors={ d3.scale.category10() }
					xAxisFormatter={ utils.timeFormatters.minute }
					xAxisTickCount={ tickCount }
					domain={ this.getDomain() }
					tooltipFormat={ this.formatTooltip }
					width={ windowWidth }
					circleRadius={ circleRadius }
					showTooltip={ hasData }
				/>
				{ status }
			</div>
		);
	}

	_resize() {
		this.setState({
			windowWidth : window.innerWidth
		});
	}
}

TemperatureChart.propTypes = {
	min       : React.PropTypes.number,
	max       : React.PropTypes.number,
	loading   : React.PropTypes.bool,
	data      : React.PropTypes.array,
	readError : React.PropTypes.string,
};

export default connect((state, props) => {
	const range     = state.chart.range;
	const loading   = isRequestingChartData(state);
	const data      = getChartData(state);
	const readError = state.errors.dataRequest;

	return {
		min : range.min,
		max : range.max,
		loading,
		data,
		readError,
	};
})(TemperatureChart);
