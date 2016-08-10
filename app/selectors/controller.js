export function isControllerConnected(state) {
	return (
		state.controller.status &&
		state.controller.status.timestamp > 0
	);
}

export function getControllerLastTimestamp(state) {
	return state.controller.status.timestamp;
}
