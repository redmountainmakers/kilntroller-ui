import React from 'react';
import { connect } from 'react-redux';

import {
    getNextChartDataRequest,
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

QueryTemperatureData.propTypes = {
    nextDataRequest        : React.PropTypes.object,
    requestTemperatureData : React.PropTypes.func,
};

export default connect(
    (state, props) => {
        const nextDataRequest = getNextChartDataRequest(state);

        return {
            nextDataRequest,
        };
    },
    { requestTemperatureData }
)(QueryTemperatureData);
