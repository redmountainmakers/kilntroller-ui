import React from 'react';
import { connect } from 'react-redux';

import * as utils from './lib/utils';

class ScheduleStep extends React.Component {
	render() {
		const {
			completed,
			started,
			runningForMinutes,
			temperature,
			rampMinutes,
			soakMinutes,
		} = this.props;

		let stepClass;
		let status;
		if (completed) {
			stepClass = 'completed';
			status = (
				<div className="cell status completed">✓</div>
			);
		} else if (started) {
			stepClass = 'in-progress';
			let statusText;
			if (runningForMinutes < rampMinutes) {
				statusText = 'Ramp';
			} else {
				statusText = 'Soak';
			}
			status = (
				<div className="cell status in-progress">{ statusText }</div>
			);
		} else {
			stepClass = 'future';
			status = (
				<div className="cell status" />
			);
		}

		return (
			<div className={ 'step ' + stepClass }>
				<div className="cell temperature">{ utils.round(temperature, 0) }</div>
				<div className="cell ramp">{ utils.round(rampMinutes, 0) }</div>
				<div className="cell soak">{ utils.round(soakMinutes, 0) }</div>
				{ status }
			</div>
		);
	}
}

ScheduleStep.propTypes = {
	completed         : React.PropTypes.bool,
	started           : React.PropTypes.bool,
	runningForMinutes : React.PropTypes.number,
	temperature       : React.PropTypes.number,
	rampMinutes       : React.PropTypes.number,
	soakMinutes       : React.PropTypes.number,
};

export default connect((state, props) => {
	return {
		schedule : state.updates.schedule,
	};
})(ScheduleStep);
