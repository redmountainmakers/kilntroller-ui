import React from 'react';

import QueryTemperatureData  from './QueryTemperatureData';
import TemperatureChart      from './TemperatureChart';
import QueryControllerStatus from './QueryControllerStatus';
import ControllerStatus      from './ControllerStatus';

export default function App() {
    return (
        <div>
            <QueryTemperatureData />
            <TemperatureChart />
            <QueryControllerStatus />
            <ControllerStatus />
        </div>
    );
}
