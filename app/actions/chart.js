import * as api from '../lib/api';

export function requestTemperatureData(dataRequest) {
    return dispatch => {
        dispatch({
            type : 'DATA_REQUEST',
            ...dataRequest,
        });

        const { min, max, count } = dataRequest;
        api.getData(min, max, count, (err, result) => {
            if (err) {
                dispatch({
                    type  : 'DATA_REQUEST_ERROR',
                    error : err,
                });
            } else {
                dispatch({
                    type : 'DATA_RECEIVE',
                    data : result.data,
                });
            }
        });
    };
}