import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

// TODO why do I have to specify '/index' here?
import { reducer } from './reducers/index';
import App from './App';

const store = createStore(
	reducer,
	applyMiddleware(
		thunkMiddleware
	)
);

render(
    React.createElement(
		Provider, { store },
		React.createElement(App)
    ),
    document.getElementById('app')
);
