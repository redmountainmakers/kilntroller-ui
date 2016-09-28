import React from 'react';
import { connect } from 'react-redux';

import ScheduleStep from './ScheduleStep';

class Schedule extends React.Component {
	render() {
		const { schedule } = this.props;
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
			steps.push(
				<ScheduleStep
					key={ steps.length }
					completed={ false }
					started
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
				<div className="column header">
					<div className="cell temperature">Temperature</div>
					<div className="cell ramp">Ramp (min.)</div>
					<div className="cell soak">Soak (min.)</div>
				</div>
				{ steps }
				<div className="clear" />
			</div>
		);
	}
}

Schedule.propTypes = {
	schedule : React.PropTypes.object,
};

export default connect((state, props) => {
	return {
		schedule : state.updates.schedule,
	};
})(Schedule);
