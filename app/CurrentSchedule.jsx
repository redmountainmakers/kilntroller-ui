import React from 'react';
import { connect } from 'react-redux';

import Schedule from './Schedule';
import ClearCurrentSchedule from './ClearCurrentSchedule';

class CurrentSchedule extends React.Component {
	render() {
		const { schedule, currentTimestamp } = this.props;

		if ( schedule && schedule.steps && schedule.steps.current ) {
			return (
				<div>
					<Schedule
						schedule={ schedule }
						currentTimestamp={ currentTimestamp }
					/>
					<ClearCurrentSchedule />
				</div>
			);
		} else {
			return (
				<div>No schedule is currently set.</div>
			);
		}
	}
}

CurrentSchedule.propTypes = {
	schedule         : React.PropTypes.object,
	currentTimestamp : React.PropTypes.number,
};

export default connect( ( state, props ) => {
	return {
		schedule         : state.updates.schedule,
		currentTimestamp : state.updates.status.timestamp,
	};
} )( CurrentSchedule );
