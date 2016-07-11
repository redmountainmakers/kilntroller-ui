import { combineReducers } from 'redux';

export function status(state = {}, action) {
    switch (action.type) {
        case 'CONTROLLER_STATUS_RECEIVE':
            return action.status;
    }

    return state;
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
