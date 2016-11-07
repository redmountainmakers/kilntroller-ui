import { combineReducers } from 'redux';
import { isEqual, pick } from 'lodash';
import moment from 'moment';

export function getLatestRange() {
	const now = moment.utc();
	return {
		min : +now.clone().subtract( 8, 'hours' ),
		max : +now,
	};
}

export function range( state = {}, action ) {
	if ( ! state.min || ! state.max ) {
		return getLatestRange();
	}

	switch ( action.type ) {
		case 'ADVANCE_CHART_RANGE':
			return getLatestRange();

		case 'USER_ZOOM':
			if ( action.min && action.max ) {
				return {
					min : action.min,
					max : action.max,
				};
			}
			return state;
	}

	return state;
}

export function data( state = [], action ) {
	switch ( action.type ) {
		case 'DATA_RECEIVE':
			if ( ! Array.isArray( action.data ) || ! action.data.length ) {
				return state;
			}
			return action.data;
	}

	return state;
}

export function requests( state = {}, action ) {
	if ( ! state.pending || ! state.completed ) {
		return {
			pending      : [],
			completed    : [],
			maxTimestamp : 0,
		};
	}

	if ( ! action.requested ) {
		return state;
	}
	const request = pick( action.requested, 'min', 'max', 'count' );

	switch ( action.type ) {
		case 'DATA_REQUEST':
			return {
				pending      : state.pending.concat( [ request ] ),
				completed    : state.completed,
				maxTimestamp : state.maxTimestamp,
			};

		case 'DATA_RECEIVE':
			return {
				pending      : state.pending.filter( r => ! isEqual( request, r ) ),
				completed    : state.completed.concat( [ request ] ),
				maxTimestamp : Math.max( state.maxTimestamp, request.max ),
			};
	}

	return state;
}

export default combineReducers( {
	range,
	data,
	requests,
} );
