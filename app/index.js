import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

// TODO why do I have to specify '/index' here?
import { reducer } from './reducers/index';
import App from './App';

const store = createStore(
	reducer,
	compose(
		applyMiddleware(thunkMiddleware),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
);

render(
    React.createElement(
		Provider, { store },
		React.createElement(App)
    ),
    document.getElementById('app')
);
