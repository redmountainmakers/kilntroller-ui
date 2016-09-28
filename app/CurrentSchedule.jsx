import React from 'react';
import { connect } from 'react-redux';

import Schedule from './Schedule';

class CurrentSchedule extends React.Component {
	render() {
		const { schedule } = this.props;

		if (schedule && schedule.steps && schedule.steps.current) {
			return (
				<Schedule schedule={ schedule } />
			);
		}

		return null;
	}
}

CurrentSchedule.propTypes = {
	schedule : React.PropTypes.object,
};

export default connect((state, props) => {
	return {
		schedule : state.updates.schedule,
	};
})(CurrentSchedule);
