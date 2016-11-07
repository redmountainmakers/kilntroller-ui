import * as api from '../lib/api';

export function requestControllerStatus() {
	return dispatch => {
		dispatch( {
			type : 'CONTROLLER_STATUS_REQUEST',
		} );

		api.getControllerStatus( ( err, result ) => {
			if ( err ) {
				dispatch( {
					type  : 'CONTROLLER_STATUS_REQUEST_ERROR',
					error : err,
				} );
			} else {
				dispatch( {
					type : 'CONTROLLER_STATUS_RECEIVE',
					data : result,
				} );
			}
		} );
	};
}

export function clearControllerSchedule() {
	return dispatch => {
		dispatch( {
			type : 'CONTROLLER_SCHEDULE_CLEAR',
		} );

		api.clearControllerSchedule( ( err, result ) => {
			if ( err || ! result.ok ) {
				err = ( err ? err.message : result.error || result );
				if ( typeof err !== 'string' ) {
					err = JSON.stringify( err );
				}
				dispatch( {
					type  : 'CONTROLLER_SCHEDULE_CLEAR_ERROR',
					error : err,
				} );
			} else {
				dispatch( {
					type : 'CONTROLLER_SCHEDULE_CLEAR_SUCCESS',
				} );
			}
		} );
	};
}

export function dismissClearControllerScheduleError() {
	return {
		type : 'CONTROLLER_SCHEDULE_CLEAR_ERROR_DISMISS',
	};
}
