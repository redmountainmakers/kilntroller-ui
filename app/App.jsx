import React from 'react';
import { Component as StateHistoryDevTool } from 'redux-state-history';

import '../vendor/gridicon/style.scss';
import '../vendor/reset.scss';
import './App.scss';

import Ticker                from './Ticker';
import QueryStatusUpdates    from './QueryStatusUpdates';
import KilnStatus            from './KilnStatus';
import QueryTemperatureData  from './QueryTemperatureData';
import TemperatureChart      from './TemperatureChart';
import QueryControllerStatus from './QueryControllerStatus';
import ControllerStatus      from './ControllerStatus';
import Schedules             from './Schedules';

export default function App({ store }) {
	return (
		<div>
			<Ticker />
			<QueryStatusUpdates />
			<KilnStatus />
			<QueryTemperatureData />
			<TemperatureChart />
			<QueryControllerStatus />
			<ControllerStatus />
			<Schedules />
			<StateHistoryDevTool { ...store.stateHistory } />
		</div>
	);
}

App.propTypes = {
	store : React.PropTypes.object,
};
