import React from 'react';

import Gridicon from '../vendor/gridicon';

import './SectionHeader.scss';

export default function SectionHeader({ icon, children }) {
	return (
		<h1 className="SectionHeader">
			{ icon && (
				<Gridicon icon={ icon } size={ 24 } />
			) }
			{ children }
		</h1>
	);
}

SectionHeader.propTypes = {
	children : React.PropTypes.node,
	icon     : React.PropTypes.string,
};
