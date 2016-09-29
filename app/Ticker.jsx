import React from 'react';
import { connect } from 'react-redux';

import { sendTick } from './actions/time';

class Ticker extends React.Component {
	componentWillMount() {
		this.schedule();
	}

	componentWillUnmount() {
		this.clear();
	}

	schedule() {
		const now = +new Date;
		const then = 10000 + now - (now % 10000);
		this._timeout = setTimeout(() => {
			// this.props.sendTick(then);
			this.schedule();
		}, then - now);
	}

	clear() {
		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
	}

	render() {
		return null;
	}
}

Ticker.propTypes = {
	sendTick : React.PropTypes.func,
};

export default connect(
	null,
	{ sendTick }
)(Ticker);
