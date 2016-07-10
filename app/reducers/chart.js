import { combineReducers } from 'redux';
import { isEqual, pick } from 'lodash';
import moment from 'moment';

export function range(state = {}, action) {
    if (!state.min || !state.max) {
        const now = moment.utc();
        return {
            min : +now.clone().subtract(2, 'days'),
            max : +now,
        };
    }

    switch (action.type) {
        case 'ADVANCE_OR_WHATEVER':
            // ...
            return state;

        case 'USER_ZOOM':
            if (action.min && action.max) {
                return {
                    min : action.min,
                    max : action.max,
                };
            }
            return state;
    }

    return state;
}

export function data(state = [], action) {
    switch (action.type) {
        case 'DATA_RECEIVE':
            if (!Array.isArray(action.data) || !action.data.length) {
                return state;
            }
            const data = state.slice();
            const newData = action.data;
            if (!data.length) {
                return newData;
            }
            let j = 0;
            for (let i = 0; i < data.length; i++) {
                while (j < newData.length && newData[j].timestamp < data[i].timestamp) {
                    data.splice(i, 0, newData[j]);
                    i++;
                    j++;
                }
                if (j === newData.length) {
                    break;
                }
                if (newData[j].timestamp === data[i].timestamp) {
                    data[i] = newData[j];
                    j++;
                }
            }
            if (j < newData.length) {
                return data.concat(newData.slice(j));
            }
            return data;
    }

    return state;
}

export function requests(state = {}, action) {
    if (!state.pending || !state.completed) {
        return {
            pending   : [],
            completed : [],
        };
    }

    const request = pick(action.requested, 'min', 'max', 'count');

    switch (action.type) {
        case 'DATA_REQUEST':
            return {
                pending   : state.pending.concat([request]),
                completed : state.completed,
            };

        case 'DATA_RECEIVE':
            const pending = state.pending.slice();
            for (let i = pending.length - 1; i >= 0; i--) {
                if (isEqual(request, pending[i])) {
                    pending.splice(i, 1);
                    break;
                }
            }
            return {
                pending,
                completed : state.completed.concat([request]),
            };
    }

    return state;
}

export default combineReducers({
    range,
    data,
    requests,
});
