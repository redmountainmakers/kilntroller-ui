import * as api from '../lib/api';

export function requestControllerStatus() {
    return dispatch => {
        dispatch({
            type : 'CONTROLLER_STATUS_REQUEST',
        });

        api.getControllerStatus((err, result) => {
            if (err) {
                dispatch({
                    type  : 'CONTROLLER_STATUS_REQUEST_ERROR',
                    error : err,
                });
            } else {
                dispatch({
                    type   : 'CONTROLLER_STATUS_RECEIVE',
                    status : result,
                });
            }
        });
    };
}
