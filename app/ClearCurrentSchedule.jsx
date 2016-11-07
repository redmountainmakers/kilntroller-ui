import React from 'react';
import { connect } from 'react-redux';

import {
	clearControllerSchedule,
	dismissClearControllerScheduleError,
} from './actions/controller';

import './ClearCurrentSchedule.scss';

class ClearCurrentSchedule extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { confirmClear : false };
		this._boundConfirmClear    = this._confirmClear.bind( this );
		this._boundCancelClear     = this._cancelClear.bind( this );
		this._boundPromptToConfirm = this._promptToConfirm.bind( this );
		this._boundDismissError    = this._dismissError.bind( this );
	}

	_confirmClear() {
		this.props.clearControllerSchedule();
		this.setState( { confirmClear : false } );
	}

	_cancelClear() {
		this.setState( { confirmClear : false } );
	}

	_promptToConfirm() {
		this.setState( { confirmClear : true } );
	}

	_dismissError() {
		this.props.dismissClearControllerScheduleError();
	}

	render() {
		if ( this.props.clearScheduleError ) {
			return (
				<div className="ClearCurrentSchedule error">
					Error clearing schedule: { this.props.clearScheduleError }
					<button
						className="dismiss"
						onClick={ this._boundDismissError }
					>
						Dismiss
					</button>
				</div>
			);
		} else if ( this.props.isClearingSchedule ) {
			return (
				<div className="ClearCurrentSchedule loading">
					Clearing schedule...
				</div>
			);
		} else if ( this.state.confirmClear ) {
			return (
				<div className="ClearCurrentSchedule confirm">
					<div className="confirm-text">
						Really clear the current schedule?
					</div>
					<button
						className="ok"
						onClick={ this._boundConfirmClear }
					>
						OK
					</button>
					<button
						className="cancel"
						onClick={ this._boundCancelClear }
					>
						Cancel
					</button>
				</div>
			);
		} else {
			return (
				<div className="ClearCurrentSchedule">
					<button
						className="clear"
						onClick={ this._boundPromptToConfirm }
					>
						Clear current schedule
					</button>
				</div>
			);
		}
	}
}

ClearCurrentSchedule.propTypes = {
	isClearingSchedule                  : React.PropTypes.bool,
	clearScheduleError                  : React.PropTypes.string,
	clearControllerSchedule             : React.PropTypes.func,
	dismissClearControllerScheduleError : React.PropTypes.func,
};

export default connect( ( state, props ) => {
	return {
		isClearingSchedule : state.controller.clearingSchedule,
		clearScheduleError : state.controller.clearScheduleError,
	};
}, {
	clearControllerSchedule,
	dismissClearControllerScheduleError,
} )( ClearCurrentSchedule );
