import React from 'react';
import { connect } from 'react-redux';

import {
    isControllerConnected,
} from './selectors/controller';

function ControllerStatus({ requesting, isConnected, error }) {
    if (requesting) {
        return (
            <div>Loading controller status...</div>
        );
    }

    if (isConnected) {
        return (
            <div>Connected to controller</div>
        );
    }

    if (error) {
        return (
            <div>
                <div>
                    Error connecting to controller:
                    { error }
                </div>
                <div>
                    Be sure you are connected to the RMM wifi network and the
                    kiln controller is on.
                </div>
            </div>
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
