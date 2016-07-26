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
	sendDummyUpdate,
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
		this._cyclesWithoutUpdate = 0;

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
		const updates = this._updates.getCurrentUpdates();
		if (updates.length) {
			this._cyclesWithoutUpdate = 0;
			const condensedUpdates = {};
			updates.forEach(u => {
				debug('send', +new Date, u);
				condensedUpdates[u.type] = u;
			});
			forOwn(condensedUpdates, u => this._sendUpdate(u));
		} else if (++this._cyclesWithoutUpdate >= 10) {
			if (this._cyclesWithoutUpdate <= 50 || this._cyclesWithoutUpdate % 15 === 0) {
				this.props.sendDummyUpdate();
			}
		}
	}

	_sendUpdate(update) {
		switch (update.type) {
			case 'update':
				this.props.receiveStatusUpdate(omit(update, 'type'));
				break;
			case 'schedule':
				this.props.receiveScheduleUpdate(omit(update, 'type'));
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
	sendDummyUpdate       : React.PropTypes.func,
};

export default connect(
	null,
	{
		receiveStatusUpdate,
		receiveScheduleUpdate,
		sendDummyUpdate,
	}
)(QueryStatusUpdates);
