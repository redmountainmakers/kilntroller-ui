import React from 'react';
import { connect } from 'react-redux';

import * as utils from './lib/utils';

class ScheduleStep extends React.Component {
	render() {
		const { temperature, rampMinutes, soakMinutes } = this.props;

		return (
			<div className="column">
				<div className="cell temperature">{ utils.round(temperature, 0) }</div>
				<div className="cell ramp">{ utils.round(rampMinutes, 0) }</div>
				<div className="cell soak">{ utils.round(soakMinutes, 0) }</div>
			</div>
		);
	}
}

ScheduleStep.propTypes = {
	completed        : React.PropTypes.bool,
	started          : React.PropTypes.bool,
	temperature      : React.PropTypes.number,
	rampMinutes      : React.PropTypes.number,
	soakMinutes      : React.PropTypes.number,
};

export default connect((state, props) => {
	return {
		schedule : state.updates.schedule,
	};
})(ScheduleStep);
