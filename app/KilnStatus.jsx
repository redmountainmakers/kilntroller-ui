import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { get } from 'lodash';

import Gridicon from '../vendor/gridicon';
import SectionHeader from './SectionHeader';
import SectionBody from './SectionBody';
import * as utils from './lib/utils';

import './KilnStatus.scss';

class KilnStatus extends React.Component {
	constructor(props) {
		super(props);
		this._isFirstLoad = true;
	}

	render() {
		let body       = null;
		let headerDate = null;

		const { status } = this.props;

		if (status && status.timestamp) {
			function getTemperature(key, addDegrees = true) {
				if (!Array.isArray(key)) {
					key = ['computed', key];
				}
				const value = get(status, key, 0);
				if (value) {
					return utils.round(value) + (addDegrees ? ' °C' : '');
				} else {
					return false;
				}
			}

			const date       = utils.date(status.timestamp);
			const relaysOn   = Boolean(get(status, ['raw', 'R'], false));
			const tempTarget = getTemperature(['setpoint']);
			const tempActual = getTemperature('temperature');
			const temp1      = getTemperature('T1', false);
			const temp2      = getTemperature('T2', false);
			const temp3      = getTemperature('T3', false);

			let outdatedStatus = null;

			const now = moment();
			const diff = now.diff(date, 'seconds');
			if (diff > 10) {
				if (diff < 45) {
					outdatedStatus = `Last updated: ${ diff } seconds ago`;
				} else {
					outdatedStatus = 'Last updated: ' + moment(date).from(now);
				}
			}

			const bodyClass   = outdatedStatus ? 'error' : 'status';
			const relaysClass = relaysOn ? 'relays on' : 'relays off';

			body = (
				<SectionBody className={ bodyClass }>
					{ outdatedStatus && (
						<div className="outdated">
							{ outdatedStatus }
						</div>
					) }
					<div className={ relaysClass }>
						<Gridicon
							icon={ relaysOn ? 'circle' : 'circle-outline' }
							size={ 24 }
						/>
						Heating elements are { relaysOn ? 'ON' : 'OFF' }
					</div>
					<div className="temperatures">
						<Gridicon icon="info-outline" size={ 24 } />
						Temperature: { tempActual }
						<span className="sensors">
							( individual sensors: { temp1 } / { temp2 } / { temp3 } )
						</span>
					</div>
					<div className="temperatures">
						<Gridicon icon="indent-left" size={ 24 } />
						{ tempTarget
							? `Target temperature: ${ tempTarget }`
							: 'Target temperature not set'
						}
					</div>
				</SectionBody>
			);
			headerDate = (
				<small>{ utils.timeFormatters.second(date) }</small>
			);

		} else if (this._isFirstLoad) {
			body = (
				<SectionBody className="loading">
					Loading kiln status...
				</SectionBody>
			);

		} else {
			body = (
				<SectionBody className="error">
					Kiln status unknown
				</SectionBody>
			);

		}

		return (
			<div className="KilnStatus">
				<SectionHeader icon="cog">
					Kiln Status
					{ headerDate }
				</SectionHeader>
				{ body }
			</div>
		);
	}

	renderBody() {
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
