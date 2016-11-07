import React from 'react';
import { connect } from 'react-redux';

class EditSchedule extends React.Component {
	render() {
		return (
			<div>
				Edit Schedule
			</div>
		);
	}
}

EditSchedule.propTypes = {
};

export default connect( ( state, props ) => {
	return {
	};
} )( EditSchedule );
