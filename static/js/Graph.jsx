import d3 from 'd3';
import React from 'react';
import {LineChart} from 'react-d3';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentWillMount() {}
    componentDidMount() {
        d3.json('http://chip1.internal.redmountainmakers.org:3000/history', function(error, data) {
            if (!error) {
                this.setState({data})
                // console.log(data);
            }
        }.bind(this));

    }
    render() {
        var GraphStyle = {
            backgroundColor : this.props.backgroundColor,
            height          : '100vh',
            width           : '100vw',
            marinLeft       : '0',
            marginRight     : 'auto',
            overflow        : 'auto'
        };
        if (!this.state.data) {
            return (
                <div className="Graph" style={GraphStyle}>
                    loading...
                </div>
            )
        } else {
            var ActualData = {'name':'Actual Temperature','values':[]};
            var TargetData = {'name':'Target Temperature','values':[]};
            this.state.data.forEach(function(value) {
                var time = new Date(value.timestamp);
                ActualData['values'].push({'x':time,'y':value.temperature})
                TargetData['values'].push({'x':time,'y':value.target})
            });
            var listData = [ActualData,TargetData];
            console.log(listData);
            return (
                <div className="Graph" style={GraphStyle}>
                <LineChart legend={true} data={listData}  xAxisFormatter={d3.time.format('%-m/%-d %-I:%M %p')} width={window.innerWidth} height={window.innerHeight / 2} title="Line Chart"/>
                </div>
            );
        }
    }
}
export default Graph;
