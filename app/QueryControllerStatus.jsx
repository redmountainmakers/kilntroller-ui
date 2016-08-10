import React from 'react';
import { connect } from 'react-redux';

import {
	requestControllerStatus,
} from './actions/controller';
import {
	isControllerConnected,
	getControllerLastTimestamp,
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
		const isConnected       = isControllerConnected(state);
		const hasError          = !!state.errors.controllerStatus;
		const requesting        = state.controller.requesting;
		const currentTimestamp  = state.time;
		const receivedTimestamp = getControllerLastTimestamp(state);

		const shouldRequestStatus = (
			(!isConnected && !hasError && !requesting) ||
			(currentTimestamp > receivedTimestamp + 10000)
		);

		return {
			shouldRequestStatus,
		};
	},
	{ requestControllerStatus }
)(QueryControllerStatus);
