import React from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';
import { omit } from 'lodash';

import { LineChart } from '../vendor/rd3/src';
import Gridicon from '../vendor/gridicon';
import * as utils from './lib/utils';
import {
    isRequestingChartData,
    getChartData,
} from './selectors/chart';

import './TemperatureChart.scss';

class TemperatureChart extends React.Component {
    constructor(props) {
        super(props);

        this.axisTimeFormatter = d3.time.format('%-m/%-d %-I:%M %p');
        this.tooltipTimeFormatter = d3.time.format('%-m/%-d %-I:%M:%S %p');
        this.formatTooltip = this.formatTooltip.bind(this);
    }

    getFormattedData() {
        const { min, data } = this.props;

        const actual = { name : 'Actual', values : [], _missing : 0 };
        const target = { name : 'Target', values : [], _missing : 0 };

        if (data && data.length) {
            data.forEach(value => {
                const x = utils.date(value.timestamp);
                if (typeof value.temperature === 'number') {
                    actual._missing = 0;
                    actual.values.push({ x, y : value.temperature });
                } else if (++actual._missing === 5) {
                    actual.values.push({ x, y : null });
                }
                if (typeof value.setpoint === 'number') {
                    target._missing = 0;
                    target.values.push({ x, y : value.setpoint });
                } else if (++target._missing === 5) {
                    target.values.push({ x, y : null });
                }
            });
        } else {
            // LineChart needs at least 1 data value?
            const x = utils.date(min);
            const y = 0;
            actual.values.push({ x, y });
            target.values.push({ x, y });
        }

        return [omit(actual, '_missing'), omit(target, '_missing')];
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
                Math.max(temperatureRange[1] * 1.4, 100),
            ],
        };
    }

    formatTooltip(d) {
        return [
            this.tooltipTimeFormatter(d.xValue),
            d.seriesName + ': ' + String(d.yValue),
        ].join('<br />');
    }

    render() {
        const { loading, readError } = this.props;
        const circleRadius = {
            inactive : 0,
            active   : 4,
        };
        if (loading) {
            circleRadius.active = 0;
        }

        return (
            <div className="TemperatureChart">
                <h1>
                    <Gridicon icon="stats" size={ 24 }/>
                    Temperature Chart
                </h1>
                <LineChart
                    legend
                    data={ this.getFormattedData() }
                    xAxisFormatter={ this.axisTimeFormatter }
                    domain={ this.getDomain() }
                    tooltipFormat={ this.formatTooltip }
                    width={ 1000 }
                    circleRadius={ circleRadius }
                    showTooltip={ !loading }
                />
                { loading && (
                    <div className="loading">
                        Loading chart data...
                    </div>
                ) }
                { readError && (
                    <div className="error">
                        Error fetching data from API:
                        { readError }
                    </div>
                ) }
            </div>
        );
    }
}

TemperatureChart.propTypes = {
    min       : React.PropTypes.number,
    max       : React.PropTypes.number,
    loading   : React.PropTypes.bool,
    data      : React.PropTypes.array,
    readError : React.PropTypes.string,
};

export default connect((state, props) => {
    const range     = state.chart.range;
    const loading   = isRequestingChartData(state);
    const data      = getChartData(state);
    const readError = state.errors.dataRequest;

    return {
        min : range.min,
        max : range.max,
        loading,
        data,
        readError,
    };
})(TemperatureChart);
