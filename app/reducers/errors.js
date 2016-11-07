export default function( state = {}, action ) {
	switch ( action.type ) {
		case 'DATA_REQUEST_ERROR':
			return {
				...state,
				dataRequest : action.error.message,
			};

		case 'CONTROLLER_STATUS_REQUEST_ERROR':
			return {
				...state,
				controllerStatus : action.error.message,
			};
	}

	return state;
}
