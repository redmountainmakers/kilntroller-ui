import { combineReducers } from 'redux';

export function status( state = null, action ) {
	switch ( action.type ) {
		case 'CONTROLLER_STATUS_RECEIVE':
			return {
				data      : action.data,
				timestamp : + new Date,
			};

		case 'CONTROLLER_STATUS_REQUEST_ERROR':
			return {
				data      : false,
				timestamp : + new Date,
			};
	}

	if ( state ) {
		return state;
	} else {
		return {
			data      : null,
			timestamp : 0,
		};
	}
}

export function requesting( state = false, action ) {
	switch ( action.type ) {
		case 'CONTROLLER_STATUS_REQUEST':
			return true;

		case 'CONTROLLER_STATUS_RECEIVE':
			return false;

		case 'CONTROLLER_STATUS_REQUEST_ERROR':
			return false;
	}

	return state;
}

export function clearingSchedule( state = false, action ) {
	switch ( action.type ) {
		case 'CONTROLLER_SCHEDULE_CLEAR':
			return true;

		case 'CONTROLLER_SCHEDULE_CLEAR_SUCCESS':
			return false;

		case 'CONTROLLER_SCHEDULE_CLEAR_ERROR':
			return false;
	}

	return state;
}

export function clearScheduleError( state = null, action ) {
	switch ( action.type ) {
		case 'SCHEDULE_UPDATE_RECEIVE':
			if (
				! action.schedule ||
				! action.schedule.steps ||
				! action.schedule.steps.current
			) {
				return null;
			}
			break;

		case 'CONTROLLER_SCHEDULE_CLEAR_SUCCESS':
			return null;

		case 'CONTROLLER_SCHEDULE_CLEAR_ERROR':
			return action.error;

		case 'CONTROLLER_SCHEDULE_CLEAR_ERROR_DISMISS':
			return null;
	}

	return state;
}

export default combineReducers( {
	status,
	requesting,
	clearingSchedule,
	clearScheduleError,
} );
