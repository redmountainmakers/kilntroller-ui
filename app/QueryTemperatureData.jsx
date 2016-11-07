import React from 'react';
import { connect } from 'react-redux';

import {
	getNextChartDataRequest,
	getChartRange,
} from './selectors/chart';
import {
	requestTemperatureData,
	advanceChartRange,
} from './actions/chart';

class QueryTemperatureData extends React.Component {
	componentWillMount() {
		this.maybeRequestData( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.maybeRequestData( nextProps );
	}

	maybeRequestData( props ) {
		const {
			nextDataRequest,
			requestTemperatureData,
			advanceChartRange,
			chartMaxTimestamp,
			maxTimestampRequested,
			currentTimestamp,
		} = props;
		if ( nextDataRequest ) {
			requestTemperatureData( nextDataRequest );
		} else if (
			maxTimestampRequested > currentTimestamp - 10000 &&
			maxTimestampRequested < currentTimestamp - 5000 &&
			chartMaxTimestamp > currentTimestamp - 10000 &&
			chartMaxTimestamp < currentTimestamp - 5000
		) {
			// It's been between 5 and 10 seconds since the chart data range
			// was updated; go ahead and refresh it now
			advanceChartRange();
		}
	}

	render() {
		return null;
	}
}

QueryTemperatureData.propTypes = {
	nextDataRequest        : React.PropTypes.object,
	requestTemperatureData : React.PropTypes.func,
	advanceChartRange      : React.PropTypes.func,
	chartMaxTimestamp      : React.PropTypes.number,
	maxTimestampRequested  : React.PropTypes.number,
	currentTimestamp       : React.PropTypes.number,
};

export default connect(
	( state, props ) => {
		const nextDataRequest       = getNextChartDataRequest( state );
		const chartMaxTimestamp     = getChartRange( state ).max;
		const maxTimestampRequested = state.chart.requests.maxTimestamp;
		const currentTimestamp      = state.time;

		return {
			nextDataRequest,
			chartMaxTimestamp,
			maxTimestampRequested,
			currentTimestamp,
		};
	}, {
		requestTemperatureData,
		advanceChartRange,
	}
)( QueryTemperatureData );
