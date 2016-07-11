import React from 'react';
import { connect } from 'react-redux';

import {
    requestControllerStatus,
} from './actions/controller';
import {
    isControllerConnected,
} from './selectors/controller';

class QueryControllerStatus extends React.Component {
    componentWillMount() {
        this.maybeRequestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.maybeRequestData(nextProps);
    }

    maybeRequestData(props) {
        if (props.shouldRequestStatus) {
            props.requestControllerStatus();
        }
    }

    render() {
        return null;
    }
}

QueryControllerStatus.propTypes = {
    shouldRequestStatus     : React.PropTypes.bool,
    requestControllerStatus : React.PropTypes.func,
};

export default connect(
    (state, props) => {
        const isConnected = isControllerConnected(state);
        const hasError    = !!state.errors.controllerStatus;

        return {
            shouldRequestStatus : !isConnected && !hasError,
        };
    },
    { requestControllerStatus }
)(QueryControllerStatus);
