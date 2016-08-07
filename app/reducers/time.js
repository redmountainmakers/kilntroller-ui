export default function time(state = null, action) {
	switch (action.type) {
		case 'TICK':
			return action.timestamp;
	}

	return state || +new Date;
}
