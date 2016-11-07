import React from 'react';

import ScheduleStep from './ScheduleStep';

import './Schedule.scss';

class Schedule extends React.Component {
	render() {
		const { schedule, currentTimestamp } = this.props;
		const { previous, current, future } = schedule.steps;

		const steps = [];

		( previous || [] ).forEach( step => {
			steps.push(
				<ScheduleStep
					key={ steps.length }
					completed
					{ ...step }
				/>
			);
		} );

		if ( current ) {
			const runningForMinutes = ( currentTimestamp - schedule.stepStartedAt ) / 60 / 1000;
			steps.push(
				<ScheduleStep
					key={ steps.length }
					completed={ false }
					started
					runningForMinutes={ runningForMinutes }
					{ ...current }
				/>
			);
		}

		( future || [] ).forEach( step => {
			steps.push(
				<ScheduleStep
					key={ steps.length }
					completed={ false }
					started={ false }
					{ ...step }
				/>
			);
		} );

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
	schedule         : React.PropTypes.object,
	currentTimestamp : React.PropTypes.number,
};

export default Schedule;
