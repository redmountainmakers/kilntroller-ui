import { combineReducers } from 'redux';

import chart  from './chart';
import errors from './errors';

export const reducer = combineReducers({
    chart,
    errors,
});
