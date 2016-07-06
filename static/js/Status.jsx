import d3    from 'd3';
import React from 'react';

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

    render() {
        var StatusStyle = {
            backgroundColor : this.props.backgroundColor,
            height          : '100vh',
            width           : '100wh',
            marginLeft      : 0,
            marginRight     : 'auto',
            display         : 'flex',
            flexDirection   : 'column'
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
