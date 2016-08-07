export function sendTick(timestamp) {
	return {
		type      : 'TICK',
		timestamp : timestamp,
	};
}
