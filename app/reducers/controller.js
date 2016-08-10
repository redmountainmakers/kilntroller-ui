import { combineReducers } from 'redux';

export function status(state = null, action) {
	switch (action.type) {
		case 'CONTROLLER_STATUS_RECEIVE':
			return {
				status    : action.status,
				timestamp : +new Date,
			};

		case 'CONTROLLER_STATUS_REQUEST_ERROR':
			return {
				status    : false,
				timestamp : +new Date,
			};
	}

	if (state) {
		return state;
	} else {
		return {
			status    : null,
			timestamp : 0,
		};
	}
}

export function requesting(state = false, action) {
	switch (action.type) {
		case 'CONTROLLER_STATUS_REQUEST':
			return true;

		case 'CONTROLLER_STATUS_RECEIVE':
			return false;

		case 'CONTROLLER_STATUS_REQUEST_ERROR':
			return false;
	}

	return state;
}

export default combineReducers({
	status,
	requesting,
});
