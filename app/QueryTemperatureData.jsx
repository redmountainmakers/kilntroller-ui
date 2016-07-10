import React from 'react';
import { connect } from 'react-redux';

import {
    getChartRange,
    getNextChartDataRequest,
    isRequestingChartData,
} from './selectors/chart';
import {
    requestTemperatureData,
} from './actions/chart';

class QueryTemperatureData extends React.Component {
    componentWillMount() {
        this.maybeRequestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.maybeRequestData(nextProps);
    }

    maybeRequestData(props) {
        if (props.nextDataRequest) {
            props.requestTemperatureData(props.nextDataRequest);
        }
    }

    render() {
        return null;
    }
}

export default connect(
    (state, props) => {
        const chartRange = getChartRange(state);
        const nextDataRequest = getNextChartDataRequest(state);
        const alreadyInProgress = isRequestingChartData(state, nextDataRequest);

        return {
            chartRange,
            nextDataRequest : (alreadyInProgress ? null : nextDataRequest),
        };
    },
    { requestTemperatureData }
)(QueryTemperatureData);
