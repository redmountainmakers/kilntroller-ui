export function isControllerConnected( state ) {
	return (
		state.controller.status.data &&
		state.controller.status.data.timestamp > 0
	);
}

export function getControllerLastTimestamp( state ) {
	return state.controller.status.timestamp;
}
