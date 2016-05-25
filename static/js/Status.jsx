import React from "react";
import d3 from 'd3';

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null
    };
  }
  componentWillMount() {
    d3.json('http://chip1.internal.redmountainmakers.org:3000/status', function(error, status) {
      if (!error) {
        this.setState({status});
      }
    }.bind(this));
  }
  componentDidMount() {}
  generateRows: function() {
    var cols = this.props.cols,  // [{key, label}]
        data = this.props.data;

    return data.map(function(item) {
        // handle the column data within each row
        var cells = cols.map(function(colData) {

            // colData.key might be "T1"
            return <td> {item[colData.key]} </td>;
        });
        return <tr key={item.id}> {cells} </tr>;
    });
}
  render() {
    var StatusStyle = {
      backgroundColor: this.props.backgroundColor,
      height: '100vh',
      width: '100wh',
      marginLeft:0,
      marginRight:'auto',
      display:'flex',
      flexDirection:'column'
    };
    if (!this.state.status) {
      return (
        <div className="Status" style={StatusStyle}>
          loading...
        </div>
      )
    } else {

      return (
        <div className="Status" style={StatusStyle}>
          <table>

                <tbody> {rowComponents} </tbody>
            </table>
        </div>
      );
    }
  }
}
export default Status;
