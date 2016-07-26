import React from 'react';
import { connect } from 'react-redux';
import SockJS from 'sockjs-client';
import { forOwn, omit } from 'lodash';
import {
	setCorrectingInterval,
	clearCorrectingInterval,
} from 'correcting-interval';
import debugModule from 'debug';

import {
	receiveStatusUpdate,
	receiveScheduleUpdate,
} from './actions/updates';
import { apiUpdatePath } from './lib/api';
import { UpdateNormalizer } from './lib/utils';

const debug = debugModule('QueryStatusUpdates');

class QueryStatusUpdates extends React.Component {
	componentDidMount() {
		this._updates = new UpdateNormalizer(1000, u => u.timestamp);
		this._updateInterval = setCorrectingInterval(
			this._sendQueuedUpdates.bind(this),
			1000
		);

		this._sock = new SockJS(apiUpdatePath);
		this._sock.onmessage = e => {
			try {
				const update = JSON.parse(e.data);
				if (update && update.type) {
					debug('receive', update);
					this._updates.queue(update);
				}
			} catch (err) {}
		};
	}

	componentWillUnmount() {
		clearCorrectingInterval(this._updateInterval);
		this._sock.close();
		this._sock = null;
	}

	_sendQueuedUpdates() {
		const updates = {};
		this._updates.getCurrentUpdates().forEach(u => {
			debug('send', +new Date, u);
			updates[u.type] = u;
		});
		forOwn(updates, u => this._sendUpdate(u));
	}

	_sendUpdate(update) {
		switch (update.type) {
			case 'update':
				this.props.receiveStatusUpdate(omit(update, 'type'));
				break;
			case 'schedule':
				this.props.receiveScheduleUpdate(update.schedule);
				break;
		}
	}

	render() {
		return null;
	}
}

QueryStatusUpdates.propTypes = {
	receiveStatusUpdate   : React.PropTypes.func,
	receiveScheduleUpdate : React.PropTypes.func,
};

export default connect(
	null,
	{
		receiveStatusUpdate,
		receiveScheduleUpdate,
	}
)(QueryStatusUpdates);
