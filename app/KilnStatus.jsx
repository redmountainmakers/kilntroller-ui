import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import SectionHeader from './SectionHeader';
import SectionBody from './SectionBody';
import * as utils from './lib/utils';

import './KilnStatus.scss';

class KilnStatus extends React.Component {
	render() {
		return (
			<div className="KilnStatus">
				<SectionHeader icon="info-outline">
					Kiln Status
				</SectionHeader>
				{ this.renderBody() }
			</div>
		);
	}

	renderBody() {
		const { status } = this.props;
		if (!status || !status.timestamp) {
			return (
				<SectionBody className="error">
					Kiln status unknown
				</SectionBody>
			);
		}

		function getTemperature(key) {
			return utils.round(get(status, ['computed', key], 0));
		}

		const date       = utils.date(status.timestamp);
		const relaysOn   = Boolean(get(status, ['raw', 'R'], false));
		const tempTarget = getTemperature('setpoint');
		const tempActual = getTemperature('temperature');
		const temp1      = getTemperature('T1');
		const temp2      = getTemperature('T2');
		const temp3      = getTemperature('T3');

		return (
			<SectionBody className="status">
				<div>{ date.toString() }</div>
				<div>Relays: { relaysOn ? 'ON' : 'OFF' }</div>
				<div>Temperature: { tempActual }</div>
			</SectionBody>
		);
	}
}

KilnStatus.propTypes = {
	status : React.PropTypes.object,
};

export default connect((state, props) => {
	return {
		status : state.updates.status,
	};
})(KilnStatus);
