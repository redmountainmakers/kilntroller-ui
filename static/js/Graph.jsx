import d3 from 'd3';
import React from 'react';
import { LineChart } from 'react-d3';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : null,
        };
    }

    componentWillMount() {}
    componentDidMount() {
        /* eslint-disable no-unused-vars */
        d3.json('http://chip1.internal.redmountainmakers.org:3000/history', (err, data) => {
            /* eslint-enable no-unused-vars */
            if (!err) {
                // TODO Redux
                // this.setState({ data });
            }
        });
    }
    render() {
        const GraphStyle = {
            backgroundColor : this.props.backgroundColor,
            height          : '100vh',
            width           : '100vw',
            marinLeft       : '0',
            marginRight     : 'auto',
            overflow        : 'auto',
        };
        if (!this.state.data) {
            return (
                <div className="Graph" style={ GraphStyle }>
                    loading...
                </div>
            );
        } else {
            const ActualData = { name : 'Actual Temperature', values : [] };
            const TargetData = { name : 'Target Temperature', values : [] };
            this.state.data.forEach(value => {
                const time = new Date(value.timestamp);
                ActualData.values.push({ x : time, y : value.temperature });
                TargetData.values.push({ x : time, y : value.target });
            });
            const listData = [ActualData, TargetData];
            console.log(listData);
            return (
                <div className="Graph" style={ GraphStyle }>
                    <LineChart
                        legend
                        data={ listData }
                        xAxisFormatter={ d3.time.format('%-m/%-d %-I:%M %p') }
                        width={ window.innerWidth }
                        height={ window.innerHeight / 2 }
                        title="Line Chart"
                    />
                </div>
            );
        }
    }
}

Graph.propTypes = {
    backgroundColor : React.PropTypes.string,
};

export default Graph;
