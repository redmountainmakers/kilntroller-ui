import React from 'react';
import { connect } from 'react-redux';

import SectionHeader from './SectionHeader';
import SectionBody from './SectionBody';
import CurrentSchedule from './CurrentSchedule';
import EditSchedule from './EditSchedule';
import {
	isControllerConnected,
} from './selectors/controller';

// import './Schedules.scss';

class Schedules extends React.Component {
	render() {
		if ( ! this.props.isConnected ) {
			return null;
		}

		return (
			<div>
				<SectionHeader icon="scheduled">
					Current Schedule
				</SectionHeader>
				<SectionBody>
					<CurrentSchedule />
				</SectionBody>
				<SectionHeader icon="create">
					Edit Schedule
				</SectionHeader>
				<SectionBody>
					<EditSchedule />
				</SectionBody>
			</div>
		);
	}
}

Schedules.propTypes = {
	isConnected : React.PropTypes.bool,
};

export default connect( ( state, props ) => {
	return {
		isConnected : isControllerConnected( state ),
	};
} )( Schedules );
