import { omit } from 'lodash';

import * as api from '../lib/api';

function receiveStatusUpdate( update ) {
	return {
		type   : 'STATUS_UPDATE_RECEIVE',
		status : update,
	};
}

function receiveScheduleUpdate( update ) {
	return {
		type     : 'SCHEDULE_UPDATE_RECEIVE',
		schedule : update,
	};
}

export function receiveUpdate( update ) {
	switch ( update.type ) {
		case 'update':
			return receiveStatusUpdate( omit( update, 'type' ) );
		case 'schedule':
			return receiveScheduleUpdate( omit( update, 'type' ) );
	}

	return null;
}

export function requestKilnStatus() {
	return dispatch => {
		dispatch( {
			type : 'KILN_STATUS_REQUEST',
		} );

		api.getKilnStatus( ( err, result ) => {
			if ( err ) {
				dispatch( {
					type  : 'KILN_STATUS_REQUEST_ERROR',
					error : err,
				} );
			} else {
				result.forEach( update => {
					const action = receiveUpdate( update );
					if ( action ) {
						dispatch( action );
					}
				} );
			}
		} );
	};
}
