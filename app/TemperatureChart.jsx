import React from 'react';
import { connect } from 'react-redux';
import { extent } from 'd3-array';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
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

const debug = debugModule( 'TemperatureChart' );

class TemperatureChart extends React.Component {
	constructor( props ) {
		super( props );

		this.formatTooltip = this.formatTooltip.bind( this );
		this.state = {
			windowWidth : window.innerWidth,
		};
		this._resize = debounce( this._resize.bind( this ), 500 );
	}

	shouldComponentUpdate( nextProps, nextState ) {
		const { data, min, max, loading, readError } = this.props;
		const { windowWidth } = this.state;
		return (
			min !== nextProps.min ||
			max !== nextProps.max ||
			loading !== nextProps.loading ||
			readError !== nextProps.readError ||
			get( data, 'length', 0 ) !== get( nextProps.data, 'length', 0 ) ||
			windowWidth !== nextState.windowWidth
		);
	}

	componentWillMount() {
		this._isFirstLoad = true;
		window.addEventListener( 'resize', this._resize );
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this._resize );
	}

	getFormattedData() {
		const { min, data, currentTimestamp } = this.props;
		const scheduleObj = this.props.schedule;

		const actual = { name : 'Actual', values : [], _missing : 0 };
		const target = { name : 'Target', values : [], _missing : 0 };

		if ( data && data.length ) {
			debug( 'getFormattedData length=%d', data.length );
			data.forEach( value => {
				const x = utils.date( value.timestamp );
				if ( typeof value.temperature === 'number' ) {
					actual._missing = 0;
					actual.values.push( { x, y : value.temperature } );
				} else if ( ++ actual._missing === 5 ) {
					actual.values.push( { x, y : null } );
				}
				if ( typeof value.setpoint === 'number' ) {
					target._missing = 0;
					target.values.push( { x, y : value.setpoint } );
				} else if ( ++ target._missing === 5 ) {
					target.values.push( { x, y : null } );
				}
			} );
		} else {
			// LineChart needs at least 1 data value?
			const x = utils.date( min );
			const y = 0;
			actual.values.push( { x, y } );
			target.values.push( { x, y } );
		}

		const allSeries = [ omit( actual, '_missing' ), omit( target, '_missing' ) ];

		if ( scheduleObj && scheduleObj.steps && scheduleObj.steps.current ) {
			const schedule = { name : 'Scheduled', values : [] };

			const { previous, current, future } = scheduleObj.steps;
			const runningForMinutes = Math.max(
				0,
				currentTimestamp - scheduleObj.stepStartedAt
			) / 60 / 1000;
			if ( runningForMinutes < current.rampMinutes ) {
				// Partway through the ramp phase; interpolate
				const previousTemperature = previous[ previous.length - 1 ].temperature;
				schedule.values.push( {
					x : utils.date( currentTimestamp ),
					y : (
						previousTemperature +
						( current.temperature - previousTemperature ) *
						( runningForMinutes / current.rampMinutes )
					),
				} );
				schedule.values.push( {
					x : utils.date(
						scheduleObj.stepStartedAt +
						current.rampMinutes * 60 * 1000
					),
					y : current.temperature,
				} );
			} else {
				schedule.values.push( {
					x : utils.date( currentTimestamp ),
					y : current.temperature,
				} );
			}

			let stepEndsAt = (
				scheduleObj.stepStartedAt +
				current.rampMinutes * 60 * 1000 +
				current.soakMinutes * 60 * 1000
			);
			schedule.values.push( {
				x : utils.date( stepEndsAt ),
				y : current.temperature,
			} );

			( future || [] ).forEach( step => {
				stepEndsAt += step.rampMinutes * 60 * 1000;
				schedule.values.push( {
					x : utils.date( stepEndsAt ),
					y : step.temperature,
				} );
				stepEndsAt += step.soakMinutes * 60 * 1000;
				schedule.values.push( {
					x : utils.date( stepEndsAt ),
					y : step.temperature,
				} );
			} );

			allSeries.push( schedule );
		}

		return allSeries;
	}

	getDomain() {
		const { min, data, schedule } = this.props;
		let { max } = this.props;

		let temperatureRange;
		if ( data && data.length ) {
			// TODO we're not handling the case where schedule is set but data
			// isn't.  This should be impossible anyway?
			temperatureRange = extent( data, point => point.temperature );
		} else {
			temperatureRange = [ Infinity, - Infinity ];
		}

		if ( schedule && schedule.steps && schedule.steps.current ) {
			max = schedule.stepStartedAt;
			const { current, future } = schedule.steps;
			[ current ].concat( future || [] ).forEach( step => {
				temperatureRange[ 0 ] = Math.min( temperatureRange[ 0 ], step.temperature );
				temperatureRange[ 1 ] = Math.max( temperatureRange[ 1 ], step.temperature );
				max += step.rampMinutes * 60 * 1000;
				max += step.soakMinutes * 60 * 1000;
			} );
		}

		return {
			x : [
				utils.date( min ),
				utils.date( max ),
			],
			y : [
				Math.min( temperatureRange[ 0 ], 0 ),
				Math.max( temperatureRange[ 1 ] * 1.4, 100 ),
			],
		};
	}

	formatTooltip( d ) {
		return [
			utils.timeFormatters.second( d.xValue ),
			d.seriesName + ': ' + String( d.yValue ),
		].join( '<br />' );
	}

	render() {
		const { data, readError } = this.props;
		const hasData = Boolean( data && data.length );

		if ( hasData ) {
			this._isFirstLoad = false;
		}

		const loading = this.props.loading && this._isFirstLoad;
		const circleRadius = {
			inactive : 0,
			active   : ( hasData ? 4 : 0 ),
		};

		let status = null;
		if ( readError ) {
			status = (
				<div className="status">
					Error fetching data from API:<br />
					{ readError }
				</div>
			);
		} else if ( loading ) {
			status = (
				<div className="status">
					Loading chart data...
				</div>
			);
		} else if ( ! hasData ) {
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
				Math.floor( windowWidth / pixelsPerTickLabel ) - 3,
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
					colors={ scaleOrdinal( schemeCategory10 ) }
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
		this.setState( {
			windowWidth : window.innerWidth,
		} );
	}
}

TemperatureChart.propTypes = {
	min              : React.PropTypes.number,
	max              : React.PropTypes.number,
	schedule         : React.PropTypes.object,
	currentTimestamp : React.PropTypes.number,
	loading          : React.PropTypes.bool,
	data             : React.PropTypes.array,
	readError        : React.PropTypes.string,
};

export default connect( ( state, props ) => {
	const range     = state.chart.range;
	const loading   = isRequestingChartData( state );
	const data      = getChartData( state );
	const readError = state.errors.dataRequest;

	return {
		min              : range.min,
		max              : range.max,
		schedule         : state.updates.schedule,
		currentTimestamp : state.updates.status.timestamp,
		loading,
		data,
		readError,
	};
} )( TemperatureChart );
