import { combineReducers } from 'redux';

import chart      from './chart';
import controller from './controller';
import errors     from './errors';
import time       from './time';
import updates    from './updates';

export const reducer = combineReducers( {
	chart,
	controller,
	errors,
	time,
	updates,
} );
