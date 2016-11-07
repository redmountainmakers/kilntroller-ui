import * as api from '../lib/api';

export function requestTemperatureData( dataRequest ) {
	return dispatch => {
		dispatch( {
			type      : 'DATA_REQUEST',
			requested : dataRequest,
		} );

		const { min, max, count } = dataRequest;
		api.getData( min, max, count, ( err, result ) => {
			if ( err ) {
				dispatch( {
					type  : 'DATA_REQUEST_ERROR',
					error : err,
				} );
			} else {
				dispatch( {
					type : 'DATA_RECEIVE',
					...result,
				} );
			}
		} );
	};
}

export function advanceChartRange() {
	return {
		type : 'ADVANCE_CHART_RANGE',
	};
}
