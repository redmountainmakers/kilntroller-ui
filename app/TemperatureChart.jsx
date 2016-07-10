import React from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';
import { LineChart } from 'rd3';

import * as utils from './lib/utils';
import {
    isRequestingChartData,
    getChartData,
} from './selectors/chart';

class TemperatureChart extends React.Component {
    getFormattedData() {
        const { min, data } = this.props;

        const actual = { name : 'Actual Temperature', values : [] };
        const target = { name : 'Target Temperature', values : [] };

        if (data && data.length) {
            data.forEach(value => {
                const time = utils.date(value.timestamp);
                if (typeof value.temperature === 'number') {
                    actual.values.push({ x : time, y : value.temperature });
                }
                if (typeof value.setpoint === 'number') {
                    target.values.push({ x : time, y : value.setpoint });
                }
            });
        } else {
            // LineChart needs at least 1 data value?
            actual.values.push({ x : utils.date(min), y : 0 });
            target.values.push({ x : utils.date(min), y : 0 });
        }

        return [actual, target];
    }

    getDomain() {
        const { min, max, data } = this.props;

        let temperatureRange;
        if (data && data.length) {
            temperatureRange = d3.extent(data, point => point.temperature);
        } else {
            temperatureRange = [Infinity, -Infinity];
        }

        return {
            x : [
                utils.date(min),
                utils.date(max),
            ],
            y : [
                Math.min(temperatureRange[0], 0),
                Math.max(temperatureRange[1], 100),
            ],
        };
    }

    render() {
        const { loading } = this.props;

        const timeFormatter = d3.time.format('%-m/%-d %-I:%M %p');

        return (
            <div className="chart">
                <LineChart
                    legend
                    data={ this.getFormattedData() }
                    xAxisFormatter={ timeFormatter }
                    domain={ this.getDomain() }
                    title="Line Chart"
                    width={ 1000 }
                />
                { loading && (
                    <div>Loading...</div>
                ) }
            </div>
        );
    }
}

TemperatureChart.propTypes = {
    min     : React.PropTypes.number,
    max     : React.PropTypes.number,
    loading : React.PropTypes.bool,
    data    : React.PropTypes.array,
};

export default connect((state, props) => {
    const range   = state.chart.range;
    const loading = isRequestingChartData(state);
    const data    = getChartData(state);

    return {
        min : range.min,
        max : range.max,
        loading,
        data,
    };
})(TemperatureChart);
