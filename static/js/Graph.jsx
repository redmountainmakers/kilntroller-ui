import React from "react";
import rd3 from 'react-d3';
import d3 from 'd3';


class Graph extends React.Component {
  getInitialState() {
    return {data:null};
  }

  componentWillMount() {}
  componentDidMount() {
    d3.json('http://chip1.internal.redmountainmakers.org:3000/history', function(error, data) {
      if (!error ) {
        this.setState({data})
        // console.log(data);
      }
    }.bind(this));

  }
  render() {
    var LineChart = rd3.LineChart;
    var GraphStyle = {
      backgroundColor: this.props.backgroundColor,
      height: '100vh',
      width: '100vh'
    };
    if (!this.state.data) {
      return (
        <div className="Graph" style={GraphStyle}>
          loading...
        </div>
      )
    } else {
      return (
        <div className="Graph" style={GraphStyle}>
          <LineChart legend={true} data={this.state.data} width={window.innerWidth} height={window.innerHeight / 2} title="Line Chart"/>
        </div>
      );
    }
  }
}
export default Graph;
