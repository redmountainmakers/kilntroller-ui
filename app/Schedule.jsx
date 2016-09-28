import React from 'react';
import { connect } from 'react-redux';

import ScheduleStep from './ScheduleStep';

import './Schedule.scss';

class Schedule extends React.Component {
	render() {
		const { schedule, timestamp } = this.props;
		const { previous, current, future } = schedule.steps;

		const steps = [];

		(previous || []).forEach(step => {
			steps.push(
				<ScheduleStep
					key={ steps.length }
					completed
					{ ...step }
				/>
			);
		});

		if (current) {
			const runningFor = timestamp - schedule.stepStartedAt;
			steps.push(
				<ScheduleStep
					key={ steps.length }
					completed={ false }
					started
					runningFor={ runningFor }
					{ ...current }
				/>
			);
		}

		(future || []).forEach(step => {
			steps.push(
				<ScheduleStep
					key={ steps.length }
					completed={ false }
					started={ false }
					{ ...step }
				/>
			);
		});

		return (
			<div className="Schedule">
				<div className="step header">
					<div className="cell temperature">Temperature</div>
					<div className="cell ramp">Ramp (min.)</div>
					<div className="cell soak">Soak (min.)</div>
					<div className="cell status">Status</div>
				</div>
				{ steps }
				<div className="clear" />
			</div>
		);
	}
}

Schedule.propTypes = {
	schedule  : React.PropTypes.object,
	timestamp : React.PropTypes.number,
};

export default connect((state, props) => {
	return {
		schedule  : state.updates.schedule,
		timestamp : state.updates.status.timestamp,
	};
})(Schedule);
