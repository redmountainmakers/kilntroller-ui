import React from 'react';
import { connect } from 'react-redux';

import Gridicon from '../vendor/gridicon';
import SectionBody from './SectionBody';
import {
	isControllerConnected,
} from './selectors/controller';

import './ControllerStatus.scss';

function ControllerStatus({ requesting, isConnected, error }) {
	if (requesting) {
		return (
			<SectionBody className="ControllerStatus loading">
				<Gridicon icon="plugins" size={ 24 } />
				Connecting to controller...
			</SectionBody>
		);
	}

	if (isConnected) {
		return (
			<SectionBody className="ControllerStatus success">
				<Gridicon icon="plugins" size={ 24 } />
				Connected to controller
			</SectionBody>
		);
	}

	let errorText = 'Read-only mode: Cannot connect to controller';
	if (error && error !== 'Unknown error') {
		errorText += `: ${ error }`;
	}

	if (error) {
		return (
			<SectionBody className="ControllerStatus error">
				<Gridicon icon="plugins" size={ 24 } />
				<div className="line">
					{ errorText }
				</div>
				<div className="line">
					Make sure you are connected to the RMM wifi network and the
					kiln controller is plugged in.
				</div>
			</SectionBody>
		);
	}

	throw new Error('Should never get here');
}

ControllerStatus.propTypes = {
	requesting  : React.PropTypes.bool,
	isConnected : React.PropTypes.bool,
	error       : React.PropTypes.string,
};

export default connect(
	(state, props) => {
		const requesting  = state.controller.requesting;
		const isConnected = isControllerConnected(state);
		const error       = state.errors.controllerStatus;

		return {
			requesting,
			isConnected,
			error,
		};
	}
)(ControllerStatus);
