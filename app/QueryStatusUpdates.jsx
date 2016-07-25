import React from 'react';
import { connect } from 'react-redux';
import SockJS from 'sockjs-client';
import { omit } from 'lodash';

import {
    receiveStatusUpdate,
    receiveScheduleUpdate,
} from './actions/updates';
import { apiUpdatePath } from './lib/api';

class QueryStatusUpdates extends React.Component {
    componentDidMount() {
        this._sock = new SockJS(apiUpdatePath);
        this._sock.onmessage = e => {
            try {
                const update = JSON.parse(e.data);
                if (update && update.type) {
                    this.handleUpdate(update);
                }
            } catch (err) {}
        };
    }

    componentWillUnmount() {
        this._sock.close();
        this._sock = null;
    }

    handleUpdate(update) {
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
