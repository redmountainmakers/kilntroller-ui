import React from 'react';
import { connect } from 'react-redux';

import './ClearCurrentSchedule.scss';

class ClearCurrentSchedule extends React.Component {
	constructor(props) {
		super(props);
		this.state = { confirmClear : false };
		this._boundConfirmClear    = this._confirmClear.bind(this);
		this._boundCancelClear     = this._cancelClear.bind(this);
		this._boundPromptToConfirm = this._promptToConfirm.bind(this);
	}

	_confirmClear() {
		console.log('clear');
		this.setState({ confirmClear : false });
	}

	_cancelClear() {
		this.setState({ confirmClear : false });
	}

	_promptToConfirm() {
		this.setState({ confirmClear : true });
	}

	render() {
		if (this.state.confirmClear) {
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

export default connect((state, props) => {
	return {};
}, {

})(ClearCurrentSchedule);
