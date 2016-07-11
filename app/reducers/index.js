import { combineReducers } from 'redux';

import chart      from './chart';
import controller from './controller';
import errors     from './errors';

export const reducer = combineReducers({
    chart,
    controller,
    errors,
});
