import React from 'react';
import classNames from 'classnames';

import './SectionBody.scss';

export default function SectionBody({ className, children }) {
	const classes = classNames('SectionBody', className);
	return (
		<div className={ classes }>
			{ children }
		</div>
	);
}

SectionBody.propTypes = {
	className : React.PropTypes.string,
	children  : React.PropTypes.node,
};
