import React from 'react';

import QueryTemperatureData from './QueryTemperatureData';
import TemperatureChart     from './TemperatureChart';

export default function App() {
    return (
        <div>
            <QueryTemperatureData />
            <TemperatureChart />
        </div>
    );
}
