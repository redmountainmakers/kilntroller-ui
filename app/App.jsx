import React from 'react';

import '../vendor/gridicon/style.scss';
import '../vendor/reset.scss';
import './App.scss';

import QueryStatusUpdates    from './QueryStatusUpdates';
import KilnStatus            from './KilnStatus';
import QueryTemperatureData  from './QueryTemperatureData';
import TemperatureChart      from './TemperatureChart';
import QueryControllerStatus from './QueryControllerStatus';
import ControllerStatus      from './ControllerStatus';

export default function App() {
	return (
		<div>
			<QueryStatusUpdates />
			<KilnStatus />
			<QueryTemperatureData />
			<TemperatureChart />
			<QueryControllerStatus />
			<ControllerStatus />
		</div>
	);
}
