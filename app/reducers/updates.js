import { combineReducers } from 'redux';

export function status(state = {}, action) {
	switch (action.type) {
		case 'STATUS_UPDATE_RECEIVE':
			return action.status;
	}

	return state;
}

export function schedule(state = {}, action) {
	switch (action.type) {
		case 'SCHEDULE_UPDATE_RECEIVE':
			return action.schedule;
	}

	return state;
}

export default combineReducers({
	status,
	schedule,
});
